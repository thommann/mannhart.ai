# CLAUDE.md

## Project Overview

**mannhart.ai** is a bilingual (German/English) personal portfolio website for Thomas Mannhart, a Professional AI Engineer. Built with Eleventy v3, vanilla CSS, and vanilla JavaScript. Includes an integrated AI chatbot powered by an Express server with OpenAI-compatible LLM providers.

Live site: https://t.mannhart.ai

## Tech Stack

| Layer | Technology |
|---|---|
| Static site generator | Eleventy (11ty) v3 |
| Templating | Nunjucks (.njk) |
| Styling | Vanilla CSS (single file, CSS custom properties) |
| JavaScript | Vanilla ES modules (no frameworks) |
| Chatbot backend | Node.js + Express 5 + OpenAI SDK |
| PDF generation | PDFKit |
| Deployment | GitHub Actions → rsync → systemd |
| Hosting | Self-hosted OpenStack VM |
| Node version | 22 |
| Package manager | npm |

## Commands

Always run `npm run build` after changes to verify they compile.

```bash
npm install          # Install dependencies
npm run dev          # Local dev server at http://localhost:8080
npm run build        # Build static site to _site/
```

Chatbot server (separate directory):
```bash
cd chatbot-server
npm install
npm start            # Starts Express on PORT (default 3001)
```

CV generation:
```bash
node scripts/generate-cv.js   # Generates PDF CVs to src/assets/pdf/
```

## Things to Avoid

- **Never duplicate content** — all text content lives in `src/_data/translations.js` and is referenced from templates. Do not hardcode strings in `.njk` files, JS, or elsewhere
- **Do not add build tools, linters, or frameworks** unless explicitly requested — the project deliberately uses minimal tooling
- **Do not use `innerHTML`** for user-supplied content (XSS risk) — follow the safe rendering pattern in `chatbot.js`
- **Do not commit `.env` files** or secrets — only `.env.example` is tracked
- **Do not commit `chatbot-server/translations.js` or `chatbot-server/utils.js`** — these are generated at deploy time
- **Do not modify `_site/`** — this is the build output directory, regenerated on every build
- **Do not add external analytics, tracking scripts, or third-party CDN dependencies** without explicit approval
- **Use en dashes without spaces for date/year ranges** in both languages (e.g. `2020–2023`, not `2020 — 2023`)
- **Do not use em dashes (—) in German text** (they are not part of German typography). Do not use Gedankenstriche (dashes to separate sentence parts) in German; use commas instead
- **Never start a paragraph with "Ich"** in German and never have multiple consecutive sentences starting with "Ich"

## Key Entry Points

- `src/_data/translations.js` — ALL content (DE + EN), organized by section
- `src/_includes/base.njk` — HTML shell (head, fonts, theme script, JS)
- `src/_includes/sections/` — page section partials (nav, hero, about, skills, etc.)
- `src/assets/css/style.css` — single CSS file
- `src/assets/js/main.js` — scroll reveal, theme toggle, nav, slideshow
- `src/assets/js/chatbot.js` — chatbot widget UI & API integration
- `chatbot-server/server.js` — Express API with OpenAI function calling
- `eleventy.config.js` — i18n plugin + passthrough copy config

## Architecture & Key Patterns

### Internationalization (i18n)

All translatable content is centralized in `src/_data/translations.js` as a single export with `{ en: {...}, de: {...} }` structure. Both language pages (`src/de/index.njk` and `src/en/index.njk`) are identical — they include the same section partials and differ only by the locale set in their directory data files (`de.json` / `en.json`).

In templates:
```nunjucks
{% set t = translations[locale] %}
{{ t.hero.label }}
{{ t.about.text | safe }}
```

Routes: `/` redirects to `/de/` (meta refresh + JS fallback). `/de/` → German, `/en/` → English.

**To add or edit content**: update `translations.js` (both `en` and `de` keys). To change layout: edit section partials.

### Chatbot Server

- Uses OpenAI SDK configured to work with any OpenAI-compatible API (OpenAI, Groq, Together AI, Gemini, Mistral)
- Configuration via `.env`: `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`, `ALLOWED_ORIGIN`, `PORT`
- Implements function calling with tools: `get_resource()`, `navigate_to_section()`, `get_contact_info()`
- System prompt auto-generated from `translations.js` and `resources.js`
- During deployment, `translations.js` and `utils.js` are copied from `src/_data/` into `chatbot-server/` (not committed there)

## Development Guidelines

### Adding a New Section
1. Create `src/_includes/sections/<name>.njk`
2. Add translation keys in `translations.js` under both `en` and `de`
3. Include the section in both `src/de/index.njk` and `src/en/index.njk`
4. Add styles in `src/assets/css/style.css`
5. Add a section ID for anchor navigation if needed

### CV Updates
- Edit content in `translations.js`, then run `node scripts/generate-cv.js`
- Output goes to `src/assets/pdf/`

## CI/CD

### Pull Requests (`build-check.yml`)
- Runs `npm audit --audit-level=moderate`
- Runs `npm run build` to verify the site builds

### Deployment (`deploy.yml`) — on push to `main`
1. `npm ci && npm run build`
2. rsync `_site/` to `/var/www/mannhart.ai/` (excludes `.well-known/`)
3. Copy `translations.js` and `utils.js` into `chatbot-server/`
4. rsync `chatbot-server/` to `/var/www/chatbot-server/`
5. SSH: `npm install --production && systemctl restart chatbot`
6. Health check: `curl http://localhost:3001/api/health`

**Required GitHub Secrets**: `SSH_PRIVATE_KEY`, `SERVER_IP`

## Additional Rules

SEO and accessibility guidelines are in `.claude/rules/` and load automatically when working on relevant files.
