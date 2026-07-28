# t.mannhart.ai

Source code for my personal website at [t.mannhart.ai](https://t.mannhart.ai).

I'm Thomas Mannhart, a Professional AI Engineer at [bbv Software Services](https://en.bbv.ch/) in Zürich. My team and I are building the [Swiss AI Hub](https://bbvch-ai.github.io/swiss-ai-hub.ch/) ([Core Docs](https://bbvch-ai.github.io/aihub-core/)) — a Swiss-made, model-agnostic AI platform for organizations of any size. I also design custom AI solutions for customers, with a focus on RAG systems and agentic workflows.

## About the site

A bilingual (German/English) portfolio website built with [Eleventy](https://www.11ty.dev/) v3, vanilla CSS, and vanilla JavaScript. It includes an integrated AI chatbot you can talk to about me and my work.

Code and design were written by AI under my guidance ([vibe coded](https://en.wikipedia.org/wiki/Vibe_coding)).

## Deployment

The site is hosted on **GitHub Pages**; the chatbot API runs as a **Cloudflare Worker** (free plan). Both are deployed by `.github/workflows/deploy.yml` on every push to `main`.

One-time setup:

1. **DNS**: At the DNS provider for `mannhart.ai`, point `t.mannhart.ai` at GitHub Pages with a CNAME record `t` → `thommann.github.io` (DNS stays where it is — Cloudflare is only used for the worker).
2. **GitHub Pages**: In the repo, go to *Settings → Pages*, set *Source* to **GitHub Actions**, and enter `t.mannhart.ai` as the custom domain (with *Enforce HTTPS*).
3. **Cloudflare Worker**: Create a (free) Cloudflare account, then an API token (template *Edit Cloudflare Workers*) and add it as the GitHub secret `CLOUDFLARE_API_TOKEN`, plus the account ID as `CLOUDFLARE_ACCOUNT_ID`.
4. **Worker config** (after the first deploy created the worker): Set the secret `LLM_API_KEY` (Cloudflare dashboard or `wrangler secret put LLM_API_KEY` in `chatbot-server/`) and optionally the vars `LLM_BASE_URL`, `LLM_MODEL`, `LLM_FALLBACK_MODELS`, `ALLOWED_ORIGIN`.
5. **API URL**: Set the GitHub Actions **variable** `CHATBOT_API_URL` to the worker's endpoint, e.g. `https://mannhart-chatbot.<subdomain>.workers.dev/api/chat`, then re-run the deploy so the site is rebuilt with it.

The frontend calls the worker cross-origin; the worker allows this via CORS for `ALLOWED_ORIGIN` (default `https://t.mannhart.ai`).

## Get in touch

- [Website](https://t.mannhart.ai)
- [GitHub](https://github.com/thommann)
- [Email](mailto:thomas@mannhart.ai)
