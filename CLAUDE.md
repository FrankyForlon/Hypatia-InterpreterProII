# Hypatia InterpreterPro - Project Handoff

Read this first. This file is the short shared memory for Claude CLI, Codex, and any other agent working on Hypatia.

## Canonical Folder

Use this repo as the active codebase:

`C:\Users\peter\Desktop\Hypatia Interpreter\Hypatia-InterpreterProII`

The similarly named folder below contains older local drafts and Word documents, but it is not the deployable GitHub checkout:

`C:\Users\peter\Desktop\Hypatia-InterpreterProII`

Do not edit the wrong folder. If uncertain, run `git status --short --branch` and confirm the remote is `https://github.com/FrankyForlon/Hypatia-InterpreterProII.git`.

## What Hypatia Is

Hypatia is a real-time multilingual conversation workspace. Two or more people speak or type in their native languages; Hypatia creates a bilingual transcript, translates it, lets people inspect terms, and eventually turns the conversation into a durable record.

The current wedge is not "all languages for everyone." The near-term wedge is a simple shared transcript/translation room that works well enough to test with real people.

## Current State

The deployed surface is the root `index.html`.

What works locally:
- Russian/English split transcript UI.
- Gemini 2.5 Flash translation through a user-provided browser key.
- Manual type-to-send fallback.
- Browser SpeechRecognition mic path.
- Gemini-powered word lookup drawer.
- Export to text.
- Local persistence through `localStorage`.
- Codex-added speaker name, room state, and Share/Join UI.
- Local WebSocket collaboration path when a room server is running.

What is not production-ready:
- Gemini API calls still happen from the browser.
- Room sharing needs a running WebSocket server and is not yet deployed as a stable public backend.
- There is no account system, durable database, billing, HIPAA posture, or edit-and-retranslate loop yet.
- The live Netlify site may show the old app until the local changes are committed and pushed.

## Near-Term Priority

1. Revoke leaked credentials noted in the documents.
2. Test the new local Codex app.
3. Commit the canonical docs and app changes.
4. Push to GitHub so Netlify can deploy the new app.
5. Only after that, decide whether the next backend should be WebSocket rooms, Firestore, or a small Netlify/Vercel function layer.

## Ground Rules

- One concrete task per session.
- Peter is the only human checkpoint.
- No unsupervised cloud loops, VPS experiments, or open-ended agent runs.
- Do not commit API keys, tokens, `.env` files, Word temp files, screenshots, or raw private notes.
- Keep architecture decisions in `SPEC.md`, active work in `TASKS.md`, and agent rules here/`AGENTS.md`.
- At the end of a session, update this file or `TASKS.md` if the real project state changed.

## Files To Read

- `SPEC.md` - product target and boundaries.
- `TASKS.md` - current task list.
- `AGENTS.md` - agent coordination rules.
- `TESTING.md` - local testing instructions.

