/**
 * Mock chatbot server for local development (zero external dependencies).
 * Serves the static site from _site/ AND handles /api/chat with mock responses,
 * so you only need one process for local testing.
 *
 * Mimics the real server's SSE streaming format without requiring an LLM API key.
 *
 * Usage:
 *   npm run dev:mock   # builds site, then serves with mock chatbot on :8080
 *
 * Responds to keywords in user messages:
 *   dark/light/theme/umschalten  → toggle_theme action link
 *   english/deutsch/sprache      → switch_language action link
 *   cv/lebenslauf/resume         → CV download link
 *   erfahrung/experience         → section navigation link
 *   kontakt/contact/email        → contact link
 *   anything else                → generic greeting
 */

import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_DIR = join(__dirname, "..", "_site");
const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

// --- Mock response logic ---

function getResponse(userMsg, locale) {
  const msg = userMsg.toLowerCase();
  const isDe = locale === "de";

  if (
    msg.includes("dark") ||
    msg.includes("light") ||
    msg.includes("theme") ||
    msg.includes("umschalten") ||
    msg.includes("modus")
  ) {
    const label = isDe ? "Dark Mode umschalten" : "Toggle dark mode";
    return isDe
      ? `Klar, ich schalte das für dich um! [${label}](#action:toggle-theme)`
      : `Sure, toggling for you! [${label}](#action:toggle-theme)`;
  }

  if (
    msg.includes("english") ||
    msg.includes("deutsch") ||
    msg.includes("sprache") ||
    msg.includes("language")
  ) {
    if (msg.includes("english") || msg.includes("en")) {
      return isDe
        ? "Ich wechsle zu Englisch! [Switch to English](#action:switch-lang-en)"
        : "You're already on the English version!";
    }
    return isDe
      ? "Du bist bereits auf Deutsch!"
      : "Switching to German! [Zu Deutsch wechseln](#action:switch-lang-de)";
  }

  if (
    msg.includes("cv") ||
    msg.includes("lebenslauf") ||
    msg.includes("resume")
  ) {
    const cvUrl = isDe ? "/assets/pdf/cv-de.pdf" : "/assets/pdf/cv-en.pdf";
    return isDe
      ? `Hier ist Thomas' CV: [CV herunterladen](${cvUrl})`
      : `Here's Thomas's CV: [Download CV](${cvUrl})`;
  }

  if (msg.includes("erfahrung") || msg.includes("experience")) {
    return isDe
      ? "Schau dir Thomas' Berufserfahrung an: [Erfahrung](#experience)"
      : "Check out Thomas's work experience: [Experience](#experience)";
  }

  if (msg.includes("skill")) {
    return isDe
      ? "Hier sind Thomas' Skills: [Skills](#skills)"
      : "Here are Thomas's skills: [Skills](#skills)";
  }

  if (msg.includes("ausbildung") || msg.includes("education")) {
    return isDe
      ? "Hier ist Thomas' Ausbildung: [Ausbildung](#education)"
      : "Here's Thomas's education: [Education](#education)";
  }

  if (
    msg.includes("kontakt") ||
    msg.includes("contact") ||
    msg.includes("email") ||
    msg.includes("reach")
  ) {
    return isDe
      ? "Kontaktiere Thomas per E-Mail: [thomas@mannhart.ai](mailto:thomas@mannhart.ai)"
      : "Contact Thomas by email: [thomas@mannhart.ai](mailto:thomas@mannhart.ai)";
  }

  if (msg.includes("wer") || msg.includes("who") || msg.includes("about")) {
    return isDe
      ? "Thomas Mannhart ist ein Professional AI Engineer aus Zürich. Er entwickelt Enterprise-KI-Lösungen und leitet Kundenprojekte. Mehr unter [Über mich](#about)."
      : "Thomas Mannhart is a Professional AI Engineer based in Zürich. He builds enterprise AI solutions and leads customer projects. More at [About](#about).";
  }

  return isDe
    ? "Ich bin Thomas' KI-Assistent! Frag mich etwas über ihn, oder ich kann den Dark Mode umschalten, die Sprache wechseln oder dir seinen CV zeigen."
    : "I'm Thomas's AI assistant! Ask me about him, or I can toggle dark mode, switch language, or show you his CV.";
}

// --- SSE streaming ---

function streamResponse(res, text) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Split into chunks, keeping markdown links intact
  const parts = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIdx = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    const before = text.slice(lastIdx, match.index);
    if (before) {
      const words = before.split(" ").filter((w) => w);
      for (let i = 0; i < words.length; i += 3) {
        parts.push(words.slice(i, i + 3).join(" ") + " ");
      }
    }
    parts.push(match[0]);
    lastIdx = match.index + match[0].length;
  }
  const tail = text.slice(lastIdx);
  if (tail) {
    const words = tail.split(" ").filter((w) => w);
    for (let i = 0; i < words.length; i += 3) {
      parts.push(words.slice(i, i + 3).join(" "));
    }
  }

  let i = 0;
  const interval = setInterval(() => {
    if (i >= parts.length) {
      clearInterval(interval);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }
    const chunk = { choices: [{ delta: { content: parts[i] } }] };
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    i++;
  }, 100);
}

// --- Static file serving ---

function serveStatic(req, res) {
  let filePath = join(SITE_DIR, req.url);

  // Directory → index.html
  if (filePath.endsWith("/")) {
    filePath = join(filePath, "index.html");
  }

  // Try exact path, then with .html extension
  const tryPaths = [filePath];
  if (!extname(filePath)) {
    tryPaths.push(filePath + ".html");
    tryPaths.push(join(filePath, "index.html"));
  }

  for (const p of tryPaths) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      const ext = extname(p);
      const mime = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime });
      fs.createReadStream(p).pipe(res);
      return;
    }
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
}

// --- HTTP server ---

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // API routes
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { messages, locale } = JSON.parse(body);
        if (!Array.isArray(messages) || messages.length === 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "messages array is required" }));
          return;
        }
        const lastMsg = messages[messages.length - 1]?.content || "";
        const lang = locale === "de" ? "de" : "en";
        streamResponse(res, getResponse(lastMsg, lang));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", mock: true }));
    return;
  }

  // Static files
  serveStatic(req, res);
});

server.listen(Number(PORT), () => {
  console.log(`\nMock dev server running on http://localhost:${PORT}`);
  console.log(`Serving static site from ${SITE_DIR}`);
  console.log("Chat keywords: dark mode, language, cv, experience, contact, who\n");
});
