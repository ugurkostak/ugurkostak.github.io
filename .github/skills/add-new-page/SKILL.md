---
name: add-new-page
description: "Use when: creating a new static root page or section subpage for photography, cinema, tech-blog, algorithmic-art, or soft-skills content."
---

# Skill: Add New Static Page

## Use When

Use this skill when creating a new root page or section subpage for active content areas: photography, cinema, tech-blog, algorithmic-art, and soft-skills writing.

## Steps

1. Identify whether the page belongs in the root or an active section folder: `cinema/`, `tech-blog/`, `algorithmic-art/`, or `photography/`.
2. Create the HTML file using the project page skeleton.
3. Include `<header id="site-header"></header>`.
4. Put page-specific content inside `<main id="main-collapse">`.
5. Add page title and meta description.
6. For soft-skills content, use `tech-blog/` unless the user explicitly requests a dedicated soft-skills section.
7. If the page should appear in navigation, update the nav configuration in the sidebar/layout script.
8. If the page belongs to a blog/gallery section, update that section’s `metadata.json`.
9. Check relative paths for CSS, JS, images, and links.

## Constraints

- Do not copy full sidebar/header/footer markup into the page.
- Do not introduce a framework.
- Do not rename existing URLs unless requested.

## Final Response

Report:

- page created
- navigation updates
- metadata updates
- validation performed
