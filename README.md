# mannhart.ai

Personal portfolio site for [t.mannhart.ai](https://t.mannhart.ai), built with [Eleventy](https://www.11ty.dev/) v3 and served in German (`/de/`) and English (`/en/`).

## Quick start

```bash
npm install
npm run dev       # http://localhost:8080
npm run build     # generates _site/
```

## Project structure

```
src/
├── _data/
│   └── translations.js         # all DE + EN strings, structured by section
├── _includes/
│   ├── base.njk                # HTML shell (head, fonts, CSS, hreflang, JS)
│   ├── partials/
│   │   └── lang-switcher.njk   # EN/DE toggle link in nav
│   └── sections/
│       ├── nav.njk
│       ├── hero.njk
│       ├── about.njk
│       ├── experience.njk
│       ├── education.njk
│       ├── skills.njk
│       ├── featured.njk
│       ├── contact.njk
│       └── footer.njk
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── pdf/
├── de/
│   ├── de.json                 # {"locale":"de","lang":"de","layout":"base.njk"}
│   └── index.njk
├── en/
│   ├── en.json                 # {"locale":"en","lang":"en","layout":"base.njk"}
│   └── index.njk
└── index.njk                   # root redirect → /de/
```

## How i18n works

Each language lives in its own directory (`src/de/`, `src/en/`). A JSON data file in each directory sets the `locale` and `lang`. Both `index.njk` files are identical — they do `{% set t = translations[locale] %}` and include the same section partials. All translatable text lives in `src/_data/translations.js`, keyed by locale.

- `/` redirects to `/de/` (meta refresh + JS fallback)
- `/de/` serves the German page with `<html lang="de">`
- `/en/` serves the English page with `<html lang="en">`
- `hreflang` tags on both pages for SEO
- Language switcher in the nav toggles between `/de/` and `/en/`

To add or edit content, update `translations.js`. To change layout or structure, edit the section partials.

## Infrastructure

The site runs on an **Infomaniak OpenStack** VM (Ubuntu 24.04) with **Caddy** for automatic HTTPS.

| Script | Purpose |
|---|---|
| `provision-server.sh` | One-time: creates VM, network, security group, floating IP on OpenStack |
| `setup-server.sh <IP>` | One-time: installs Caddy, builds site, deploys, configures HTTPS |
| `deploy.sh` | Ongoing: builds and rsyncs `_site/` to the server |

### Prerequisites

- DNS: `t.mannhart.ai` A record pointing to the server's floating IP (managed on Hostpoint)
- `.env` file with `OPEN_STACK_PASSWORD` and `SERVER_IP`

### First-time setup

```bash
./provision-server.sh              # creates the VM, outputs a floating IP
# Add DNS A record: t.mannhart.ai → <floating IP>
./setup-server.sh <floating IP>    # installs Caddy, deploys site
```

### Deploying updates

```bash
./deploy.sh    # builds _site/ and rsyncs to server
```

Requires `SERVER_IP=<floating IP>` in `.env`.
