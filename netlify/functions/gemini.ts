const MODEL = "gemini-2.5-flash";
const MAX_TEXT_LENGTH = 4000;
const MAX_WORD_LENGTH = 80;
const DEFAULT_ALLOWED_ORIGINS = [
  "https://hypatia-interpreterpro.netlify.app",
  "http://localhost:8888",
  "http://127.0.0.1:8888",
];

const baseJsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "vary": "origin",
};

export default async function gemini(req) {
  const origin = req.headers.get("origin") || "";
  if (!isAllowedOrigin(origin)) {
    return json({ error: "ORIGIN_NOT_ALLOWED" }, 403, origin);
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return json({ error: "METHOD_NOT_ALLOWED" }, 405, origin);
  }

  const apiKey = getEnv("GEMINI_API_KEY") || getEnv("GOOGLE_GEMINI_API_KEY");
  if (!apiKey) {
    return json({ error: "SERVER_GEMINI_KEY_MISSING" }, 503, origin);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "BAD_JSON" }, 400, origin);
  }

  try {
    if (body.type === "translate") {
      const src = body.src === "ru" ? "ru" : "en";
      const text = cleanText(body.text, MAX_TEXT_LENGTH);
      if (!text) return json({ error: "TEXT_REQUIRED" }, 400, origin);

      const translated = await translate(apiKey, text, src);
      return json({ translated }, 200, origin);
    }

    if (body.type === "lookup") {
      const word = cleanText(body.word, MAX_WORD_LENGTH);
      if (!word) return json({ error: "WORD_REQUIRED" }, 400, origin);

      const entry = await lookup(apiKey, word);
      return json(entry, 200, origin);
    }

    return json({ error: "UNKNOWN_TYPE" }, 400, origin);
  } catch (error) {
    const status = error.status || 502;
    return json({
      error: "GEMINI_REQUEST_FAILED",
      message: String(error.message || "Gemini request failed.").slice(0, 160),
    }, status, origin);
  }
}

export const config = {
  path: "/api/gemini",
  method: ["POST", "OPTIONS"],
};

function getEnv(name) {
  return globalThis.Netlify?.env?.get?.(name) || "";
}

function json(payload, status = 200, origin = "") {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders(origin),
  });
}

function corsHeaders(origin) {
  const headers = {
    ...baseJsonHeaders,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  };
  if (isAllowedOrigin(origin)) {
    headers["access-control-allow-origin"] = origin;
  }
  return headers;
}

function isAllowedOrigin(origin) {
  if (!origin) return false;
  let normalized;
  try {
    normalized = new URL(origin).origin;
  } catch {
    return false;
  }

  return allowedOrigins().has(normalized);
}

function allowedOrigins() {
  const configured = getEnv("ALLOWED_ORIGINS")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured]);
}

function cleanText(value, maxLength) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

async function translate(apiKey, text, src) {
  const srcName = src === "en" ? "English" : "Russian";
  const tgtName = src === "en" ? "Russian" : "English";
  const prompt = `You are a simultaneous interpreter at a biomedical engineering conference. Participants include Russian-speaking medical engineers and doctors from CIS countries, and English-speaking American researchers. Domain: cardiology, bioelectronics, dialysis, ECMO, nanotech, biosensors, medical devices.

Translate the following ${srcName} text to ${tgtName}.

STRICT RULES:
1. Preserve exact logical polarity. Negatives must stay negative. Never flip meaning.
2. Use professional medical and engineering terminology.
3. Output natural spoken language for live dialogue, not formal prose.
4. No explanations, brackets, translator notes, or caveats.
5. Translate the complete text. Do not truncate or summarize.

Text: "${escapePromptText(text)}"

Return only valid JSON with no markdown: {"translated": "..."}`;

  const parsed = await callGemini(apiKey, prompt, {
    responseMimeType: "application/json",
    temperature: 0.1,
    maxOutputTokens: 2048,
  });

  const translated = String(parsed.translated || "").trim();
  if (!translated) throw statusError("Gemini returned an empty translation.", 502);
  return translated;
}

async function lookup(apiKey, word) {
  const isRu = /[Ѐ-ӿ]/.test(word);
  const prompt = `Medical dictionary entry for: "${escapePromptText(word)}"
Language: ${isRu ? "Russian" : "English"}.
Context: Biomedical engineering, cardiology, ECMO, dialysis, bioelectronics, nanotech, biosensors.
Return only valid JSON: {"word":"${escapePromptText(word)}","translation":"[${isRu ? "English" : "Russian"} translation]","partOfSpeech":"[noun/verb/adj]","definition":"[1-2 sentence clinical definition]","examples":["[medical usage example]","[second example]"]}`;

  const parsed = await callGemini(apiKey, prompt, {
    responseMimeType: "application/json",
    temperature: 0.2,
    maxOutputTokens: 1024,
  });

  return {
    word: String(parsed.word || word).trim().slice(0, MAX_WORD_LENGTH),
    translation: String(parsed.translation || "").trim().slice(0, 200),
    partOfSpeech: String(parsed.partOfSpeech || "").trim().slice(0, 40),
    definition: String(parsed.definition || "Definition unavailable.").trim().slice(0, 900),
    examples: Array.isArray(parsed.examples)
      ? parsed.examples.slice(0, 3).map(x => String(x).trim().slice(0, 300)).filter(Boolean)
      : [],
  };
}

async function callGemini(apiKey, prompt, generationConfig) {
  const res = await fetch(geminiUrl(apiKey), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw statusError(data?.error?.message || `Gemini HTTP ${res.status}`, res.status);
  }

  const raw = String(data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(raw);
  } catch {
    const translated = raw.match(/"translated"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (translated) return { translated: translated[1].replace(/\\"/g, '"') };
    throw statusError("Gemini returned malformed JSON.", 502);
  }
}

function geminiUrl(apiKey) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
}

function escapePromptText(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

function statusError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}
