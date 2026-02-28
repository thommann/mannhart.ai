import express from "express";
import OpenAI from "openai";
import RESOURCES from "./resources.js";

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

// --- Tool definitions (OpenAI function calling) ---

const TOOLS = [
  {
    type: "function",
    function: {
      name: "get_resource",
      description:
        "Get a link to a specific resource such as a video, PDF, website, or profile. Use this whenever the user asks for a link, a document, contact info, or to see a specific resource.",
      parameters: {
        type: "object",
        properties: {
          resource_key: {
            type: "string",
            description: "The resource identifier",
            enum: Object.keys(RESOURCES),
          },
        },
        required: ["resource_key"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "navigate_to_section",
      description:
        "Navigate the user to a specific section of the website. Use this when the user asks to see or go to a section like experience, education, skills, etc.",
      parameters: {
        type: "object",
        properties: {
          section: {
            type: "string",
            description: "The section to navigate to",
            enum: [
              "about",
              "experience",
              "education",
              "skills",
              "featured",
              "contact",
            ],
          },
        },
        required: ["section"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_contact_info",
      description:
        "Get Thomas's contact information. Use when the user asks how to contact or reach Thomas.",
      parameters: {
        type: "object",
        properties: {
          method: {
            type: "string",
            description: "The contact method to provide",
            enum: ["email", "phone", "all"],
          },
        },
        required: ["method"],
      },
    },
  },
];

// --- Tool execution ---

function executeGetResource(args, lang) {
  const resource = RESOURCES[args.resource_key];
  if (!resource) return { error: "Resource not found" };
  return {
    type: resource.type,
    url: resource.url,
    title: resource.title[lang] || resource.title.en,
    description: resource.description?.[lang] || resource.description?.en || "",
  };
}

function executeNavigateToSection(args, lang) {
  const key = `section_${args.section}`;
  const resource = RESOURCES[key];
  if (!resource) return { error: "Section not found" };
  return {
    type: "section",
    url: resource.url,
    title: resource.title[lang] || resource.title.en,
  };
}

function executeGetContactInfo(args, lang) {
  if (args.method === "all") {
    return {
      email: { url: RESOURCES.email.url, title: RESOURCES.email.title[lang] },
      phone: { url: RESOURCES.phone.url, title: RESOURCES.phone.title[lang] },
      website: {
        url: RESOURCES.website.url,
        title: RESOURCES.website.title[lang],
      },
      github: { url: RESOURCES.github.url, title: RESOURCES.github.title[lang] },
    };
  }
  const resource = RESOURCES[args.method];
  if (!resource) return { error: "Contact method not found" };
  return { url: resource.url, title: resource.title[lang] };
}

function executeTool(name, args, lang) {
  switch (name) {
    case "get_resource":
      return executeGetResource(args, lang);
    case "navigate_to_section":
      return executeNavigateToSection(args, lang);
    case "get_contact_info":
      return executeGetContactInfo(args, lang);
    default:
      return { error: "Unknown tool" };
  }
}

// --- System prompts ---

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
- Enjoys: hot tea, cold beer, good food, thick books, old music, and long board game nights

TOOLS & RESOURCES:
You have access to tools that provide links to Thomas's resources. When a user asks for a link, video, PDF, contact information, or to see a section of the website, use the appropriate tool. After receiving tool results, incorporate the links naturally into your response using markdown link syntax: [link text](url). For website sections, use the anchor URL from the tool result (e.g. [Go to Experience](#experience)). Always use markdown links — never paste raw URLs. Keep your response concise.`,

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
- Hobbys: heisser Tee, kaltes Bier, gutes Essen, dicke Bücher, alte Musik und lange Brettspielabende

TOOLS & RESSOURCEN:
Du hast Zugriff auf Tools, die Links zu Thomas' Ressourcen bereitstellen. Wenn der Nutzer nach einem Link, Video, PDF, Kontaktinformationen oder einem Abschnitt der Website fragt, nutze das passende Tool. Nach Erhalt der Tool-Ergebnisse baue die Links natürlich in deine Antwort ein, im Markdown-Format: [Linktext](url). Für Website-Abschnitte nutze die Anker-URL aus dem Tool-Ergebnis (z.B. [Zum Erfahrungs-Bereich](#experience)). Verwende immer Markdown-Links — keine nackten URLs. Halte die Antwort kurz.`,
};

// --- Abuse prevention ---

const rateMap = new Map();
const BURST_LIMIT = 10;
const BURST_WINDOW_MS = 60_000;
const DAILY_LIMIT_PER_IP = 50;

let globalDailyCount = 0;
const GLOBAL_DAILY_LIMIT = 500;

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress;
}

function isRateLimited(ip) {
  if (globalDailyCount >= GLOBAL_DAILY_LIMIT) return true;

  const now = Date.now();
  let entry = rateMap.get(ip);

  if (!entry) {
    entry = { burstStart: now, burstCount: 0, dailyCount: 0, dailyStart: now };
    rateMap.set(ip, entry);
  }

  if (now - entry.dailyStart > 86_400_000) {
    entry.dailyCount = 0;
    entry.dailyStart = now;
  }

  if (entry.dailyCount >= DAILY_LIMIT_PER_IP) return true;

  if (now - entry.burstStart > BURST_WINDOW_MS) {
    entry.burstStart = now;
    entry.burstCount = 0;
  }

  entry.burstCount++;
  entry.dailyCount++;
  globalDailyCount++;

  return entry.burstCount > BURST_LIMIT;
}

setInterval(() => {
  globalDailyCount = 0;
}, 86_400_000);

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateMap) {
    if (now - entry.dailyStart > 86_400_000) rateMap.delete(ip);
  }
}, 300_000);

