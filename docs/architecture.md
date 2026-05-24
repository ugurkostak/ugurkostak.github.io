# Architecture

## Overview

The website is a static GitHub Pages site with HTML pages, reusable JavaScript-driven layout, metadata-driven section content, and optimized image assets.

## Main Architectural Decisions

### Static First

The site should remain static and deployable by GitHub Pages without a build pipeline.

### Reusable Layout

Navigation, sidebar header, mobile bar, and footer should be generated from a single JavaScript layout/sidebar file.

Benefits:

- avoids duplicated markup
- makes navigation easier to change
- keeps pages focused on content
- reduces inconsistency between pages

### Asset Organization

All front-end assets should live under `assets/`:

```text
assets/css/
assets/js/
assets/fonts/
assets/images/
```

### Metadata-Driven Sections

Sections such as cinema, tech writings, and photo stories should have `metadata.json` files. These files can support:

- cards
- sorting
- filtering
- featured content
- search
- related content
- SEO metadata

## Constraints

- No required Node.js build step.
- No heavy client-side framework.
- Keep relative paths GitHub Pages compatible.
- Keep original photos separate from optimized web versions.
