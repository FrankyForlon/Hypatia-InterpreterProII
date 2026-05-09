# Hypatia InterpreterPro — Task Queue

> Updated by agents after completing work. Owner = who should do it.
> Status: 🔲 todo | 🔄 in progress | ✅ done | ❌ blocked

---

## Sprint: Utah Conference MVP (current)
Goal: two people, one URL, working on mobile Chrome by Sunday.

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 1 | Two-person session sharing via Firestore | Claude/Codex | 🔲 | Highest priority. See ARCHITECTURE.md for design. |
| 2 | Speaker name prompt on join | Claude | 🔲 | Simple modal: "What's your name?" before entering session |
| 3 | Speaker label on each segment | Claude | 🔲 | Show name + language on each transcript block |
| 4 | Session URL generation (host creates, guest follows link) | Claude/Codex | 🔲 | `?session=XXXX` query param |
| 5 | Clear/reset only clears local view, not shared session | Claude | 🔲 | Needs thought — host vs guest permissions |
| 6 | Mobile UX polish pass | Claude | 🔲 | After sharing works |

---

## Backlog (post-Utah)

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| B1 | Custom glossary CSV upload | Codex | 🔲 | Upload before session, used to guide Gemini prompt |
| B2 | Server-side Gemini calls | Codex | 🔲 | Remove BYO key requirement for end users |
| B3 | Audio timestamp on each segment | Claude | 🔲 | startTime: Date.now() already possible |
| B4 | Post-session editable transcript | Codex | 🔲 | Click word → edit → saves correction to Firestore |
| B5 | PWA manifest + service worker | Claude | 🔲 | "Add to Home Screen" native feel |
| B6 | User accounts (Firebase Auth) | Codex | 🔲 | Email/Google sign-in |
| B7 | Education vertical landing page | Peter | 🔲 | ELL/K-12 positioning |
| B8 | HIPAA compliance audit | Codex | 🔲 | Firestore rules, BAA, no client keys |
| B9 | Billing / subscription | Peter+Codex | 🔲 | Stripe, $15-19/mo individual |

---

## Completed
| # | Task | Completed |
|---|------|-----------|
| ✅ | Migrate from Kimi to Gemini 2.5 Flash | May 2026 |
| ✅ | Fix Android Chrome cumulative STT duplication | May 2026 |
| ✅ | Silence buffer (1400ms) to batch speech | May 2026 |
| ✅ | Fix translation truncation (maxOutputTokens 512→2048) | May 2026 |
| ✅ | Fix JSON parse: strip markdown fences from Gemini response | May 2026 |
| ✅ | Netlify auto-deploy from GitHub main | May 2026 |
| ✅ | Clinical glossary drawer (tapable words) | May 2026 |
| ✅ | Export transcript as .txt | May 2026 |
