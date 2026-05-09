# Hypatia InterpreterPro — Claude Session Memory

> Read this at the start of every session. Update it at the end.
> Last updated: May 2026

---

## Who is Peter?
Peter Golub (GitHub: FrankyForlon). Building a real-time Russian-English interpretation app for a Medical Engineering Conference at the University of Utah (~30 Russian-speaking doctors/engineers from CIS countries). Long-term vision: "the Epic of medical interpretation" — a specialized bilingual workspace trusted by professionals, not a general translator.

Peter is also a lawyer (State v Golub case due end of week — he'll be offline Thu-Sun). Wants to set up autonomous agentic workflows so work continues while he's in court.

---

## The app
- **Live URL**: hypatia-interpreterpro.netlify.app
- **Repo**: github.com/FrankyForlon/Hypatia-InterpreterProII (main branch)
- **Second repo**: github.com/FrankyForlon/Hypatia-InterpreterPro (React/Vite/Firebase — future)
- **Deploy**: Netlify auto-deploys from main branch on every push ✅
- **Single file**: `index.html` — no build step, no bundler

## Current tech
- Gemini 2.5 Flash (`gemini-2.5-flash`) for translation and glossary lookup
- Web Speech API (Chrome/Edge) for STT
- localStorage for session persistence
- Silence buffer: 1400ms before translating accumulated speech
- STT dedup: `finalResults{}` keyed by result index; detects cumulative Android Chrome results

## Agent team
- **Claude (web, this instance)** — UI, features, Gemini prompts, product
- **Codex** — architecture, security, testing, refactors
- **CLI Claude** — local verification, file ops
- **Peter** — product decisions, user testing, domain expertise
- Coordination via: SPEC.md, TASKS.md, AGENTS.md, ARCHITECTURE.md

---

## Bugs fixed this session
| Bug | Fix |
|-----|-----|
| `gemini-2.0-flash` not available | Changed MODEL to `gemini-2.5-flash` |
| Android Chrome cumulative STT → word duplication | `getFinalText()` detects if last result `includes()` previous; uses only latest |
| Translation truncated on long medical sentences | `maxOutputTokens` 512→2048; added "Translate COMPLETE text" to prompt |
| Gemini JSON wrapped in markdown fences | Strip ` ```json ` before `JSON.parse()` |
| "translated:" leaking into output | Improved fallback regex |
| Phone showing old cached version | Netlify GitHub auto-deploy now active; use incognito to bypass cache |
| API key invalid on phone | Stored key was mangled; user cleared via ⚙ and re-pasted from AI Studio |

---

## Key decisions made
- Single `index.html` forever for the standalone app (no build step)
- Firestore for two-person session sharing (not WebSockets server)
- BYO Gemini key for beta; server-side calls for production
- Education (K-12 ELL) is a stronger initial wedge than medical due to: no HIPAA, federal Title III funding, 5M ELL students in US, 30 students/teacher vs 10 colleagues/doctor
- PWA before App Store — zero distribution friction
- Pricing model: $15-19/mo individual, $99/mo team, absorb ~$0.30/hr API cost

---

## What to do next (in order)
1. **Two-person session sharing** — Firestore sync, `?session=XXXX` URL param, host creates session, guest joins via link. See ARCHITECTURE.md.
2. **Speaker name prompt on join** — modal before entering session
3. **Speaker labels on segments** — name + language on each transcript block
4. **Session URL generation** — shareable link
5. After Utah: glossary CSV upload, server-side Gemini, PWA manifest

---

## Market positioning (from Gemini deep research + analysis)
- Global language services market: $71.7B (2024), moving toward outcome-based metrics
- Direct competitors: Transync AI, Maestra AI, JotMe, Soniox, Wordly (all horizontal/general)
- Medical vertical already has entrants: OneShot AI, Intercall, Martti — but none are Russian-specific or conference-optimized
- **Hypatia's moat**: expert transcript workspace for specialized professional conversations, starting with Russian-English medical engineering
- **Education wedge**: K-12 ELL is underserved, lower compliance burden, federal funding available

---

## Netlify / GitHub state
- Site name: `hypatia-interpreterpro` → hypatia-interpreterpro.netlify.app
- Connected to: `FrankyForlon/Hypatia-InterpreterProII`, branch `main`
- Auto-publishing: ON ✅
- Second old site (`nimble-cascaron-40fadc`) can be deleted

## Firebase (for two-person sharing — not yet implemented)
- Peter has a Firebase project. Config needed from Firebase Console.
- See AGENTS.md for the `FIREBASE_CONFIG` placeholder pattern.
- Firestore rules must be set to allow read/write by sessionId only.
