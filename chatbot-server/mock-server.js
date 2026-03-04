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
 *   dark/light/theme/umschalten  → toggle_theme structured action
 *   english/deutsch/sprache      → switch_language structured action
 *   cv/lebenslauf/resume         → CV download link
 *   erfahrung/experience         → section navigation link
 *   kontakt/contact/email        → contact link
 *   anything else                → generic greeting
 */

import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join, extname, resolve } from "path";
import translations from "../src/_data/translations.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_DIR = resolve(join(__dirname, "..", "_site"));
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

function getResponse(userMsg, locale, currentTheme) {
  const msg = userMsg.toLowerCase();
  const t = translations[locale].chatbot;
  const actions = [];

  let text = "";

  if (
    msg.includes("dark") ||
    msg.includes("light") ||
    msg.includes("theme") ||
    msg.includes("umschalten") ||
    msg.includes("modus")
  ) {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    actions.push({ type: "toggle_theme", theme: newTheme });
    text = t.toggleThemeResponse;
  } else if (
    msg.includes("english") ||
    msg.includes("deutsch") ||
    msg.includes("sprache") ||
    msg.includes("language")
  ) {
    if (msg.includes("english") || /\ben\b/.test(msg)) {
      if (locale === "de") {
        actions.push({ type: "switch_language", language: "en" });
        text = "";
      } else {
        text = t.alreadyOnLanguage;
      }
    } else {
      if (locale !== "de") {
        actions.push({ type: "switch_language", language: "de" });
        text = "";
      } else {
        text = t.alreadyOnLanguage;
      }
    }
  } else if (
    msg.includes("cv") ||
    msg.includes("lebenslauf") ||
    msg.includes("resume")
  ) {
    const cvUrl = locale === "de" ? "/assets/pdf/cv-de.pdf" : "/assets/pdf/cv-en.pdf";
    text = t.cvResponse.replace("{url}", cvUrl);
  } else if (msg.includes("erfahrung") || msg.includes("experience")) {
    text = t.experienceResponse;
  } else if (msg.includes("skill")) {
    text = t.skillsResponse;
  } else if (msg.includes("ausbildung") || msg.includes("education")) {
    text = t.educationResponse;
  } else if (
    msg.includes("kontakt") ||
    msg.includes("contact") ||
    msg.includes("email") ||
    msg.includes("reach")
  ) {
    text = t.contactResponse;
  } else if (msg.includes("wer") || msg.includes("who") || msg.includes("about")) {
    text = t.aboutResponse;
  } else {
    text = t.fallbackGreeting;
  }

  return { text, actions };
}

// --- SSE streaming ---

function streamResponse(res, { text, actions }) {
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
      parts.push(words.slice(i, i + 3).join(" ") + " ");
    }
  }

  let i = 0;
  const interval = setInterval(() => {
    if (i >= parts.length) {
      clearInterval(interval);
      if (actions && actions.length > 0) {
        res.write(`event: actions\ndata: ${JSON.stringify({ actions })}\n\n`);
      }
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }
    const chunk = { choices: [{ delta: { content: parts[i] } }] };
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    i++;
  }, 100);
  res.on("close", () => clearInterval(interval));
}

// --- Static file serving ---

function serveStatic(req, res) {
  const pathname = new URL(req.url, "http://localhost").pathname;
  let filePath = resolve(join(SITE_DIR, pathname));

  // Prevent directory traversal
  if (!filePath.startsWith(SITE_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

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

  // Sync fs calls are fine here — this is a dev-only server
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
  const parsedUrl = new URL(req.url, "http://localhost").pathname;

  if (req.method === "POST" && parsedUrl === "/api/chat") {
    let body = "";
    let aborted = false;
    const MAX_BODY = 8 * 1024; // 8 KB
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY && !aborted) {
        aborted = true;
        res.writeHead(413, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Request too large" }));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (aborted) return;
      try {
        const { messages, locale, theme } = JSON.parse(body);
        if (!Array.isArray(messages) || messages.length === 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "messages array is required" }));
          return;
        }
        const lastMsg = messages[messages.length - 1]?.content || "";
        const lang = locale === "de" ? "de" : "en";
        const currentTheme = theme === "light" ? "light" : "dark";
        streamResponse(res, getResponse(lastMsg, lang, currentTheme));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  if (req.method === "GET" && parsedUrl === "/api/health") {
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
