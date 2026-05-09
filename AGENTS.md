# Hypatia InterpreterPro — Agent Rules

This file governs how AI agents (Claude, Codex, CLI Claude) collaborate on this repo without stepping on each other.

---

## Ground rules

1. **`index.html` is the only deployable file.** There is no build step. Do not create separate JS/CSS files that need bundling. CDN `<script>` tags are fine.

2. **Read SPEC.md and ARCHITECTURE.md before writing any code.** If your change contradicts either, update the doc first and note why.

3. **Update TASKS.md when you complete a task.** Change status to ✅ and add a note. This is how other agents know what's been done.

4. **One feature per commit.** Small, descriptive commit messages. Never batch unrelated changes.

5. **Do not refactor what isn't broken.** The STT dedup logic, silence buffer, and JSON parsing are all intentional and tested. Read ALGORITHM.md before touching them.

6. **Test on mobile.** The primary target is Chrome Android. Desktop behavior is secondary. If you can't test on device, note it explicitly.

7. **Never expose secrets.** No API keys, Firebase credentials, or service account JSON in committed files. Use `FIREBASE_CONFIG` as a clearly-labeled placeholder that Peter fills in.

8. **No backwards-compatibility shims.** If you change a data structure, update all usages. Don't leave dead code.

---

## Who does what

| Agent | Strengths | Preferred tasks |
|-------|-----------|----------------|
| **Claude (web)** | Fast UI iteration, prompt engineering, UX copy, CSS, product decisions | Feature implementation, Gemini prompt tuning, visual polish |
| **Codex** | Architecture, security review, testing, refactors, GitHub integration | Data model hardening, server-side work, HIPAA review, test suites |
| **CLI Claude** | Local file ops, running dev servers, browser testing | Verification, local testing, file wrangling |
| **Peter** | Product vision, real-world testing, user interviews | Prioritization, domain expertise (legal/medical), user testing |

---

## Coordination protocol

- **TASKS.md** = the work queue. Check it before starting anything.
- **SPEC.md** = product truth. Don't violate it without a conversation.
- **ARCHITECTURE.md** = technical constraints. Read before touching data structures.
- **CLAUDE.md** = Claude's session memory. Claude updates this; Codex reads it for context.

---

## Current priority
**Task #1: Two-person session sharing.**
See TASKS.md and ARCHITECTURE.md for the Firestore-based design.
Do not start backlog items until Tasks 1-4 are done.

---

## Firebase config placeholder
When Firebase is needed, use this pattern in index.html:
```js
// TODO: Peter — replace with real Firebase config from Firebase Console
const FIREBASE_CONFIG = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};
```
Peter fills this in locally or via Netlify environment variables. Never hardcode real values.
