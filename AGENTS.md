# Agent Handoff Rules

## Canonical Surface

The deployed beta surface is the root `index.html`. Do not improve `static/index.html`, `constance-mobile/index.html`, or older server copies unless the task explicitly says to migrate or archive them.

## Working Style

- Keep changes small enough to test in one sitting.
- Do not expose production API keys in committed files.
- Preserve the split Russian/English transcript layout.
- Treat source transcript fidelity as more important than translation polish.
- Update `TASKS.md` when a user-facing milestone changes.

## Collaboration

Claude can move quickly on UI and copy experiments. Codex should harden architecture, test behavior, review security assumptions, and keep the repo coherent. If two agents disagree, `SPEC.md` wins.
