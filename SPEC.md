# Hypatia InterpreterPro — Product Spec

> Single source of product truth. All agents read this before touching code.

## What it is
Real-time bilingual interpretation web app. Two people open the same URL on their phones, speak in their own language, and both see a live split-screen bilingual transcript with speaker attribution, tapable word definitions, and exportable session records.

## Current state (May 2026)
- ✅ Single-file standalone app (`index.html`) deployed at hypatia-interpreterpro.netlify.app
- ✅ Gemini 2.5 Flash translation (EN↔RU)
- ✅ Android Chrome STT with cumulative-result dedup
- ✅ Silence buffer (1400ms) batches speech before translating
- ✅ Split-screen bilingual display (Russian top / English bottom)
- ✅ Tapable word → clinical glossary drawer (Gemini lookup)
- ✅ Export transcript as .txt
- ✅ Netlify auto-deploy from GitHub main branch
- ❌ Two-person session sharing (NEXT — highest priority)
- ❌ Speaker names / diarization
- ❌ Server-side Gemini calls (currently client-side BYO key)
- ❌ Custom glossary upload (CSV)
- ❌ Audio-timecoded editable transcript
- ❌ HIPAA compliance
- ❌ User accounts / billing

## Target users (in priority order)
1. **Medical / biomedical conferences** — Russian-English (Utah conference is the beta test)
2. **K-12 schools with high ELL populations** — teacher ↔ non-English-speaking student
3. **Clinical research teams** — bilingual documentation of patient interactions

## Core UX principles
- Zero install — open a URL, speak
- Both people see both languages simultaneously
- Every session produces a usable, exportable record
- Medical/clinical terminology accuracy > general translation accuracy

## Non-goals (for now)
- More than 2 languages per session
- Real-time voice synthesis (text transcript only)
- Consumer/travel use case
- General-purpose translation

## Tech stack
- Frontend: single-file HTML/CSS/JS (no build step)
- Translation: Gemini 2.5 Flash via REST API
- STT: Web Speech API (Chrome/Edge)
- Hosting: Netlify (auto-deploy from GitHub main)
- Session sync: Firebase Firestore (planned for two-person sharing)
- Auth: Firebase Auth (planned, post-sharing)