// --- Input validation ---

const MAX_MESSAGE_LENGTH = 500;
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

// --- Streaming helper: consume a stream, buffer chunks and collect tool calls ---

async function consumeStream(stream, writer) {
  let contentChunks = [];
  let toolCalls = {};
  let finishReason = null;

  for await (const chunk of stream) {
    const choice = chunk.choices?.[0];
    if (!choice) continue;

    if (choice.finish_reason) finishReason = choice.finish_reason;

    const delta = choice.delta;
    if (!delta) continue;

    if (delta.content) {
      contentChunks.push(chunk);
      if (writer) writer(chunk);
    }

    if (delta.tool_calls) {
      for (const tc of delta.tool_calls) {
        const idx = tc.index;
        if (!toolCalls[idx])
          toolCalls[idx] = { id: "", name: "", arguments: "" };
        if (tc.id) toolCalls[idx].id = tc.id;
        if (tc.function?.name) toolCalls[idx].name = tc.function.name;
        if (tc.function?.arguments)
          toolCalls[idx].arguments += tc.function.arguments;
      }
    }
  }

  return { contentChunks, toolCalls: Object.values(toolCalls), finishReason };
}

// --- Chat endpoint with tool calling ---

app.post("/api/chat", async (req, res) => {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const { messages, locale } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const trimmed = messages.slice(-MAX_MESSAGES);
  for (const msg of trimmed) {
    if (!ALLOWED_ROLES.has(msg.role)) {
      return res.status(400).json({ error: "Invalid message role" });
    }
    if (
      typeof msg.content !== "string" ||
      msg.content.length > MAX_MESSAGE_LENGTH
    ) {
      return res.status(400).json({ error: "Message too long" });
    }
  }

  const lang = locale === "de" ? "de" : "en";

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const write = (chunk) => res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    let currentMessages = [
      { role: "system", content: SYSTEM_PROMPT[lang] },
      ...trimmed,
    ];

    // Round 1: request with tools (buffered — don't stream to client yet)
    let stream;
    try {
      stream = await openai.chat.completions.create({
        model: LLM_MODEL,
        max_tokens: 500,
        temperature: 0.7,
        messages: currentMessages,
        tools: TOOLS,
        tool_choice: "auto",
        stream: true,
      });
    } catch (toolErr) {
      // Provider might not support tools — fall back to plain request
      if (toolErr.status === 400 || toolErr.message?.includes("tool")) {
        console.warn("Provider does not support tools, falling back");
        const fallbackStream = await openai.chat.completions.create({
          model: LLM_MODEL,
          max_tokens: 500,
          temperature: 0.7,
          messages: currentMessages,
          stream: true,
        });
        for await (const chunk of fallbackStream) {
          write(chunk);
        }
        res.write("data: [DONE]\n\n");
        res.end();
        return;
      }
      throw toolErr;
    }

    const result = await consumeStream(stream, null); // buffer, don't write

    if (
      result.finishReason === "tool_calls" &&
      result.toolCalls.length > 0
    ) {
      // Build assistant message with tool_calls
      const assistantMsg = {
        role: "assistant",
        content: null,
        tool_calls: result.toolCalls.map((tc) => ({
          id: tc.id,
          type: "function",
          function: { name: tc.name, arguments: tc.arguments },
        })),
      };
      currentMessages.push(assistantMsg);

      // Execute each tool and append results
      for (const tc of result.toolCalls) {
        let args;
        try {
          args = JSON.parse(tc.arguments);
        } catch {
          args = {};
        }
        const toolResult = executeTool(tc.name, args, lang);
        currentMessages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: JSON.stringify(toolResult),
        });
      }

      // Round 2: stream final response (no tools) directly to client
      const finalStream = await openai.chat.completions.create({
        model: LLM_MODEL,
        max_tokens: 500,
        temperature: 0.7,
        messages: currentMessages,
        stream: true,
      });
      await consumeStream(finalStream, write);
    } else {
      // No tool calls — flush buffered content to client
      for (const chunk of result.contentChunks) {
        write(chunk);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("LLM error:", err.message);
    if (!res.headersSent) {
      if (err.status === 429) {
        res.status(503).json({ error: "quota_exceeded" });
      } else {
        res.status(502).json({ error: "LLM request failed" });
      }
    }
  }
});

app.listen(Number(PORT), () => {
  console.log(`Chatbot server running on port ${PORT}`);
  console.log(`Model: ${LLM_MODEL} via ${LLM_BASE_URL}`);
});
