# Hypatia InterpreterPro - Project Handoff

Read this first. This is the short shared memory for Claude CLI, Codex, and any other agent working on Hypatia.

## Canonical Folder

Use this repo as the active codebase:

`C:\Users\peter\Desktop\Hypatia Interpreter\Hypatia-InterpreterProII`

The similarly named folder below contains older local drafts and Word documents, but it is not the deployable GitHub checkout:

`C:\Users\peter\Desktop\Hypatia-InterpreterProII`

Do not edit the wrong folder. If uncertain, run `git status --short --branch` and confirm the remote is:

`https://github.com/FrankyForlon/Hypatia-InterpreterProII.git`

## What Hypatia Is

Hypatia is a real-time multilingual conversation workspace. Two or more people speak or type in their native languages; Hypatia creates a bilingual transcript, translates it, lets people inspect terms, and eventually turns the conversation into a durable record.

The near-term wedge is a simple shared transcript/translation room that works well enough to test with real people. The longer-term idea is a specialist multilingual workspace for education, professional interpretation, and domain-specific conversations.

## Current State

The deployed surface is root `index.html`.

What works locally:

- Russian/English split transcript UI.
- Gemini 2.5 Flash translation through a user-provided browser key.
- Manual type-to-send fallback.
- Browser SpeechRecognition mic path.
- Gemini-powered word lookup drawer.
- Export to text.
- Local persistence through `localStorage`.
- Speaker name, room state, Share/Join UI.
- Local WebSocket collaboration path when a room server is running.
- PWA manifest and service worker basics.
- No-key demo mode for safe UI/classroom testing without Gemini API spend.
- Hosted Gemini endpoint at `/api/gemini` through `netlify/functions/gemini.ts`.
- Public app ignores arbitrary `?server=` WebSocket overrides; room sharing still needs an approved production sync layer.

What is not production-ready:

- Netlify still needs `GEMINI_API_KEY` set before hosted live translation works.
- User-provided browser keys exist only as a temporary fallback for local testing.
- Room sharing needs a deployed public `wss://` room server or a different sync layer.
- There is no account system, durable database, billing, HIPAA posture, or edit-and-retranslate loop yet.

## Security State

Peter deleted/revoked the exposed Gemini API keys and GitHub classic personal access tokens on May 10, 2026.

Codex replaced these local unredacted Word files with redacted versions:

- `C:\Users\peter\Desktop\Hypatia-InterpreterProII\Hypatia-Interpreter_project-diary.docx`
- `C:\Users\peter\Desktop\Hypatia-InterpreterProII\pees.docx`

The clean code repo was scanned for obvious GitHub/Gemini key patterns before commit.

## Current Local Test URL

The local test servers were started here:

`http://127.0.0.1:4173/?server=ws://127.0.0.1:18080`

No-key demo URL:

`http://127.0.0.1:4173/?demo=1&server=ws://127.0.0.1:18080`

Public no-key demo URL after Netlify deploy:

`https://hypatia-interpreterpro.netlify.app/?demo=1`

If that page shows `DISPLAY NAME`, `NAME`, `SHARE`, and `JOIN`, it is the new app. If it only shows the older key screen without display-name/session controls, it is the wrong build or stale cache.

## Netlify State

Netlify deploys from GitHub `main`. If production looks stale, wait for the deploy to finish and hard-refresh before assuming the code is missing.

Hosted translation requires a Netlify environment variable named `GEMINI_API_KEY`. Do not put it in source control.

## Ground Rules

- One concrete task per session.
- Peter is the only human checkpoint.
- No unsupervised cloud loops, VPS experiments, or open-ended agent runs.
- Do not commit API keys, tokens, `.env` files, Word temp files, screenshots, or raw private notes.
- Keep architecture decisions in `ARCHITECTURE.md`, product truth in `SPEC.md`, active work in `TASKS.md`, and testing instructions in `TESTING.md`.

## Files To Read

- `SPEC.md`
- `ARCHITECTURE.md`
- `TASKS.md`
- `AGENTS.md`
- `TESTING.md`
