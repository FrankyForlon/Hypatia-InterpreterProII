# Hypatia InterpreterPro - Architecture

## Current App Shape

```
Browser (Chrome/Edge)
  -> Web Speech API SpeechRecognition
  -> finalResults{} indexed dedup
  -> silenceTimer (1400ms)
  -> translate(text) via hosted /api/gemini endpoint
  -> addSegment()
  -> DOM + localStorage
  -> optional WebSocket room broadcast
```

The app is currently a standalone `index.html` with no frontend build step. Hosted Gemini calls run through a Netlify Function at `/api/gemini` so the production API key can live in Netlify environment variables instead of the browser. A user-provided browser key still exists as a temporary local fallback.

## Current Gemini Shape

```
Browser
  -> POST /api/gemini
  -> netlify/functions/gemini.ts
  -> origin allowlist check
  -> Gemini REST API using GEMINI_API_KEY
  -> JSON response back to browser
```

Supported actions:

- `translate`: `{type:"translate", text, src}`
- `lookup`: `{type:"lookup", word}`

Required Netlify environment variable:

- `GEMINI_API_KEY`

Optional Netlify environment variable:

- `ALLOWED_ORIGINS` as a comma-separated list if future custom domains need access.

## Current Local Collaboration Shape

```
Host browser
  -> Share
  -> WebSocket create room
  -> room code / link

Guest browser
  -> Join room from URL/code
  -> receives room state

Both browsers
  -> add segment locally
  -> broadcast segment to room
  -> receive remote segments
```

Local room server:

`collab-server/server.js`

Local test server URL:

`http://127.0.0.1:4173/?server=ws://127.0.0.1:18080`

Public sharing is not production-ready until the room server is deployed as `wss://...` or replaced by a different sync layer.

The public app intentionally ignores `?server=` and does not prompt for arbitrary collaboration servers. The `server` URL override is local-development only, so crafted public links cannot redirect transcript sync to an attacker-controlled WebSocket endpoint.

## Canonical Segment Model

Current segments are shaped like:

```js
{
  id: string,
  speakerId: string,
  speaker: string,
  lang: 'en' | 'ru',
  original: string,
  translated: string,
  time: string
}
```

Future fields should be added deliberately:

```js
{
  startTime: number,
  endTime: number,
  confidence: number,
  glossaryHits: string[],
  editHistory: [],
  sessionId: string,
  audioRef: string
}
```

The original transcript is the record of truth. `translated` is a view that can be regenerated.

## Backend Decision Record Needed

Do not assume Firestore or WebSockets is the final answer yet.

Before production collaboration, write a short decision record comparing:

- WebSocket room server
- Firestore realtime listeners
- Netlify/Vercel serverless or edge functions
- Managed realtime services

Decision criteria:

- Cost safety for Peter.
- Ease of deployment.
- Ability to remove browser-exposed Gemini keys.
- Durable transcript storage.
- Security model.
- Mobile reliability.

## File Structure

```
/
├── index.html          # canonical app
├── manifest.json       # PWA metadata
├── sw.js               # service worker
├── netlify.toml        # Netlify publish/functions config
├── netlify/functions/  # hosted server endpoints
├── SPEC.md             # product truth
├── ARCHITECTURE.md     # this file
├── TASKS.md            # active work queue
├── AGENTS.md           # agent coordination rules
├── CLAUDE.md           # session memory / handoff
├── TESTING.md          # local testing instructions
└── collab-server/      # local WebSocket room server
```

## Constraints

- No committed secrets.
- No public production release that depends on a private local WebSocket server.
- Browser Gemini keys are acceptable for local fallback testing only.
- Production Gemini keys must live in Netlify environment variables.
- Hosted Gemini endpoint must stay restricted to trusted origins; do not reintroduce URL-based API endpoint overrides.
- Public collaboration must not accept arbitrary WebSocket endpoints from URL parameters.
- Manual typed input must always work, even if mic/STT fails.
