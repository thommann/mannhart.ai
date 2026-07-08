import OpenAI from "openai";
import RESOURCES from "./resources.js";
import translations from "./translations.js";
import { stripHtml, SKILL_LEVELS } from "./utils.js";

const MAX_TOKENS = 5000;

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
              "beyond-work",
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
            enum: ["email", "all"],
          },
        },
        required: ["method"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_theme",
      description:
        "Set the website to dark or light mode. Use when the user asks to switch theme, enable/disable dark mode, or change the appearance. Check the <state> block for the current theme before calling.",
      parameters: {
        type: "object",
        properties: {
          theme: {
            type: "string",
            enum: ["dark", "light"],
            description: "The target theme to set",
          },
        },
        required: ["theme"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "switch_language",
      description:
        "Switch the website language between German and English. Use when the user asks to change language or view the site in a different language.",
      parameters: {
        type: "object",
        properties: {
          language: {
            type: "string",
            enum: ["en", "de"],
            description: "The target language to switch to",
          },
        },
        required: ["language"],
      },
    },
  },
];

const VALID_LANGUAGES = new Set(["en", "de"]);

// --- Tool execution ---

function resolveUrl(resource, lang) {
  return typeof resource.url === "string"
    ? resource.url
    : resource.url[lang] || resource.url.en;
}

function executeGetResource(args, lang) {
  const resource = RESOURCES[args.resource_key];
  if (!resource) return { error: "Resource not found" };
  return {
    type: resource.type,
    url: resolveUrl(resource, lang),
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
    url: resolveUrl(resource, lang),
    title: resource.title[lang] || resource.title.en,
  };
}

function executeGetContactInfo(args, lang) {
  if (args.method === "all") {
    return {
      email: { url: resolveUrl(RESOURCES.email, lang), title: RESOURCES.email.title[lang] },
      website: {
        url: resolveUrl(RESOURCES.website, lang),
        title: RESOURCES.website.title[lang],
      },
      github: { url: resolveUrl(RESOURCES.github, lang), title: RESOURCES.github.title[lang] },
    };
  }
  const resource = RESOURCES[args.method];
  if (!resource) return { error: "Contact method not found" };
  return { url: resolveUrl(resource, lang), title: resource.title[lang] };
}

const VALID_THEMES = new Set(["dark", "light"]);

function executeSetTheme(args, lang, currentTheme) {
  const target = VALID_THEMES.has(args.theme) ? args.theme : (currentTheme === "light" ? "dark" : "light");
  const t = translations[lang].serverMessages;
  const themeName = target === "dark" ? translations[lang].chatbot.themeDark : translations[lang].chatbot.themeLight;
  if (target === currentTheme) {
    return { type: "info", message: t.alreadyOnTheme.replace("{theme}", themeName) };
  }
  return {
    type: "action",
    label: t.switchToTheme.replace("{theme}", themeName),
    newTheme: target,
  };
}

function executeSwitchLanguage(args, lang) {
  const target = VALID_LANGUAGES.has(args.language) ? args.language : (lang === "de" ? "en" : "de");
  const t = translations[lang].serverMessages;
  if (target === lang) {
    return { type: "info", message: t.alreadyOnLanguage };
  }
  return {
    type: "action",
    label: translations[target].serverMessages.switchToLanguage,
    targetLanguage: target,
  };
}

function executeTool(name, args, lang, currentTheme) {
  switch (name) {
    case "get_resource":
      return executeGetResource(args, lang);
    case "navigate_to_section":
      return executeNavigateToSection(args, lang);
    case "get_contact_info":
      return executeGetContactInfo(args, lang);
    case "set_theme":
      return executeSetTheme(args, lang, currentTheme);
    case "switch_language":
      return executeSwitchLanguage(args, lang);
    default:
      return { error: "Unknown tool" };
  }
}

// --- System prompt generation ---

