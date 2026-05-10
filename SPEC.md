# Hypatia InterpreterPro - Product Spec

Single source of product truth. All agents read this before touching code.

## What It Is

Hypatia is a real-time multilingual conversation workspace. Two or more people speak or type in their native languages; Hypatia creates parallel transcripts, translates them, lets people inspect terms, and eventually turns the conversation into a durable record.

The current wedge is not "all languages for everyone." The near-term wedge is a simple shared transcript/translation room that works well enough to test with real people.

## Current State

- Single-file standalone app: `index.html`.
- Gemini 2.5 Flash translation and glossary lookup through a user-provided browser key.
- Web Speech API STT for Chrome/Edge.
- Manual type-to-send fallback.
- Silence buffer and Android Chrome cumulative-result dedup.
- Split-screen bilingual display: Russian top, English bottom.
- Tapable word lookup drawer.
- Export transcript as `.txt`.
- Local persistence through `localStorage`.
- Speaker name prompt, speaker labels, room state strip, and Share/Join UI.
- Local WebSocket collaboration path works when the room server is running.
- PWA manifest and service worker are wired.

## Not Production-Ready

- The live Netlify site may lag until local commits are pushed and deployed.
- Gemini API calls still happen from the browser. This is acceptable for local beta testing, not production.
- Public room sharing needs a deployed `wss://` collaboration backend or a different sync layer.
- There is no account system, durable database, billing, HIPAA posture, or edit-and-retranslate loop yet.

## Target Users

1. Early technical beta testers who can tolerate rough edges.
2. Education / ELL contexts where low-friction bilingual conversation matters.
3. Medical / biomedical and clinical research teams once compliance and accuracy hardening exist.

## Core UX Principles

- Zero install: open a URL and speak or type.
- Both people see both languages simultaneously.
- The original transcript is the record of truth; translation is a view.
- Every session should become a usable, exportable artifact.
- Manual input must always remain available when mic capture fails.

## Non-Goals For Now

- Full HIPAA claims.
- Billing and subscriptions.
- App Store packaging.
- More than two active working languages per session.
- Voice synthesis.
- Autonomous cloud-agent workflows.

## Backend Decision Still Open

The root app currently has local WebSocket room sharing. Firestore remains a possible future sync layer. Do not assume either is the final production architecture until a short architecture decision record compares:

- WebSocket room server
- Firestore
- Netlify/Vercel serverless or edge functions
- A managed realtime service

