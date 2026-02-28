import express from "express";
import OpenAI from "openai";
import { existsSync } from "fs";
import { pathToFileURL } from "url";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load translations: ./translations.js (deployed) or ../src/_data/translations.js (local dev)
const localPath = resolve(__dirname, "translations.js");
const devPath = resolve(__dirname, "../src/_data/translations.js");
const translationsPath = existsSync(localPath) ? localPath : devPath;
const translations = (await import(pathToFileURL(translationsPath))).default;

const {
  LLM_API_KEY,
  LLM_BASE_URL = "https://api.openai.com/v1",
  LLM_MODEL = "gpt-4o-mini",
  ALLOWED_ORIGIN = "https://t.mannhart.ai",
  PORT = "3001",
} = process.env;

if (!LLM_API_KEY) {
  console.error("LLM_API_KEY is required");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: LLM_API_KEY, baseURL: LLM_BASE_URL });

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&copy;/g, "©").replace(/\s+/g, " ").trim();
}

const LEVEL_LABELS = {
  en: { 5: "expert", 4: "advanced", 3: "intermediate" },
  de: { 5: "Experte", 4: "fortgeschritten", 3: "mittel" },
};

function buildSystemPrompt(lang) {
  const t = translations[lang];
  const levels = LEVEL_LABELS[lang];

  const intro = stripHtml(t.hero.desc);
  const about = stripHtml(t.about.abstract + " " + t.about.prose);

  const career = t.experience.jobs
    .map((j) => `- ${j.date}: ${j.role}, ${j.company}, ${j.location}. ${j.desc}`)
    .join("\n");

  const education = t.education.items
    .map((e) => {
      let line = `- ${e.degree}, ${e.school}, ${e.year}. ${stripHtml(e.detail)}`;
      if (e.award) line += ` ${e.award.label}.`;
      return line;
    })
    .join("\n");

  const skills = t.skills.groups
    .map((g) => `- ${g.name}: ${g.items.map((i) => `${i.name} (${levels[i.level] || i.level})`).join(", ")}`)
    .join("\n");

  const talks = [
    `- "${t.featured.webinar.title}" — ${stripHtml(t.featured.webinar.desc)}`,
    `- "${stripHtml(t.featured.fhnw.title)}" — ${stripHtml(t.featured.fhnw.desc)}`,
    `- ${t.featured.aiHub.title}: ${stripHtml(t.featured.aiHub.desc)}`,
  ].join("\n");

  const preamble = lang === "de"
    ? `Du bist ein freundlicher, prägnanter KI-Assistent auf der persönlichen Website von Thomas Mannhart (t.mannhart.ai). Beantworte Fragen über Thomas basierend auf den folgenden Informationen. Wenn du etwas nicht über Thomas weisst, sag es ehrlich. Halte die Antworten kurz (2–4 Sätze), ausser der Nutzer fragt nach Details. Antworte auf Deutsch.`
    : `You are a friendly, concise AI assistant on Thomas Mannhart's personal website (t.mannhart.ai). Answer questions about Thomas based on the following information. If asked something you don't know about Thomas, say so honestly. Keep answers brief (2-4 sentences) unless the user asks for detail. Respond in English.`;

  const contactLabel = lang === "de" ? "KONTAKT" : "CONTACT";
  const aboutLabel = lang === "de" ? "ÜBER THOMAS" : "ABOUT THOMAS";
  const careerLabel = lang === "de" ? "KARRIERE" : "CAREER";
  const eduLabel = lang === "de" ? "AUSBILDUNG" : "EDUCATION";
  const skillsLabel = lang === "de" ? "SKILLS" : "SKILLS";
  const talksLabel = lang === "de" ? "VORTRÄGE & PROJEKTE" : "TALKS & PROJECTS";

  return `${preamble}

${aboutLabel}:
${about}

${careerLabel}:
${career}

${eduLabel}:
${education}

${skillsLabel}:
${skills}

${talksLabel}:
${talks}

${contactLabel}:
- REDACTED, REDACTED, github.com/thommann`;
}

const SYSTEM_PROMPT = {
  en: buildSystemPrompt("en"),
  de: buildSystemPrompt("de"),
};

// --- Abuse prevention ---

// Per-IP rate limiter: short burst + daily cap
const rateMap = new Map();
const BURST_LIMIT = 10; // max requests per minute
const BURST_WINDOW_MS = 60_000;
const DAILY_LIMIT_PER_IP = 50;

// Global daily cap (safety net for total spend)
let globalDailyCount = 0;
const GLOBAL_DAILY_LIMIT = 500;

function getClientIp(req) {
  // x-forwarded-for from Caddy: "client, proxy1, proxy2"
  // Take the leftmost (original client) IP
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress;
}

function isRateLimited(ip) {
  // Global daily cap
  if (globalDailyCount >= GLOBAL_DAILY_LIMIT) return true;

  const now = Date.now();
  let entry = rateMap.get(ip);

  if (!entry) {
    entry = { burstStart: now, burstCount: 0, dailyCount: 0, dailyStart: now };
    rateMap.set(ip, entry);
  }

  // Reset daily counter
  if (now - entry.dailyStart > 86_400_000) {
    entry.dailyCount = 0;
    entry.dailyStart = now;
  }

  // Daily per-IP cap
  if (entry.dailyCount >= DAILY_LIMIT_PER_IP) return true;

  // Burst window
  if (now - entry.burstStart > BURST_WINDOW_MS) {
    entry.burstStart = now;
    entry.burstCount = 0;
  }

  entry.burstCount++;
  entry.dailyCount++;
  globalDailyCount++;

  return entry.burstCount > BURST_LIMIT;
}

// Reset global daily counter at midnight
setInterval(() => {
  globalDailyCount = 0;
}, 86_400_000);

// Clean up stale IP entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateMap) {
    if (now - entry.dailyStart > 86_400_000) rateMap.delete(ip);
  }
}, 300_000);

// Input validation constants
const MAX_MESSAGE_LENGTH = 500; // chars per message
const MAX_MESSAGES = 10;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

const app = express();
app.use(express.json({ limit: "4kb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.post("/api/chat", async (req, res) => {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const { messages, locale } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  // Validate each message: only user/assistant roles, bounded length
  const trimmed = messages.slice(-MAX_MESSAGES);
  for (const msg of trimmed) {
    if (!ALLOWED_ROLES.has(msg.role)) {
      return res.status(400).json({ error: "Invalid message role" });
    }
    if (typeof msg.content !== "string" || msg.content.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: "Message too long" });
    }
  }

  const lang = locale === "de" ? "de" : "en";

  try {
    const stream = await openai.chat.completions.create({
      model: LLM_MODEL,
      max_tokens: 300,
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT[lang] },
        ...trimmed,
      ],
      stream: true,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("LLM error:", err.message);
    if (!res.headersSent) {
      res.status(502).json({ error: "LLM request failed" });
    }
  }
});

app.listen(Number(PORT), () => {
  console.log(`Chatbot server running on port ${PORT}`);
  console.log(`Model: ${LLM_MODEL} via ${LLM_BASE_URL}`);
});
