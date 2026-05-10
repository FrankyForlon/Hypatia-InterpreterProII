# Testing Hypatia Locally

These instructions test the new Codex app before pushing it to GitHub/Netlify.

## Current Local Test URL

Codex started the local app here:

`http://127.0.0.1:4173/?server=ws://127.0.0.1:18080`

No-key demo URL:

`http://127.0.0.1:4173/?demo=1&server=ws://127.0.0.1:18080`

Public no-key demo URL, after Netlify finishes deploying the latest `main`:

`https://hypatia-interpreterpro.netlify.app/?demo=1`

Public hosted-translation URL after `GEMINI_API_KEY` is set in Netlify:

`https://hypatia-interpreterpro.netlify.app/`

The static app server is on port `4173`.
The local collaboration room server is on port `18080`.
The `server` URL parameter is local-development only and is ignored by the public Netlify app.

If you see `DISPLAY NAME`, `NAME`, `SHARE`, and `JOIN`, you are looking at the new app.
If you do not see those controls, you are looking at the old app.
If you click `Use Demo Mode`, Hypatia uses canned local responses and spends no Gemini API credits.
If you leave the key field blank and click `Begin Session`, Hypatia uses the hosted `/api/gemini` endpoint. That path only works after Netlify has a `GEMINI_API_KEY` environment variable. The public Netlify app ignores old browser-stored Gemini keys; BYO keys are a local testing fallback only.

## Basic Test

1. Open the local test URL in Chrome or Edge.
2. For a safe UI test, enter a display name and click `Use Demo Mode`.
3. For a hosted translation test, choose a translator profile, optionally write session context, leave the key blank, enter a display name, then click `Begin Session`.
4. For a temporary local BYO-key test, enter your Gemini API key and a display name, then click `Begin Session`.
5. Confirm the top strip shows your name and `SOLO`.
6. Type an English sentence in the bottom bar and press Enter.
7. Confirm the English feed shows your original sentence and the Russian feed shows the translation.
8. Tap a word such as `dialysis` and confirm the glossary drawer opens.
9. Click `Export` and confirm a text transcript downloads.

## Hosted Gemini Endpoint

The Netlify Function lives at:

`netlify/functions/gemini.ts`

It is mounted at:

`/api/gemini`

Required Netlify environment variable:

`GEMINI_API_KEY`

Optional Netlify environment variable for future custom domains:

`ALLOWED_ORIGINS`

Local static testing on port `4173` does not run Netlify Functions. Use demo mode locally unless you are running Netlify Dev or testing the deployed site.

## Two-Window Room Test

This is currently a local-only test. Public Netlify room sharing needs an approved production sync layer before beta use.

1. In window A, open the local test URL and begin a session.
2. Click `Share`.
3. If the browser allows clipboard access, a room link is copied.
4. Paste the copied link into window B.
5. In window B, enter a display name and begin the session.
6. Send a typed message from window A.
7. Confirm window B receives the same transcript segment.

## If Share Fails

The local collaboration server may not be running. Ask Codex to restart the local Hypatia test servers.

## If Netlify Looks Old

Wait for the GitHub `main` deploy to finish, then hard-refresh the page. If the setup screen still lacks `DISPLAY NAME`, `SHARE`, `JOIN`, or `Use Demo Mode`, the deploy is stale or pointed at the wrong repo.
