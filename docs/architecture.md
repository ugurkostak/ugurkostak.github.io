# Architecture

## Overview

The website is a static GitHub Pages site with HTML pages, reusable JavaScript-driven layout, metadata-driven section content, and optimized image assets.

## Main Architectural Decisions

### Static First

The site should remain static and deployable by GitHub Pages without a build pipeline.

### Reusable Layout

Navigation, sidebar header, mobile bar, and footer should be generated from a single JavaScript layout/sidebar file (`assets/js/sidebar.js`).

All nested detail pages across sections (cinema, tech-blog, photography, algorithmic-art, and soft-skills articles placed in tech-blog) share the same content skeleton — a single `col-md-8` column inside `<main id="main-collapse">` with an `<h1>`, a `published-date` line, an intro paragraph, a hero block (image or interactive canvas + info panel), and trailing prose. See `docs/style-guide.md` for the canonical template.

Benefits:

- avoids duplicated markup
- makes navigation easier to change
- keeps pages focused on content
- reduces inconsistency between pages
- mobile toggle properly handles pointer/touch/click events

### Modular JavaScript Components

Reusable functionality can be organized into separate modules:

- `assets/js/blog.js` — Collection page rendering and grid layout
- `assets/js/timeline-filter.js` — Interactive year-based filtering
- `assets/js/<section>/` — Section-specific visualizations (e.g., Three.js for algorithmic-art)

### Asset Organization

All front-end assets should live under `assets/`:

```text
assets/css/
assets/js/
assets/js/<section>/       # Section-specific modules
assets/js/<section>/vendor/ # Third-party libraries
assets/fonts/
assets/images/<section>/   # Organized by content type
```

### Metadata-Driven Sections

Sections such as cinema, algorithmic-art, tech writings, soft-skills/professional-growth writing, and photo stories should have `metadata.json` files. Soft-skills content should use `tech-blog/metadata.json` by default unless a dedicated section is explicitly requested. These files can support:

- cards and grids
- sorting and filtering
- featured content
- search
- related content
- SEO metadata
- flexible metadata shapes per section (cinema vs. algorithmic-art may differ)

## Constraints

- No required Node.js build step.
- No heavy client-side framework.
- Keep relative paths GitHub Pages compatible.
- Keep original photos separate from optimized web versions.
- Section-specific vendor libraries (Three.js) can live in `assets/js/<section>/vendor/` without adding external package dependencies.