function buildContext(locale) {
  const t = translations[locale];
  const levels = SKILL_LEVELS[locale];

  const bio = stripHtml(t.about.abstract);

  const career = t.experience.jobs
    .map((j) => `${j.date}: ${j.role}, ${j.company}, ${j.location}. ${j.desc}`)
    .join("\n");

  const education = t.education.items
    .slice()
    .reverse()
    .map((e) => {
      let line = `${e.degree}, ${e.school}, ${e.year}. ${stripHtml(e.detail)}`;
      if (e.award) line += ` ${e.award.label}.`;
      return line;
    })
    .join("\n");

  const skills = t.skills.groups
    .map((g) => {
      const items = g.items
        .map((s) => `${s.name} (${levels[s.level] || s.level})`)
        .join(", ");
      return `${g.name}: ${items}.`;
    })
    .join("\n");

  const projects = [
    `"${stripHtml(t.featured.webinar.title)}" — ${stripHtml(t.featured.webinar.desc)}`,
    `"${stripHtml(t.featured.fhnw.title)}" — ${stripHtml(t.featured.fhnw.desc)}`,
    `${stripHtml(t.featured.aiHub.title)} — ${stripHtml(t.featured.aiHub.desc)}`,
  ].join("\n");

  const beyondWork = t.beyondWork.stories
    .map((s) => `${s.location} (${s.context}): ${stripHtml(s.text)}`)
    .join("\n");

  const resources = Object.entries(RESOURCES)
    .filter(([ , r]) => r.type !== "section")
    .map(([key, r]) => `${key}: ${r.title[locale] || r.title.en} — ${resolveUrl(r, locale)}`)
    .join("\n");

  return `<context>
<bio>
${bio}
${t.about.languages}.
</bio>

<about>
${stripHtml(t.about.prose)}
</about>

<career>
${career}
</career>

<education>
${education}
</education>

<skills>
${skills}
</skills>

<projects>
${projects}
</projects>

<personal>
${t.about.personal}
</personal>

<beyond-work>
${stripHtml(t.beyondWork.intro)}
${beyondWork}
</beyond-work>

<resources>
${resources}
</resources>
</context>`;
}

const CONTEXT_CACHE = { en: buildContext("en"), de: buildContext("de") };

function buildSystemPrompt(locale, theme) {
  const s = translations[locale].chatbotPrompt;
  const context = CONTEXT_CACHE[locale];
  const state = `<state>
Current language: ${locale === "de" ? "German (de)" : "English (en)"}
Current theme: ${theme === "light" ? "light" : "dark"}
</state>`;
  return `${s.identity}\n\n${s.rules}\n\n${context}\n\n${s.tools}\n\n${s.examples}\n\n${state}`;
}

// --- Abuse prevention ---
// State lives at module scope, so limits are per Worker isolate (per PoP,
// reset on eviction) — best-effort throttling, not an exact global count.

const rateMap = new Map();
const BURST_LIMIT = 10;
const BURST_WINDOW_MS = 60_000;
const DAILY_LIMIT_PER_IP = 50;
const GLOBAL_DAILY_LIMIT = 500;

let globalDaily = { count: 0, start: 0 };

function getClientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

function isRateLimited(ip) {
  const now = Date.now();

  if (now - globalDaily.start > 86_400_000) {
    globalDaily = { count: 0, start: now };
  }
  if (globalDaily.count >= GLOBAL_DAILY_LIMIT) return true;

  if (rateMap.size > 5_000) {
    for (const [key, e] of rateMap) {
      if (now - e.dailyStart > 86_400_000) rateMap.delete(key);
    }
  }

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

  if (now - entry.burstStart <= BURST_WINDOW_MS && entry.burstCount >= BURST_LIMIT) return true;

  entry.burstCount++;
  entry.dailyCount++;
  globalDaily.count++;

  return false;
}

// --- Input validation ---

const MAX_MESSAGE_LENGTH = 50_000;
const MAX_MESSAGES = 10;
const MAX_BODY_BYTES = 512 * 1024;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

