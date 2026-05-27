---
name: update-navigation
description: "Use when: adding, removing, renaming, or reordering sidebar navigation items for active site sections."
---

# Skill: Update Navigation

## Use When

Use this skill when adding, removing, renaming, or reordering navigation items for active site sections.

## Steps

1. Open the sidebar/layout JavaScript file.
2. Locate the nav configuration array.
3. Update labels, URLs, titles, and optional section path matching.
4. Confirm every nav URL exists or is intentionally planned.
5. Check active-state behavior for root and nested pages.
6. Check mobile and desktop navigation.
7. Add a soft-skills nav item only when an actual page or dedicated section exists and the user explicitly wants it in navigation.

## Constraints

- Keep navigation centralized in JavaScript.
- Do not duplicate nav links manually across HTML pages.
- Keep labels short.

## Final Response

Report changed nav items and any validation performed.
