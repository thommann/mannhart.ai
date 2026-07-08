// Chatbot API endpoint baked into the page at build time. Defaults to a
// relative path, which works when the Cloudflare Worker is routed on the
// site's own domain (t.mannhart.ai/api/*) and for local dev via wrangler.
// Set CHATBOT_API_URL to an absolute URL (e.g. the workers.dev endpoint)
// when the API runs on a different origin.
export default process.env.CHATBOT_API_URL || "/api/chat";
