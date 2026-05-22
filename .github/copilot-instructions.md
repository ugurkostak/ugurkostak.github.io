# Copilot Instructions for this Website

## Project goals
- Maintain a clean, modern, fast, and accessible website.
- Prioritize readability, maintainability, and performance over unnecessary complexity.
- Preserve the current visual identity unless explicitly asked to redesign sections.
- Favor small, focused improvements over large rewrites.

## General coding rules
- Always understand the existing structure before editing.
- Reuse existing patterns, components, styles, and naming conventions.
- Do not introduce new frameworks, libraries, or dependencies unless explicitly requested.
- Avoid breaking existing functionality, layout, SEO metadata, or responsiveness.
- Keep diffs small and easy to review.

## HTML rules
- Use semantic HTML elements whenever possible (`header`, `main`, `nav`, `section`, `article`, `footer`, `button`, etc.).
- Keep markup simple and readable.
- Add meaningful `aria-*` attributes only when semantic HTML alone is not sufficient.
- Ensure forms have labels, buttons have clear text, and interactive elements are keyboard accessible.
- Use descriptive alt text for meaningful images and decorative images should not create noise for screen readers.

## CSS / styling rules
- Prefer consistent spacing, typography, and layout patterns.
- Preserve responsive behavior and use mobile-first thinking when adjusting layout.
- Avoid overly specific selectors and unnecessary duplication.
- Prefer minimal, maintainable styling changes instead of large visual rewrites.
- Keep animations subtle and respect reduced-motion preferences when relevant.
- Preserve this instruction file’s guidance and formatting style unless the user explicitly requests changes to the agent instructions.

## JavaScript / TypeScript rules
- Write simple, readable, and defensive code.
- Prefer small functions with clear names.
- Avoid global side effects unless the project already relies on them.
- Handle errors gracefully and fail safely.
- Validate user input before processing it.
- Do not add heavy logic to the UI if a simpler solution exists.

## Accessibility rules
- Maintain keyboard navigation for all interactive UI.
- Ensure sufficient color contrast and visible focus states.
- Do not remove outlines unless replacing them with an accessible alternative.
- Preserve logical heading hierarchy.
- Review changes for basic accessibility impact before finalizing.

## Performance rules
- Prefer lightweight solutions.
- Avoid unnecessary DOM work, large dependencies, and render-blocking behavior.
- Optimize images, scripts, and styling when making changes.
- Preserve or improve loading speed and responsiveness.

## SEO rules
- Preserve meaningful page titles, meta descriptions, headings, and semantic structure.
- Do not remove structured content or internal linking without a clear reason.
- Keep content human-readable and search-friendly.
- If adding new sections, use clear heading hierarchy and descriptive text.

## Content editing rules
- Keep tone clear, professional, and concise.
- Preserve the author’s intent and message.
- Improve clarity, grammar, and structure without making the text sound generic or robotic.
- Avoid repetition and filler.

## Refactoring rules
- Refactor only when it improves clarity, reuse, accessibility, or maintainability.
- Do not mix refactoring with unrelated feature work.
- Explain the reason for non-trivial refactors.
- Preserve behavior unless the task explicitly requests changes.

## Debugging rules
- When fixing bugs, first identify root cause.
- Propose the smallest safe fix.
- Explain what caused the issue and how the fix addresses it.
- Check for possible side effects in related files.

## Output behavior for Copilot
- For non-trivial changes, first summarize the plan before editing.
- When editing, explain what changed and why.
- If requirements are ambiguous, choose the safest minimal-change option.
- If a requested change may hurt accessibility, performance, SEO, or maintainability, warn about it briefly.
- Prefer production-safe code over clever code.

## Review checklist
Before finishing any change, verify:
- No broken layout
- No obvious accessibility regression
- No unnecessary dependency added
- No duplicated code introduced
- No SEO-critical structure removed
- No mobile responsiveness regression
- Code remains easy to understand
