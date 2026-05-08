# CLAUDE.md — Hypatia InterpreterPro
## Project Memory File — Read This First Every Session

---

## Who Is Peter

Peter is the founder and sole developer-by-proxy of Hypatia. He works via Claude Code (web) and has no formal coding background — he directs AI agents to build. He has grandiose, well-considered plans for this app and a clear vision. He is often working under financial and time pressure. He uses Claude Code on Windows (currently a stalling M90 Mini + a new machine). His GitHub handle is **FrankyForlon**.

Key context:
- Peter has a legal case (State v. Golub) that competes for his time
- He is preparing for a **Medical Engineering Conference at University of Utah** where Hypatia will be demoed with ~30 Russian-speaking doctors, researchers, engineers from CIS countries
- He wants this to eventually be "the Zoom of translation" — the go-to app for translingual communication
- KISS principle is paramount at this stage. Never gold-plate. Ship working things.

---

## What This Repo Is

**Hypatia-InterpreterProII** is the **standalone zero-build version** of Hypatia.

- Single file: `index.html`
- No build step, no npm, no framework
- Opens directly in Chrome or any modern browser
- Uses **Web Speech API** for speech recognition (works in Chrome/Edge, not Safari)
- Uses **Gemini 2.0 Flash** for translation and dictionary lookup
- Stores session in `localStorage` (single device only)
- User enters their Gemini API key on first load (stored in localStorage, never sent anywhere)

**This is the demo/prototype version.** It works for one person on one device demonstrating the concept.

**The full multi-device version** lives in `hypatia-interpreterpro` (React + Vite + Firebase).

---

## Current State (as of May 2026)

### What Works
- Split-horizon UI: Russian (amber, top) / English (zinc, bottom)
- EN → RU and RU → EN translation via Gemini 2.0 Flash
- Web Speech API continuous listening with interim preview
- Tap any word → clinical dictionary drawer (Gemini-powered)
- Manual text input fallback
- Export transcript as .txt
- localStorage session persistence (survives refresh)
- Clean dark aesthetic (#080808, amber accents, Swiss minimal)

### What Doesn't Exist Yet
- Multi-device sync (two people sharing a session)
- Speaker identification / names
- Account system
- Edit/correction loop (tap segment to fix a mis-transcription)
- Real deployment URL (currently runs as local file or needs Netlify deploy)

---

## The Three Local Folders (Peter's Desktop)

1. `https-github.com-FrankyForlon-Hypatia...` — cloned GitHub repo
2. `Hypatia Interpreter` — the React/Vite app (InterpreterPro)
3. `Hypatia-InterpreterProll` — this standalone app (InterpreterProII)

---

## Correct Model Names (NEVER change these without testing)

```
Translation + Dictionary: gemini-2.0-flash
```

Dead model names that will 404 — never use:
- `gemini-3-flash-preview`
- `gemini-3.1-pro-preview`
- `gemini-1.5-flash` (deprecated May 2026)

---

## Phase Plan

| Phase | Deliverable | Status |
|---|---|---|
| 0 | Deploy standalone to Netlify / Firebase Hosting | Pending |
| 1 | Multi-device sessions (share link → partner joins) | Not started |
| 2 | Speaker identity (name on join, shows in transcript) | Not started |
| 3 | Dual clean transcripts (EN + RU, downloadable) | Not started |
| 4 | Correction loop (edit segment → re-translate → sync) | Not started |
| 5 | Optional accounts (name persists, session history) | Not started |
| Future | Multi-language, multi-participant, audience mode | Roadmap |

---

## Design Tokens (Never Change Without Peter's Approval)

```css
--bg: #080808
--amber: #f59e0b        /* Russian text, accents */
--text: #e4e4e7         /* English text */
--surf: #0f0f0f
--surf2: #1a1a1a
--border: rgba(255,255,255,0.07)
```

Vibe: Medical chart / laboratory terminal. Swiss design. High contrast. Zero fluff.

---

## PRD Summary (What Peter Wants)

1. Two people open the same URL on their phones
2. One speaks English, one speaks Russian
3. Both see the full bilingual conversation in real time
4. Every utterance is attributed to a speaker name ("Anton:" / "Mark:")
5. Tap any word → clinical definition
6. At the end → download EN transcript + RU transcript
7. Optional: create account, name auto-populates, save session history
8. Eventually: any language pair, multi-participant, audience mode

Core principle: **verbatim transcript first, translation second.** If the transcript is accurate, translation can always be corrected. If the transcript is wrong, everything downstream is wrong.

---

## Firebase Project

Project name: **InterpreterPro**
Plan: Blaze (pay-as-you-go)
Services configured: Auth (Identity Platform), Firestore, Hosting
Firebase project is used by the React app (InterpreterPro), not this standalone file.

---

## Session Notes

- Migrated from Kimi to Gemini 2.0 Flash (May 7, 2026)
- Fixed model names that didn't exist
- Fixed Firestore auth race condition (wait for authLoaded before snapshot listener)
- Added ALGORITHM.md as source of truth for agents
- Web Speech API works better than 8s audio chunking for this use case — keep it

---

## Key Decisions Made

| Decision | Rationale |
|---|---|
| Web Speech API over audio chunking | Lower latency, simpler, works well in Chrome |
| Gemini 2.0 Flash for everything | Fast, capable, free tier sufficient for conference |
| Single HTML file for prototype | Zero build friction, easy to share and demo |
| React + Firebase for full version | Firestore is the right real-time sync solution |
| KISS at every decision point | Conference is the deadline, not perfection |

---

## What To Do Next Session

1. Help Peter deploy `index.html` to Netlify (drag folder to netlify.com/drop)
2. Get a real public URL
3. Test on phone
4. Begin Phase 1: multi-device session sync in the React app (InterpreterPro)
