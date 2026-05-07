# Hypatia InterpreterPro — Standalone Edition

Real-time Russian ↔ English simultaneous interpretation, powered by Gemini AI.

## Use Tomorrow (Zero Setup)

1. **Download `index.html`** from this branch
2. **Open it in Chrome** (or Edge) — double-click the file
3. **Enter your Gemini API key** when prompted
   - Get a free key at [aistudio.google.com](https://aistudio.google.com) → Get API Key
   - Key starts with `AIza...`
   - Stored only in your browser's localStorage
4. **Select EN or RU** with the language toggle
5. **Tap the 🎤 mic button** — start speaking
6. Speech is transcribed and translated automatically
7. Both languages appear in the split-screen view
8. Tap any word for a clinical medical definition
9. **⬇ Export** saves the full transcript as a `.txt` file

## How It Works

- **Transcription:** Uses the browser's built-in Web Speech API (requires Chrome/Edge)
- **Translation:** Sends text to Gemini 2.0 Flash via the Google AI REST API
- **Persistence:** Session auto-saves to localStorage and survives browser refresh
- **No server:** Runs entirely in the browser — no npm install, no build step, no backend

## Tips for the Conference

- **Use Chrome on desktop or Android** for the best speech recognition
- **Safari / Firefox:** Speech recognition may not work — use the text input instead
- **Noisy room?** Type in the text box and press Enter — translation works the same way
- **Mic not working?** Click the lock icon in the browser address bar → allow microphone
- One person selects `EN` and speaks English; the other selects `RU` and speaks Russian
- Both people can see the same screen — pass the laptop between speakers
- The session autosaves — refreshing the page restores your transcript
- Use **⬇ Export** at the end to download the full bilingual transcript

## For App Store (Next Steps)

This standalone HTML is the prototype. The production path:
1. **React Native + Expo** — wraps this logic in a native app
2. Uses `expo-speech` or `@react-native-voice/voice` for on-device transcription
3. Gemini API for translation (same as this prototype)
4. Firebase for multi-device session sync
5. Submit to App Store via Expo EAS Build

See [Hypatia-InterpreterPro](https://github.com/FrankyForlon/Hypatia-InterpreterPro) for the full React/Firebase version.