// --- LLM request with model fallback on quota errors ---

function isRetryableError(err) {
  return err.status === 429 || err.status === 400 || err.status === 404 ||
    err.code === "rate_limit_exceeded" ||
    err.message?.toLowerCase().includes("quota") ||
    err.message?.toLowerCase().includes("rate limit");
}

async function createWithFallback(openai, modelChain, params, options) {
  let lastErr;
  for (const model of modelChain) {
    try {
      return await openai.chat.completions.create({ ...params, model }, options);
    } catch (err) {
      lastErr = err;
      if (isRetryableError(err) && modelChain.indexOf(model) < modelChain.length - 1) {
        const next = modelChain[modelChain.indexOf(model) + 1];
        console.warn(`${model} failed (${err.status}), falling back to ${next}`);
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

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
      if (writer) await writer(chunk);
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

// --- Response helpers ---

function corsHeaders(allowedOrigin) {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

// --- Chat endpoint with tool calling ---

async function handleChat(request, env, ctx, cors) {
  const config = {
    apiKey: env.LLM_API_KEY,
    baseURL: env.LLM_BASE_URL || "https://api.openai.com/v1",
    model: env.LLM_MODEL || "gpt-4o-mini",
    fallbackModels: env.LLM_FALLBACK_MODELS || "",
  };

  if (!config.apiKey) {
    console.error("LLM_API_KEY is required");
    return jsonResponse({ error: "llm_error" }, 502, cors);
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return jsonResponse({ error: "rate_limited" }, 429, cors);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: "invalid_request" }, 400, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_request" }, 400, cors);
  }

  const { messages, locale, theme } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonResponse({ error: "invalid_request" }, 400, cors);
  }

  const trimmed = messages.slice(-MAX_MESSAGES);
  for (const msg of trimmed) {
    if (!ALLOWED_ROLES.has(msg.role)) {
      return jsonResponse({ error: "invalid_request" }, 400, cors);
    }
    if (
      typeof msg.content !== "string" ||
      msg.content.length > MAX_MESSAGE_LENGTH
    ) {
      return jsonResponse({ error: "message_too_long" }, 400, cors);
    }
  }

  const lang = locale === "de" ? "de" : "en";

  const modelChain = [
    config.model,
    ...config.fallbackModels.split(",").map((m) => m.trim()).filter(Boolean),
  ];
  const openai = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL });
  const linkInstructions = translations[lang].serverMessages.linkInstructions;

  const currentTheme = theme === "light" ? "light" : "dark";
  let currentMessages = [
    { role: "system", content: buildSystemPrompt(lang, currentTheme) },
    ...trimmed,
  ];

  // Helper: stream a chat completion with shared defaults
  function streamChat(msgs, extra = {}) {
    return createWithFallback(
      openai,
      modelChain,
      { max_tokens: MAX_TOKENS, temperature: 0.7, messages: msgs, stream: true, ...extra },
      { signal: request.signal },
    );
  }

  // Round 1 runs before the SSE response is created, so LLM failures can
  // still be reported as HTTP error statuses (a streaming Response is
  // committed the moment it is returned).
  let round1Result = null;
  let toolFallbackStream = null;

  try {
    let stream;
    try {
      stream = await streamChat(currentMessages, { tools: TOOLS, tool_choice: "auto" });
    } catch (toolErr) {
      // Provider might not support tools — fall back to plain request
      const isToolError = toolErr.message?.toLowerCase().includes("tool") ||
        toolErr.error?.message?.toLowerCase().includes("tool");
      if (toolErr.status === 400 && isToolError) {
        console.warn("Provider does not support tools, falling back with links");
        currentMessages[0] = { role: "system", content: currentMessages[0].content + "\n\n" + linkInstructions };
        toolFallbackStream = await streamChat(currentMessages);
      } else {
        throw toolErr;
      }
    }

    if (!toolFallbackStream) {
      round1Result = await consumeStream(stream, null); // buffer, don't write
    }
  } catch (err) {
    console.error("LLM error:", err.status, err.message, err.error || "");
    if (err.status === 429) {
      return jsonResponse({ error: "quota_exceeded" }, 503, cors);
    }
    return jsonResponse({ error: "llm_error" }, 502, cors);
  }

  // From here on, stream SSE to the client
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const writeRaw = (str) => writer.write(encoder.encode(str));
  const write = (chunk) => writeRaw(`data: ${JSON.stringify(chunk)}\n\n`);

  const pump = async () => {
    try {
      if (toolFallbackStream) {
        await consumeStream(toolFallbackStream, write);
        return;
      }

      const result = round1Result;

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

        // Execute each tool, append results, and collect structured actions
        const collectedActions = [];

        for (const tc of result.toolCalls) {
          let args;
          try {
            args = JSON.parse(tc.arguments);
          } catch {
            args = {};
          }
          const toolResult = executeTool(tc.name, args, lang, currentTheme);
          currentMessages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: JSON.stringify(toolResult),
          });

          // Collect validated structured actions (navigate_to_section is handled
          // via anchor links in the LLM's text response, so no SSE action needed)
          if (tc.name === "set_theme" && toolResult.type === "action") {
            collectedActions.push({ type: "toggle_theme", theme: toolResult.newTheme });
          } else if (tc.name === "switch_language" && toolResult.type === "action" && VALID_LANGUAGES.has(args.language)) {
            collectedActions.push({ type: "switch_language", language: args.language });
          }
        }

        // Round 2: stream final response (no tools) directly to client
        let round2Result;
        try {
          const finalStream = await streamChat(currentMessages);
          round2Result = await consumeStream(finalStream, write);
        } catch (round2Err) {
          console.warn("Round 2 failed, retrying without tool messages:", round2Err.status, round2Err.message);
          round2Result = null;
        }

        // If Round 2 failed or returned empty, retry with link-based fallback
        if (!round2Result || round2Result.contentChunks.length === 0) {
          const plainMessages = currentMessages.filter((m) => m.role !== "tool" && !m.tool_calls);
          plainMessages[0] = { role: "system", content: plainMessages[0].content + "\n\n" + linkInstructions };
          const retryStream = await streamChat(plainMessages);
          await consumeStream(retryStream, write);
        }

        // Emit structured actions as a named SSE event
        if (collectedActions.length > 0) {
          await writeRaw(`event: actions\ndata: ${JSON.stringify({ actions: collectedActions })}\n\n`);
        }
      } else if (result.contentChunks.length > 0) {
        // No tool calls — flush buffered content to client
        for (const chunk of result.contentChunks) {
          await write(chunk);
        }
      } else {
        // Model returned nothing (tools ignored) — retry without tools, with link instructions
        console.warn("Round 1 empty, retrying without tools");
        currentMessages[0] = { role: "system", content: currentMessages[0].content + "\n\n" + linkInstructions };
        const retryStream = await streamChat(
          currentMessages.filter((m) => m.role !== "tool" && !m.tool_calls),
        );
        await consumeStream(retryStream, write);
      }
    } catch (err) {
      console.error("LLM error:", err.status, err.message, err.error || "");
    } finally {
      try {
        await writeRaw("data: [DONE]\n\n");
      } catch {}
      try {
        await writer.close();
      } catch {}
    }
  };

  ctx.waitUntil(pump());

  return new Response(readable, {
    headers: {
      ...cors,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const cors = corsHeaders(env.ALLOWED_ORIGIN || "https://t.mannhart.ai");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const { pathname } = new URL(request.url);

    if (pathname === "/api/health") {
      return jsonResponse({ status: "ok" }, 200, cors);
    }

    if (pathname === "/api/chat" && request.method === "POST") {
      return handleChat(request, env, ctx, cors);
    }

    return jsonResponse({ error: "not_found" }, 404, cors);
  },
};
