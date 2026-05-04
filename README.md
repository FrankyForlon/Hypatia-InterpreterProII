# Interpreter Pro

A minimalist, phone-first real-time transcription and translation app for interpreters. Built for the University of Utah medical engineering interpreting context.

**Live demo:** https://4id5ijcscnr5a.kimi.page

---

## What It Does (Right Now)

1. **Tap "New Session"** → name your session
2. **Tap the red mic button** → speak in Russian or English
3. **See transcription** appear in real-time (source language on top)
4. **See translation** appear below (target language)
5. **Tap any word** → dictionary definition + add your own translator notes
6. **Save the session** → transcript stored on your phone
7. **Export later** → clean bilingual text file you can clean up and deliver

---

## Architecture

This is a **single HTML file** that runs entirely in the browser. No build step, no npm install, no server needed.

```
Your Phone (Chrome or Samsung Internet)
    |
    | Web Speech API (free, built into browser)
    v
Real-time speech-to-text (Russian or English)
    |
    | LibreTranslate API (free, no key needed)
    v
Translation (English <-> Russian)
    |
    | FreeDictionary API (free, no key needed)
    v
Tap-to-define word lookup
    |
    | localStorage
    v
Sessions saved on your phone
```

**Why a single HTML file?**
- Works anywhere with cell/data (no laptop needed)
- No app store approval
- No backend server to maintain
- Works offline after first load (PWA)
- Zero cost to run

---

## File Structure

```
InterpreterPro/
  index.html      # The entire app (React + CSS + JS in one file)
  README.md       # This file
  server/         # Optional: Node.js backend for ElevenLabs integration
    server.js
    package.json
    .env.example
```

---

## Quick Start (No Build)

### Option A: Just open the file
1. Download `index.html`
2. Double-click it — it opens in your browser
3. Tap "New Session" → start speaking

### Option B: Deploy to the web (5 minutes)
1. Push this repo to GitHub
2. Go to **Settings > Pages**
3. Set source to **main branch**
4. Your app is live at `https://frankyforlon.github.io/InterpreterPro`

### Option C: Run locally with live reload
```bash
npx serve .
# Opens at http://localhost:3000
```

---

## For Cursor Agent / Codex

**Tech stack:** React 18 (CDN), vanilla CSS, Web Speech API, no build tools.

**Key components in `index.html`:**
- `useWebSpeech()` — hook wrapping `webkitSpeechRecognition` for real-time transcription
- `translateText()` — fetches LibreTranslate for Russian <-> English
- `lookupWord()` — fetches FreeDictionary API for English definitions
- `WordModal` — tap-to-define modal with translator notes (Lingvo-style)
- `LiveSession` — split-pane view: source language top, target language bottom
- `SessionViewer` — saved transcript viewer with export/print

**All state is in `localStorage`** — no backend needed for basic functionality.

---

## Roadmap

### Urgent (tomorrow morning)
- [x] Russian/English transcription
- [x] Real-time translation
- [x] Tap-to-define with translator notes
- [x] Save sessions
- [x] Export as text file
- [ ] DeepL integration (better translation quality)
- [ ] Medical engineering glossary pre-loading
- [ ] Auto-detect which language is being spoken

### Near-term
- [ ] ElevenLabs Scribe v2 backend (higher quality ASR when laptop is available)
- [ ] Export as clean bilingual PDF
- [ ] Upload reference documents (like NotebookLM)
- [ ] Voice output (Constance, Benjamin, Jerome voices)
- [ ] Save to Google Drive / cloud export
- [ ] Session sharing via link

### Long-term vision
- [ ] Multi-language support (add any language pair)
- [ ] Voice cloning for the interpreter
- [ ] Educational mode — practice conversations with AI agents
- [ ] Film/lecture mode — AI has read the script, discusses in foreign language
- [ ] Voice mode — speak naturally, AI responds with cloned voice
- [ ] Community dictionary — shared translator notes

---

## ElevenLabs Integration (Optional Backend)

The `server/` folder contains a Node.js backend that properly integrates with ElevenLabs Scribe v2 Realtime. This gives higher transcription quality but **requires your laptop to be on the same network as your phone** (or deployed to a cloud server).

**Why it's optional:** The Web Speech API in the browser is free and works well enough for field interpreting. ElevenLabs adds quality but requires infrastructure.

To run the ElevenLabs backend:
```bash
cd server
cp .env.example .env
# Edit .env with your ELEVENLABS_API_KEY
npm install
node server.js
# Opens at http://localhost:3001
```

**Note:** ElevenLabs Scribe v2 Realtime requires a **single-use token** generated server-side. The raw API key cannot be used from the browser for security reasons. The `server.js` handles this token generation.

---

## License

MIT — use it, fork it, build on it.
