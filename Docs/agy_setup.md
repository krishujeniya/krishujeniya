# Developer Agent Environment Setup Guide

This guide configures development skills and agent rules. By default, instructions scope installations to the **active workspace project** to preserve system isolation.

---

## 1. Project-Scoped Installation (Recommended)

To install agent skills only for your current project workspace:

```bash
# Ensure target project skill directory exists
mkdir -p .agents/skills

# Install pinned skills into the local workspace repository
# Pin to reviewed tags or commit SHAs rather than unversioned head releases
npx --yes skills add udaysharmadev/Gravitas@v1.2.0 --skill gravitas --agent antigravity
npx --yes skills add AgricIDaniel/claude-seo@v2.1.0 --skill seo --agent antigravity
npx --yes skills add Jakeschincariol/founder-skill@v1.0.0 --skill founder-deck --agent antigravity
```

---

## 2. Optional: Toolchain Installation with Version Pinning

When installing local helper tools like Graphify, use pinned versions in isolated virtual environments:

```bash
# Install with explicit version constraint in an isolated tool environment
if command -v uv >/dev/null 2>&1; then
    uv tool install graphifyy==0.2.1
elif command -v pip3 >/dev/null 2>&1; then
    pip3 install --user graphifyy==0.2.1
fi
```

---

## 3. Configuration & Scope Review

Before updating agent behavior, review what files will be created or modified:

| Path | Scope | Purpose |
| :--- | :--- | :--- |
| `.agents/skills/` | Project | Workspace-specific skill definitions |
| `~/.gemini/GEMINI.md` | User Global | Only modified if user explicitly chooses global rules |
| `~/.claude/CLAUDE.md` | User Global | Only modified if user explicitly chooses global rules |

To apply project-level instructions without affecting other repositories, place guidelines directly in your project root `AGENTS.md` or `.cursorrules`.

---

## 4. Uninstallation and Removal Procedure

To completely clean up and restore original settings:

```bash
# 1. Remove project skills
rm -rf .agents/skills

# 2. If global skills were installed via skills CLI:
npx --yes skills remove gravitas -g || true
npx --yes skills remove seo -g || true
npx --yes skills remove founder-deck -g || true

# 3. Uninstall graphify tool
if command -v uv >/dev/null 2>&1; then
    uv tool uninstall graphifyy || true
else
    pip3 uninstall -y graphifyy || true
fi
```
