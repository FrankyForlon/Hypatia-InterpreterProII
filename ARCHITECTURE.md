# Hypatia InterpreterPro - Architecture

## Current App Shape

```
Browser (Chrome/Edge)
  -> Web Speech API SpeechRecognition
  -> finalResults{} indexed dedup
  -> silenceTimer (1400ms)
  -> translate(text) via Gemini REST API
  -> addSegment()
  -> DOM + localStorage
  -> optional WebSocket room broadcast
```

The app is currently a standalone `index.html` with no build step.

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
- Browser Gemini keys are acceptable for local testing only.
- Manual typed input must always work, even if mic/STT fails.

