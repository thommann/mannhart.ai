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

## Project Structure

```
src/
├── _data/
│   ├── translations.js       # ALL content (DE + EN), organized by section
│   └── utils.js               # stripHtml(), SKILL_LEVELS constants
├── _includes/
│   ├── base.njk               # HTML shell (head, fonts, theme script, JS)
│   ├── partials/
│   │   ├── lang-switcher.njk
│   │   └── lang-switcher-inline.njk
│   └── sections/              # Page section partials
│       ├── nav.njk
│       ├── hero.njk
│       ├── about.njk
│       ├── experience.njk
│       ├── education.njk
│       ├── skills.njk
│       ├── featured.njk
│       ├── contact.njk
│       ├── chatbot.njk
│       └── footer.njk
├── assets/
│   ├── css/style.css          # Single CSS file (~1200 lines)
│   ├── js/
│   │   ├── main.js            # Scroll reveal, theme toggle, nav, slideshow
│   │   └── chatbot.js         # Chatbot widget UI & API integration
│   ├── fonts/                 # Self-hosted WOFF2 fonts
│   ├── img/
│   └── pdf/                   # Generated CV PDFs
├── de/
│   ├── de.json                # {"locale":"de","lang":"de","layout":"base.njk"}
│   └── index.njk
├── en/
│   ├── en.json                # {"locale":"en","lang":"en","layout":"base.njk"}
│   └── index.njk
└── index.njk                  # Root redirect → /de/

chatbot-server/
├── server.js                  # Express API with OpenAI function calling
├── resources.js               # Bilingual resource links (CVs, videos, etc.)
├── .env.example               # LLM provider config template
├── chatbot.service            # systemd unit file
└── package.json

scripts/
└── generate-cv.js             # PDFKit CV generator (reads translations.js)

.github/workflows/
├── build-check.yml            # PR: npm audit + build check
└── deploy.yml                 # main: build + rsync site + deploy chatbot

eleventy.config.js             # i18n plugin + passthrough copy config
```

## Architecture & Key Patterns

### Internationalization (i18n)

All translatable content is centralized in `src/_data/translations.js` as a single export with `{ en: {...}, de: {...} }` structure. Both language pages (`src/de/index.njk` and `src/en/index.njk`) are identical — they include the same section partials and differ only by the locale set in their directory data files (`de.json` / `en.json`).

In templates:
```nunjucks
{% set t = translations[locale] %}
{{ t.hero.label }}
{{ t.about.text | safe }}
```

Routes:
- `/` redirects to `/de/` (meta refresh + JS fallback)
- `/de/` → German page (`<html lang="de">`)
- `/en/` → English page (`<html lang="en">`)

**To add or edit content**: update `translations.js`. To change layout: edit section partials.

### Styling Conventions

- **Single CSS file**: `src/assets/css/style.css`
- **CSS custom properties** for theming (dark mode default):
  - Colors: `--bg`, `--bg-elevated`, `--bg-card`, `--text`, `--text-muted`, `--accent` (#d4a574), `--border`, `--bg-alt`
  - Fonts: `--serif` (Instrument Serif), `--sans` (DM Sans), `--mono` (JetBrains Mono)
- **Light mode**: toggled via `[data-theme="light"]` attribute on `<html>`
- **BEM-inspired class names**: `.section-wrap`, `.timeline-item`, `.skill-group`
- **Animations**: `.reveal` class triggers fade-in via IntersectionObserver; keyframes: `fadeUp`, `fadeIn`, `slideIn`
- **Responsive**: mobile-first with `@media (max-width: ...)` breakpoints

### JavaScript Conventions

- **No frameworks or libraries** — everything is vanilla JS
- `main.js`: scroll reveal (IntersectionObserver), mobile nav toggle, theme toggle (localStorage), smooth scroll, FHNW slideshow
- `chatbot.js`: standalone chatbot widget with safe markdown rendering (no `innerHTML` for user content), XSS-safe
- DOM manipulation via `document.querySelector()`, classList methods
- Theme preference persisted to `localStorage`

### HTML Conventions

- Semantic elements: `<nav>`, `<section>`, `<footer>`
- ARIA attributes: `aria-label`, `aria-expanded`
- Section IDs for anchor navigation: `id="about"`, `id="experience"`, etc.
- SVG icons inlined for performance
- `{{ content | safe }}` only for trusted HTML from translations

### Chatbot Server

- Uses OpenAI SDK configured to work with any OpenAI-compatible API (OpenAI, Groq, Together AI, Gemini, Mistral)
- Configuration via `.env`: `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`, `ALLOWED_ORIGIN`, `PORT`
- Implements function calling with tools: `get_resource()`, `navigate_to_section()`, `get_contact_info()`
- System prompt auto-generated from `translations.js` and `resources.js`
- During deployment, `translations.js` and `utils.js` are copied from `src/_data/` into `chatbot-server/`

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

## Development Guidelines

### Content Changes
1. Edit `src/_data/translations.js` — all text lives here, organized by section
2. Always update **both** `en` and `de` keys when adding/modifying content
3. Run `npm run build` to verify changes compile correctly

### Adding a New Section
1. Create `src/_includes/sections/<name>.njk`
2. Add the corresponding translation keys in `translations.js` under both locales
3. Include the section in both `src/de/index.njk` and `src/en/index.njk`
4. Add styles in `src/assets/css/style.css`
5. Add a section ID for anchor navigation if needed

### Chatbot Changes
- `chatbot-server/server.js` — API logic and LLM integration
- `chatbot-server/resources.js` — resource links shown in responses
- `src/assets/js/chatbot.js` — frontend widget
- `src/_includes/sections/chatbot.njk` — widget HTML template
- Remember: `translations.js` and `utils.js` are copied into `chatbot-server/` at deploy time (not committed there)

### CV Updates
- Edit content in `translations.js`, then run `node scripts/generate-cv.js`
- Output goes to `src/assets/pdf/`
- The script reads from `translations.js` and uses `utils.js` helpers

## Things to Avoid

- **Do not add build tools, linters, or frameworks** unless explicitly requested — the project deliberately uses minimal tooling
- **Do not use `innerHTML`** for user-supplied content (XSS risk) — follow the safe rendering pattern in `chatbot.js`
- **Do not commit `.env` files** or secrets — only `.env.example` is tracked
- **Do not commit `chatbot-server/translations.js` or `chatbot-server/utils.js`** — these are generated at deploy time
- **Do not modify `_site/`** — this is the build output directory, regenerated on every build
- **Do not add external analytics, tracking scripts, or third-party CDN dependencies** without explicit approval
