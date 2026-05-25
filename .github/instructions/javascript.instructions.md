---
applyTo: "**/*.js"
---

# JavaScript Instructions

## Rules

- Use vanilla JavaScript.
- Do not add a build step or dependency unless explicitly requested.
- Keep reusable layout/navigation logic in `assets/js/sidebar.js` or the current sidebar script until file migration is completed.
- Keep configuration data near the top of the file where possible.
- Prefer small named functions.
- Avoid unnecessary global variables.
- Preserve compatibility with existing template functions.
- Handle missing DOM elements gracefully.
- **Unified blog scripts:** Use `assets/js/blog.js` for all collection pages (tech-blog, cinema, photography, etc.). Do not create page-specific JS files for blog/gallery collections.

## Sidebar/Layout Rules

The sidebar/layout script should own:

- mobile navbar
- sidebar shell
- site header
- nav items
- active nav state
- footer/social links
- relative path handling

Individual HTML pages should not duplicate that logic.

## Validation

After editing JavaScript:

- Check browser console for errors.
- Check root pages.
- Check nested pages.
- Check mobile toggle behavior.
- Check active navigation state.
