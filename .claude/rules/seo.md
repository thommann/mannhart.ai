---
paths:
  - "src/_includes/**/*.njk"
  - "src/_data/translations.js"
  - "eleventy.config.js"
---

# SEO Guidelines

## Current State
The site has good SEO fundamentals: meta descriptions, Open Graph tags, `hreflang` alternates, semantic HTML, and proper heading hierarchy. The following areas need attention.

## Requirements for All New Pages/Content
- **Meta tags**: every page must have `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:image`, `og:url` — these are already templated in `base.njk`
- **Hreflang**: always maintain `<link rel="alternate" hreflang="de">`, `hreflang="en"`, and `hreflang="x-default">` on every page
- **Canonical URLs**: add `<link rel="canonical" href="...">` pointing to the preferred language version of each page
- **Heading hierarchy**: one `<h1>` per page (hero section), `<h2>` for section titles, `<h3>` for subsections — never skip levels

## Missing SEO Features (To Be Added)
- **robots.txt** — add to `src/` with passthrough copy in `eleventy.config.js`
- **sitemap.xml** — generate via Eleventy plugin or static file listing `/de/` and `/en/`
- **JSON-LD structured data** — add `Person` schema in `base.njk` `<head>` with name, jobTitle, url, sameAs (LinkedIn, GitHub)
- **Twitter Card tags** — add `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` in `base.njk`
- **Canonical tags** — add `<link rel="canonical">` for each language page
- **Favicon / Apple Touch Icon** — add proper favicon meta tags

## Image SEO
- All `<img>` elements **must** have descriptive `alt` text (already done — maintain this)
- Use `loading="lazy"` on images below the fold
- Prefer modern formats (WebP) with `<picture>` fallbacks when adding new images
- Keep image file sizes under 200KB where possible

## Bilingual SEO Rules
- Content in `translations.js` must be **native-language content**, not machine-translated
- Meta descriptions should be unique and compelling per language (not direct translations)
- URL structure (`/de/`, `/en/`) is correct — do not change to query parameters or subdomains
