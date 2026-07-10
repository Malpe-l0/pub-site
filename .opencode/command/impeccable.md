---
description: "Impeccable design — craft/shape/audit/polish/critique/live/… [target]"
---

Load the `impeccable` skill with the skill tool, then execute with arguments: $ARGUMENTS

Follow that skill's Setup + Routing rules exactly.
- Scripts/references live under `.opencode/skills/impeccable/`
- Run setup from project cwd: `node .opencode/skills/impeccable/scripts/context.mjs`
- No args → skill's no-argument menu (do not invent a command)
- First word is a sub-command → load `reference/<command>.md` and run it
