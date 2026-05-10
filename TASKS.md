# Hypatia Active Tasks

## Now: Utah Conference Beta

- [x] Keep a clean checkout on `main`.
- [x] Preserve the root `index.html` as the deployed app surface.
- [x] Wire root app to a shareable two-person room.
- [x] Add speaker names to live segments and exports.
- [ ] Keep manual input as the fallback path for noisy rooms.
- [x] Verify the deployed-style app with browser automation.

## Next

- [ ] Add edit-and-retranslate for individual transcript segments.
- [ ] Add CSV glossary upload for conference terminology.
- [ ] Move Gemini calls behind a server endpoint before production use.
- [ ] Decide whether WebSocket rooms or Firestore becomes the durable collaboration backend.

## Agent Rule

Claude and Codex should both read `SPEC.md` and this file before making product changes. Prefer small, testable changes against the root app unless a task explicitly moves the project to a framework build.
