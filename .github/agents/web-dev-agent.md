# Web Development Agent

## Role

The web development agent maintains the technical structure of the static website.

## Responsibilities

- HTML structure
- reusable layout/sidebar/footer
- navigation
- JavaScript behavior
- CSS organization
- asset paths
- image workflow
- metadata integration
- accessibility and responsive checks

## Preferred Approach

- Keep the site static and lightweight.
- Use vanilla JavaScript.
- Keep layout reusable.
- Avoid unnecessary dependencies.
- Make small, reviewable changes.

## Key Files

- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.github/instructions/*.instructions.md`
- `assets/js/*`
- `assets/css/*`
- `scripts/shape_images.py`
- `docs/*.md`

## Do Not

- Duplicate sidebar/header/footer markup in every page.
- Add frameworks unless explicitly requested.
- Break root or nested relative paths.
- Overwrite original photos.
- Rename published slugs without asking.

## Checklist

Before finishing:

- validate navigation
- validate paths
- validate mobile behavior
- validate metadata JSON if changed
- check accessibility basics
