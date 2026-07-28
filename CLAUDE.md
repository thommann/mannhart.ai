# CLAUDE.md

## Project Overview

**t.mannhart.ai** is a bilingual (German/English) personal portfolio website for Thomas Mannhart, a Professional AI Engineer. Built with Eleventy v3, vanilla CSS, and vanilla JavaScript. Includes an integrated AI chatbot powered by a Cloudflare Worker with OpenAI-compatible LLM providers.

Live site: https://t.mannhart.ai

## Tech Stack

| Layer | Technology |
|---|---|
| Static site generator | Eleventy (11ty) v3 |
| Templating | Nunjucks (.njk) |
| Styling | Vanilla CSS (single file, CSS custom properties) |
| JavaScript | Vanilla ES modules (no frameworks) |
| Chatbot backend | Cloudflare Worker + OpenAI SDK |
| PDF generation | PDFKit |
| Deployment | GitHub Pages (site) + Cloudflare Workers (chatbot) via GitHub Actions |
| Node version | 22 |
| Package manager | npm |

## Commands

Always run `npm run build` after changes to verify they compile.

```bash
npm install          # Install dependencies
npm run dev          # Local dev server at http://localhost:8080
npm run build        # Build static site to _site/
```

Chatbot worker (separate directory; copy the translation files from `src/_data/` first, see below):
```bash
cd chatbot-server
npm install
npm run dev          # Local worker at http://localhost:8787 (wrangler dev)
npm run check        # Bundle without deploying (wrangler deploy --dry-run)
npm run deploy       # Deploy to Cloudflare (wrangler deploy)
```

CV generation:
```bash
node scripts/generate-cv.js   # Generates PDF CVs to src/assets/pdf/
```

## Things to Avoid

- **Never duplicate content** — all text content lives in `src/_data/translations_en.json` and `src/_data/translations_de.json`. Do not hardcode strings in `.njk` files, JS, server code, or elsewhere. Every user-facing or translatable string (including chatbot prompts, server messages, CV labels, and error messages) must go in the translation files
- **Do not add build tools, linters, or frameworks** unless explicitly requested — the project deliberately uses minimal tooling
- **Do not use `innerHTML`** for user-supplied content (XSS risk) — follow the safe rendering pattern in `chatbot.js`
- **Do not commit `.env` files** or secrets — only `.env.example` is tracked
- **Do not commit `chatbot-server/translations.js`, `chatbot-server/translations_en.json`, `chatbot-server/translations_de.json`, or `chatbot-server/utils.js`** — these are generated at deploy time
- **Do not modify `_site/`** — this is the build output directory, regenerated on every build
- **Do not add external analytics, tracking scripts, or third-party CDN dependencies** without explicit approval
- **Use en dashes without spaces for date/year ranges** in both languages (e.g. `2020–2023`, not `2020 — 2023`)
- **Do not use em dashes (—) in German text** (they are not part of German typography). Do not use Gedankenstriche (dashes to separate sentence parts) in German; use commas instead
- **Never start a paragraph with "Ich"** in German and never have multiple consecutive sentences starting with "Ich"

## Key Entry Points

- `src/_data/translations_en.json` — all English content (website, chatbot prompts, server messages, CV labels)
- `src/_data/translations_de.json` — all German content (same structure as EN)
- `src/_data/translations.js` — thin re-export combining both JSON files into `{ en, de }`
- `src/_includes/base.njk` — HTML shell (head, fonts, theme script, JS)
- `src/_includes/sections/` — page section partials (nav, hero, about, skills, etc.)
- `src/assets/css/style.css` — single CSS file
- `src/assets/js/main.js` — scroll reveal, theme toggle, nav, slideshow
- `src/assets/js/chatbot.js` — chatbot widget UI & API integration
- `chatbot-server/worker.js` — Cloudflare Worker API with OpenAI function calling
- `chatbot-server/wrangler.jsonc` — Worker config (name, vars policy)
- `eleventy.config.js` — i18n plugin + passthrough copy config

## Architecture & Key Patterns

### Internationalization (i18n)

All translatable content is centralized in two JSON files: `src/_data/translations_en.json` (English) and `src/_data/translations_de.json` (German). A thin `translations.js` re-exports them as `{ en, de }` for consumption by Eleventy, the chatbot server, and CV generation.

Both language pages (`src/de/index.njk` and `src/en/index.njk`) are identical — they include the same section partials and differ only by the locale set in their directory data files (`de.json` / `en.json`).

In templates:
```nunjucks
{% set t = translations[locale] %}
{{ t.hero.label }}
{{ t.about.text | safe }}
```

Routes: `/` redirects to `/de/` (meta refresh + JS fallback). `/de/` → German, `/en/` → English.

**To add or edit content**: update the corresponding key in `translations_en.json` and `translations_de.json`. To change layout: edit section partials.

### Chatbot Worker

- Runs as a Cloudflare Worker (`chatbot-server/worker.js`) on its `workers.dev` URL; the frontend calls it cross-origin (CORS restricted to `ALLOWED_ORIGIN`). The endpoint is baked into the site at build time via the `CHATBOT_API_URL` env var (`src/_data/chatbotApi.js`, GitHub Actions variable in production; defaults to `/api/chat` for local dev)
- Uses OpenAI SDK configured to work with any OpenAI-compatible API (OpenAI, Groq, Together AI, Gemini, Mistral)
- Configuration via Cloudflare Worker vars/secrets: `LLM_API_KEY` (secret), `LLM_BASE_URL`, `LLM_MODEL`, `LLM_FALLBACK_MODELS`, `ALLOWED_ORIGIN`. Set via dashboard or `wrangler secret put` — `wrangler.jsonc` uses `keep_vars: true` so deploys don't wipe them. For local dev, put them in `chatbot-server/.dev.vars` (not committed)
- Implements function calling with tools: `get_resource()`, `navigate_to_section()`, `get_contact_info()`, `set_theme()`, `switch_language()`
- System prompt and all server messages come from the translation files via `translations.js`; tool definitions and resources live in `resources.js`
- During deployment, `translations.js`, `translations_en.json`, `translations_de.json`, and `utils.js` are copied from `src/_data/` into `chatbot-server/` (not committed there)
- Rate limiting is in-memory per Worker isolate (best-effort, resets on isolate eviction)

## Development Guidelines

### Adding a New Section
1. Create `src/_includes/sections/<name>.njk`
2. Add translation keys in `translations_en.json` and `translations_de.json`
3. Include the section in both `src/de/index.njk` and `src/en/index.njk`
4. Add styles in `src/assets/css/style.css`
5. Add a section ID for anchor navigation if needed

### CV Updates
- Edit content in `translations_en.json` and `translations_de.json`, then run `node scripts/generate-cv.js`
- Output goes to `src/assets/pdf/`

## CI/CD

### Pull Requests (`build-check.yml`)
- Runs `npm audit --audit-level=moderate`
- Runs `npm run build` to verify the site builds
- Bundles the chatbot worker (`wrangler deploy --dry-run`) to verify it compiles

### Deployment (`deploy.yml`) — on push to `main`
- Builds the site (incl. CV generation) and deploys it to **GitHub Pages** (`actions/deploy-pages`)
- Deploys the chatbot worker to **Cloudflare Workers** (`cloudflare/wrangler-action`)
- Required GitHub Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Required GitHub Variable: `CHATBOT_API_URL` (the worker's absolute `/api/chat` URL)
- See the "Deployment" section in `README.md` for the one-time setup steps

## Additional Rules

SEO and accessibility guidelines are in `.claude/rules/` and load automatically when working on relevant files.
