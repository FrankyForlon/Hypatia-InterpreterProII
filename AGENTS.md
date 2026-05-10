# Hypatia InterpreterPro - Agent Rules

This file governs how Claude, Codex, CLI Claude, and other agents collaborate without stepping on each other.

## Canonical Surface

The deployable app is the root `index.html`.

Do not improve `static/index.html`, `constance-mobile/index.html`, old desktop copies, or other draft folders unless the task explicitly says to migrate or archive them.

Canonical repo:

`C:\Users\peter\Desktop\Hypatia Interpreter\Hypatia-InterpreterProII`

Document/draft folder:

`C:\Users\peter\Desktop\Hypatia-InterpreterProII`

## Ground Rules

- Read `CLAUDE.md`, `SPEC.md`, `TASKS.md`, and `ARCHITECTURE.md` before changing code.
- One concrete task per session.
- One feature per commit.
- Do not refactor working STT/dedup/translation parsing unless the task is specifically about that area.
- Do not expose secrets. No API keys, tokens, `.env` files, service-account JSON, Word temp files, screenshots, or raw private notes in commits.
- Do not run unsupervised cloud loops, VPS experiments, or expensive agent workflows.
- Update `TASKS.md` when completing a meaningful task.

## Who Does What

| Agent | Strengths | Preferred tasks |
|---|---|---|
| Claude web | UI iteration, UX copy, product framing, prompt tuning | Small feature implementation and polish |
| Codex | Architecture, security, repo hygiene, tests, GitHub integration | Data model, hardening, verification, deployment |
| Claude CLI | Local file operations and quick checks | Review, local testing, handoff docs |
| Peter | Product vision and domain judgment | Prioritization, real-world testing, approvals |

## Coordination Protocol

- `SPEC.md` = product truth.
- `ARCHITECTURE.md` = technical shape and data model.
- `TASKS.md` = active work queue.
- `CLAUDE.md` = session handoff and operational notes.
- `TESTING.md` = how Peter tests the current local build.

If documents disagree, stop and reconcile them before coding.

