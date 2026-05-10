# Testing Hypatia Locally

These instructions test the new Codex app before pushing it to GitHub/Netlify.

## Current Local Test URL

Codex started the local app here:

`http://127.0.0.1:4173/?server=ws://127.0.0.1:18080`

The static app server is on port `4173`.
The local collaboration room server is on port `18080`.

If you see `DISPLAY NAME`, `NAME`, `SHARE`, and `JOIN`, you are looking at the new app.
If you do not see those controls, you are looking at the old app.

## Basic Test

1. Open the local test URL in Chrome or Edge.
2. Enter your Gemini API key.
3. Enter a display name, such as `Peter`.
4. Click `Begin Session`.
5. Confirm the top strip shows your name and `SOLO`.
6. Type an English sentence in the bottom bar and press Enter.
7. Confirm the English feed shows your original sentence and the Russian feed shows the translation.
8. Tap a word such as `dialysis` and confirm the glossary drawer opens.
9. Click `Export` and confirm a text transcript downloads.

## Two-Window Room Test

1. In window A, open the local test URL and begin a session.
2. Click `Share`.
3. If the browser allows clipboard access, a room link is copied.
4. Paste the copied link into window B.
5. In window B, enter a display name and begin the session.
6. Send a typed message from window A.
7. Confirm window B receives the same transcript segment.

## If Share Fails

The local collaboration server may not be running. Ask Codex to restart the local Hypatia test servers.

## Why Netlify Still Looks Old

The new app exists as local uncommitted changes in this checkout. Netlify will keep showing the old app until these changes are committed, pushed to `main`, and Netlify finishes its automatic deploy.

