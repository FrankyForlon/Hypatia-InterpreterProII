# Constance Interpreter Pro

A single-file, browser-based real-time transcription and translation app for medical engineering interpreters. Built for Russian-English simultaneous interpreting at the University of Utah research park.

**Live URL:** https://4id5ijcscnr5a.kimi.page

## Features

- **Real-time speech recognition** — Uses your phone's native Web Speech API (free, no API key)
- **Bidirectional translation** — Russian to English and English to Russian
- **Tap-to-define** — Tap any word to see English dictionary definitions + medical glossary matches
- **20-term medical engineering glossary** — Built-in bilingual terms (Angiography, Biopsy, Catheter, Stent, etc.)
- **Manual text input** — Type directly into the transcript window
- **Per-segment delete** — Remove individual transcript segments
- **Session save/export** — Save to localStorage, export as `.txt` files for client delivery
- **Works offline after load** — Single HTML file, no build step, no server required

## How to use on your phone

1. **Open the URL** directly in Chrome or Samsung Internet (not inside an iframe/app preview)
2. **Allow microphone** when prompted
3. **Tap "Start Session"**
4. **Speak in Russian** — you'll see transcription + English translation appear
5. **Tap "RU <-> EN"** to switch direction
6. **Tap any word** to see definitions
7. **Type in the bottom field** and hit the green button to add manual entries
8. **Tap "Save"** to store the session, **"Export"** in Saved tab to download `.txt`

## Mic troubleshooting (Samsung / Android)

If the mic doesn't transcribe:
1. Open the URL **directly in Chrome** (not Facebook Messenger, not Instagram browser)
2. Tap the **lock icon** in the address bar → Site Settings → Microphone → Allow
3. Go to **Phone Settings** → Apps → Chrome → Permissions → Microphone → Allow
4. **Battery & Device Care** → Battery → Background Usage Limits → **Don't restrict Chrome**
5. Refresh the page and tap Start Session again

## Hosting on prettyparasites.ai

Since this is a single static HTML file, you can host it anywhere:

### Option A: Upload via cPanel File Manager
1. Log in to your hosting cPanel
2. Open **File Manager**
3. Navigate to `public_html/` (or the subdomain folder for prettyparasites.ai)
4. Click **Upload** and select `interpreter-pro.html`
5. Rename it to `index.html` if you want it at the root
6. Access at `https://prettyparasites.ai/interpreter-pro.html` or `https://prettyparasites.ai/`

### Option B: Upload via FTP
Use FileZilla or any FTP client:
- Host: your cPanel FTP host
- Upload `interpreter-pro.html` to `public_html/`

### Option C: GitHub Pages (free)
1. Push this repo to GitHub
2. Go to Settings → Pages → Source: Deploy from a branch → master /root
3. Site will be at `https://frankyforlon.github.io/InterpreterPro`

## Tech Stack

- React 18 (CDN UMD build)
- Web Speech API (`webkitSpeechRecognition`)
- MyMemory Translation API (free, no key)
- FreeDictionary API (free, no key)
- No build tools. No JSX. No bundler. Just one HTML file.

## File Structure

```
InterpreterPro/
├── index.html          # The entire app (19KB)
├── static/
│   └── index.html      # Copy for deployment
├── server/             # Optional collaboration backend (Node.js)
│   ├── collab-server.js
│   └── server.js
├── README.md
└── .gitignore
```

## ElevenLabs Integration (future)

Your ElevenLabs API key is currently **not used** because browser WebSocket security blocks raw API keys. To add ElevenLabs Scribe v2 Realtime later:
1. Set up a small Node.js proxy server (see `server/server.js`)
2. The proxy exchanges your API key for a temporary token
3. The browser connects to ElevenLabs via the token

For now, the built-in Web Speech API works well for phone-based interpreting and is completely free.

## Adding more glossary terms

Edit the `GLOSSARY` array at the top of `index.html`:

```js
{en:"Your Term", ru:"Your Russian", def:"Your definition"}
```

## License

MIT — use freely for your interpreting work.
