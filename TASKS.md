# Hypatia InterpreterPro - Task Queue

Updated by agents after completing work. Keep this short and current.

## Immediate

- [x] Revoke/delete exposed Gemini keys and GitHub classic tokens.
- [x] Replace local unredacted Word docs with redacted versions.
- [x] Keep a clean GitHub checkout on `main`.
- [x] Preserve root `index.html` as the deployable app surface.
- [x] Add speaker name prompt and speaker labels.
- [x] Add Share/Join UI and local WebSocket room sync.
- [x] Add PWA manifest link and safer service worker.
- [x] Add project handoff docs for Codex/Claude coordination.
- [x] Verify local app shell and two-client mocked room flow.
- [x] Push merged work to GitHub main.
- [x] Confirm Netlify deploy shows the new `DISPLAY NAME`, `SHARE`, and `JOIN` UI.
- [x] Add no-key demo mode for safe UI/classroom testing.
- [x] Add hosted `/api/gemini` endpoint so production can hide the Gemini key.
- [x] Restrict hosted Gemini endpoint origins and remove the `?api=` override.
- [x] Remove public `?server=` WebSocket override to prevent transcript exfiltration links.
- [x] Add translator profiles and context prompt for classroom/medical/travel/literal modes.
- [x] Add cleaned source transcript display with deterministic punctuation/capitalization polish.
- [x] Add Gemini fallback model cascade for temporary capacity spikes.
- [x] Make hosted transcript cleaning deterministic so Gemini cannot rewrite the source record.
- [x] Add public Share/Join beta rooms with Netlify Blobs polling.

## Next Engineering Decisions

- [ ] Decide long-term production sync layer: Netlify room polling vs WebSocket room server vs Firestore vs managed realtime.
- [x] Move Gemini calls behind a server endpoint before any real public beta.
- [x] Set `GEMINI_API_KEY` in Netlify and verify live hosted translation.
- [ ] Add visible retry/resend for failed translation segments.
- [ ] Add edit-and-retranslate for individual transcript segments.
- [ ] Add CSV glossary upload for session terminology.
- [x] Add a simple no-key demo/mock mode for testing the UI without spending API credits.
- [ ] Run streaming STT bakeoff: Soniox, ElevenLabs Scribe, OpenAI Realtime transcription, Google Speech-to-Text.
- [ ] Add Spanish/ELL classroom profile after Russian classroom field tests stabilize.

## Backlog

- [ ] Audio timestamps on each segment.
- [ ] Durable transcript storage.
- [ ] User accounts.
- [ ] Export to DOCX/PDF/Markdown.
- [ ] Field-test log / diary ritual after each substantial Hypatia session.
- [ ] Education/ELL landing page and outreach notes.
- [ ] Add transcript/raw-audio timestamps and richer stenographer controls.
- [ ] HIPAA/security architecture review.
- [ ] Billing and subscription model.

## Completed Earlier

- [x] Migrate from Kimi to Gemini 2.5 Flash.
- [x] Fix Android Chrome cumulative STT duplication.
- [x] Add silence buffer for speech batching.
- [x] Fix translation truncation with larger max output.
- [x] Strip Gemini markdown fences before JSON parsing.
- [x] Add clinical glossary drawer.
- [x] Export transcript as `.txt`.
