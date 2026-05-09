# Hypatia InterpreterPro — Architecture

## Current architecture (single-device)
```
Browser (Chrome/Edge)
  └── Web Speech API → SpeechRecognition
        └── onresult → finalResults{} (indexed, dedup)
              └── silenceTimer (1400ms) → flushBuffer()
                    └── translate(text) → Gemini REST API
                          └── appendSeg() → DOM + localStorage
```

## Canonical data model for a segment
Every piece of spoken/typed content should eventually be stored as:
```js
{
  id: timestamp,           // unique, used as DOM key
  speakerId: 'A'|'B',     // which person spoke
  speakerName: string,     // display name (e.g. "Peter", "Ivan")
  lang: 'en'|'ru',        // source language
  original: string,        // verbatim STT transcript
  translated: string,      // Gemini translation
  time: string,            // HH:MM display
  startTime: number,       // ms epoch (for audio sync, future)
  confidence: number,      // STT confidence 0-1 (future)
  glossaryHits: string[],  // terms matched against glossary (future)
  editHistory: [],         // corrections (future)
  sessionId: string        // shared session key (needed for collab)
}
```
The translated field is a *view*. The original transcript is the record of truth.

## Planned architecture (two-person sharing)
```
Person A (phone)                Person B (phone)
  Browser                         Browser
    └── STT → translate()           └── STT → translate()
          └── Firestore write              └── Firestore write
                └── onSnapshot ←────────────→ onSnapshot
                      └── renderSeg()               └── renderSeg()
```
Both clients write their own segments to Firestore.
Both clients subscribe to all segments in the session.
No server needed for MVP — Firestore is the sync layer.

## File structure
```
/
├── index.html          ← THE canonical app (single source of truth)
├── SPEC.md             ← product truth
├── ARCHITECTURE.md     ← this file
├── TASKS.md            ← active work queue
├── AGENTS.md           ← rules for AI agents
├── ALGORITHM.md        ← STT/translation algorithm docs
├── CLAUDE.md           ← Claude-specific session memory
└── collab-server/      ← node server (not used in current deploy, archived)
```

## Key constraints
- `index.html` is the only deployable file. No build step. No bundler.
- Firebase SDK loaded from CDN in `<script>` tags.
- All Gemini calls currently client-side (BYO key). Moving server-side is a future phase.
- Target: Chrome Android 120+, Safari iOS 16+ (STT limited on iOS — fallback to text input)
