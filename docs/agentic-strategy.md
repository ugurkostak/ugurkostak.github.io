# Agentic Strategy

## Goal

The goal of the agentic setup is to make AI assistance reliable, consistent, and safe for a lightweight static website.

The strategy separates four concerns:

1. Global project rules in `AGENTS.md`.
2. GitHub Copilot always-on rules in `.github/copilot-instructions.md`.
3. File/path-specific rules in `.github/instructions/*.instructions.md`.
4. Repeatable task workflows in `.github/skills/*/SKILL.md`.

## Mental Model

Use this distinction:

- `AGENTS.md`: What every agent should know about the project.
- `copilot-instructions.md`: How GitHub Copilot should behave across the repository.
- `*.instructions.md`: Rules for specific file types or paths.
- `SKILL.md`: Step-by-step workflows for recurring tasks.
- `docs/agents/*.md`: Named human-readable agent personas.
- `docs/*.md`: Longer documentation that should not overload always-on instructions.

## Priority Order

When instructions conflict, follow this order:

1. Explicit user request in the current chat.
2. Nearby path-specific instructions.
3. Repository-wide Copilot instructions.
4. Root `AGENTS.md`.
5. General docs and agent personas.

## Initial Agent Focus

For now, optimize for two roles:

- Web development agent
- Content editor/creator agent

The web development agent owns structure, navigation, assets, metadata integration, scripts, and maintainability.

The content editor/creator agent owns titles, summaries, articles, tags, UX copy, and metadata text quality.

## Best Practices

- Keep always-on instructions concise.
- Move long explanations to `docs/`.
- Convert repeated tasks into skills.
- Keep skills procedural and action-oriented.
- Keep file-specific rules in `.github/instructions/`.
- Avoid duplicate guidance in too many places.
- Review instructions when the project structure changes.
