# Hypatia InterpreterPro (Standalone) — ALGORITHM.md

> Source of truth for this standalone HTML edition.

## What This File Is

A single-file (`index.html`) implementation of Hypatia InterpreterPro.
No build step. No npm. Open in Chrome and go.

## Stack

- Vanilla JS (no framework)
- Google Gemini 2.0 Flash via REST API (`/v1beta/models/gemini-2.0-flash:generateContent`)
- Web Speech API (`SpeechRecognition`) for transcription
- localStorage for session persistence

## Model

```js
const MODEL = 'gemini-2.0-flash';
const geminiUrl = k =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${k}`;
```

## Speech Recognition Strategy

```
SpeechRecognition (continuous=true, interimResults=true)
  ↓
  onresult → show interim text in zone for immediate feedback
  ↓
  isFinal=true → clear interim → call translate(text)
  ↓
  onend → auto-restart if rec===true (keeps mic live)
```

**Language mapping:**
- `lang = 'en'` → `recognition.lang = 'en-US'`
- `lang = 'ru'` → `recognition.lang = 'ru-RU'`

## Translation Prompt (critical rules)

1. **Logic polarity must be preserved** — negatives stay negative across translation
2. **Professional medical terminology** — cardiology, ECMO, dialysis, nanotech, biosensors
3. **Spoken register** — natural dialogue, not written prose
4. Returns `{ "translated": "..." }` JSON

## UI Structure

```
#setup        — API key entry (shown on first visit, hidden after)
#app          — main shell (flex column, 100dvh)
  header      — logo, status pill, settings
  main        — flex column
    .zone-ru  — Russian zone (top, amber text, #0a0a0a bg)
    .zone-en  — English zone (bottom, zinc text, #080808 bg)
  footer      — text input + EN/RU toggle + mic button + actions
.overlay      — dictionary drawer (slides up on word tap)
.toast        — error/info notifications
```

## Data Model (localStorage)

```js
// Key: 'hpro_key'   Value: Gemini API key string
// Key: 'hpro_session' Value: JSON array of segments:
[
  {
    id: number,           // Date.now()
    lang: 'en' | 'ru',   // speaker's language
    original: string,     // verbatim transcript
    translated: string,   // Gemini translation
    time: string          // '14:32'
  }
]
```

## Design Tokens

```css
--bg: #080808;
--surf: #0f0f0f;
--surf2: #1a1a1a;
--border: rgba(255,255,255,0.07);
--amber: #f59e0b;
--amber-bg: rgba(245,158,11,0.12);
--text: #e4e4e7;
--dim: #52525b;
--muted: #3f3f46;
--red: #ef4444;
--green: #22c55e;
```

## Error Handling

| Error | User-facing message |
|---|---|
| HTTP 401/403 | "Invalid API key. Tap 🔑 to re-enter." |
| HTTP 429 | "Rate limit hit. Wait a moment." |
| `not-allowed` speech error | "Microphone blocked. Allow mic in browser settings." |
| JSON parse failure | Regex fallback to extract translated text |
| Any other API error | Truncated error message in toast |
