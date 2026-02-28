import express from "express";
import OpenAI from "openai";

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

const SYSTEM_PROMPT = {
  en: `You are a friendly, concise AI assistant on Thomas Mannhart's personal website (t.mannhart.ai). Answer questions about Thomas based on the following information. If asked something you don't know about Thomas, say so honestly. Keep answers brief (2-4 sentences) unless the user asks for detail. Respond in English.

ABOUT THOMAS:
- Full name: Thomas Rolf Mannhart
- Location: Zürich, Switzerland
- Current role: Professional AI Engineer at bbv Software Services AG (since 2025)
- Working on: bbv AI Hub — a Swiss-made, model-agnostic enterprise AI platform going open source
- Day-to-day: Building RAG pipelines, agentic workflows, and LLM integrations across enterprise systems
- Languages spoken: German (native), English (fluent), French (fluent)
- Contact: REDACTED, REDACTED, github.com/thommann

EDUCATION:
- MSc in Informatics (AI specialization), University of Zürich, 2020–2023. Thesis: "KroneDB — Compressing and Querying Time Series Data using the Kronecker Decomposition"
- BSc in Informatics (Software Systems), University of Zürich, 2017–2020. Thesis: "A General-purpose Range Join Algorithm for PostgreSQL". Won the UZH Semester Award 2020.

CAREER:
- 2025–now: Professional AI Engineer at bbv Software Services AG, Zürich. RAG, agentic AI, LLM integrations, platform engineering.
- 2023–2024: Professional Software Engineer at Ergon Informatik AG, Zürich. Time-tracking/workforce planning for retail. Java, Kotlin, Angular.
- 2020–2023: Senior Software Developer at PolygonSoftware, Opfikon. Full-stack, computer vision, ML. Led dev teams.
- 2019–2020: Junior Software Developer at swissbiomechanics ag (ETH spin-off), Zürich. Java biomedical analysis app.

SKILLS:
- Programming: Python (expert), TypeScript/JS (advanced), Java/Kotlin (advanced), SQL (advanced)
- AI: Agent Orchestration (expert), RAG (expert), MCP (advanced)
- Tools: Claude Code (expert), Git/GitHub (expert), Docker (advanced)

TALKS & PROJECTS:
- "KI als Entwicklungspartner" — bbv webinar on integrating AI into the software development lifecycle
- "AI-Augmented Software Engineering" — talk at FHNW Alumni Event 2025
- bbv AI Hub — Swiss-made enterprise AI platform, certified Swiss Made Software, listed on Siemens Xcelerator

PERSONAL:
- Grew up in Zürich, has been tinkering with computers since childhood (started with game modding)
- Enjoys: hot tea, cold beer, good food, thick books, old music, and long board game nights`,

  de: `Du bist ein freundlicher, prägnanter KI-Assistent auf der persönlichen Website von Thomas Mannhart (t.mannhart.ai). Beantworte Fragen über Thomas basierend auf den folgenden Informationen. Wenn du etwas nicht über Thomas weisst, sag es ehrlich. Halte die Antworten kurz (2–4 Sätze), ausser der Nutzer fragt nach Details. Antworte auf Deutsch.

ÜBER THOMAS:
- Vollständiger Name: Thomas Rolf Mannhart
- Wohnort: Zürich, Schweiz
- Aktuelle Rolle: Professional AI Engineer bei bbv Software Services AG (seit 2025)
- Arbeitet an: bbv AI Hub — einer Schweizer, modell-agnostischen Enterprise-KI-Plattform, die Open Source wird
- Alltag: Entwicklung von RAG-Pipelines, agentischen Workflows und LLM-Integrationen in Unternehmenssystemen
- Sprachen: Deutsch (Muttersprache), Englisch (fliessend), Französisch (fliessend)
- Kontakt: REDACTED, REDACTED, github.com/thommann

AUSBILDUNG:
- MSc in Informatik (Spezialisierung AI), Universität Zürich, 2020–2023. Masterarbeit: «KroneDB — Compressing and Querying Time Series Data using the Kronecker Decomposition»
- BSc in Informatik (Software Systems), Universität Zürich, 2017–2020. Bachelorarbeit: «A General-purpose Range Join Algorithm for PostgreSQL». UZH-Semesterpreis 2020.

KARRIERE:
- 2025–heute: Professional AI Engineer bei bbv Software Services AG, Zürich. RAG, Agentic AI, LLM-Integrationen, Platform Engineering.
- 2023–2024: Professional Software Engineer bei Ergon Informatik AG, Zürich. Zeiterfassung/Personalplanung für Detailhandel. Java, Kotlin, Angular.
- 2020–2023: Senior Software Developer bei PolygonSoftware, Opfikon. Full-Stack, Computer Vision, ML. Leitung Dev-Teams.
- 2019–2020: Junior Software Developer bei swissbiomechanics ag (ETH-Spin-off), Zürich. Java-Anwendung für biomedizinische Analysen.

SKILLS:
- Programmierung: Python (Experte), TypeScript/JS (fortgeschritten), Java/Kotlin (fortgeschritten), SQL (fortgeschritten)
- KI: Agent Orchestration (Experte), RAG (Experte), MCP (fortgeschritten)
- Tools: Claude Code (Experte), Git/GitHub (Experte), Docker (fortgeschritten)

VORTRÄGE & PROJEKTE:
- «KI als Entwicklungspartner» — bbv-Webinar über Integration von KI in den Software-Entwicklungszyklus
- «AI-Augmented Software Engineering» — Vortrag am FHNW Alumni Event 2025
- bbv AI Hub — Schweizer Enterprise-KI-Plattform, zertifiziert als Swiss Made Software, gelistet auf Siemens Xcelerator

PERSÖNLICHES:
- In Zürich aufgewachsen, bastelt seit der Kindheit an Computern (angefangen mit Game-Modding)
- Hobbys: heisser Tee, kaltes Bier, gutes Essen, dicke Bücher, alte Musik und lange Brettspielabende`,
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
