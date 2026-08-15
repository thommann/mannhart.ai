// Chatbot API endpoint baked into the page at build time. In production the
// CHATBOT_API_URL repo variable points at the Cloudflare Worker's workers.dev
// endpoint; the relative default covers local dev (wrangler dev + a proxy or
// same-origin setup).
export default process.env.CHATBOT_API_URL || "/api/chat";
