# Instructions Guide

This document provides an overview of all path-specific and file-type-specific instructions used in the repository.

Instructions are rules and guidelines that apply automatically to certain file types or paths. They live in `.github/instructions/`.

## Instruction Files

### 1. HTML Instructions

**Path:** `.github/instructions/html.instructions.md`

**Applies To:** All `*.html` files

**Key Rules:**
- Use semantic HTML
- Preserve reusable page skeleton: `<header id="site-header"></header>` + `<main id="main-collapse">`
- Do NOT duplicate sidebar/header/footer markup
- Maintain logical heading hierarchy
- Add meaningful alt text to content images
- Use relative paths compatible with GitHub Pages
- Validate metadata.json references

**Common Patterns:**
- Page title in `<title>` tag
- Meta description for SEO
- External stylesheets in `<head>` (relative paths)
- JavaScript loaded before closing `</body>` tag

---

### 2. JavaScript Instructions

**Path:** `.github/instructions/javascript.instructions.md`

**Applies To:** All `*.js` files

**Key Rules:**
- Use vanilla JavaScript (no frameworks unless explicitly requested)
- Keep reusable logic in centralized files:
  - `assets/js/sidebar.js` — Navigation and layout
  - `assets/js/blog.js` — Collection page rendering
- Keep section-specific modules in `assets/js/<section>/`
- Avoid global state unless required by existing template
- Keep functions small and readable
- Preserve compatibility with existing functionality
- Mobile sidebar toggle uses pointer/touch/click event handling

**Common Patterns:**
- DOMContentLoaded for initialization
- Reusable utility functions
- Event delegation for dynamic content
- Smooth scroll behavior for navigation

---

### 3. CSS and Assets Instructions

**Path:** `.github/instructions/css-assets.instructions.md`

**Applies To:** All `assets/` directory files (CSS, fonts, images)

**Key Rules:**
- Keep CSS in `assets/css/`
- Keep JavaScript in `assets/js/`
- Keep fonts in `assets/fonts/`
- Keep images in `assets/images/<section>/`
- Keep vendor libraries in `assets/js/<section>/vendor/`
- Use unified blog styling: `assets/css/blog.css` + `assets/js/blog.js`
- Prefer readable source CSS over minified files when available
- Do NOT overwrite original photos
- Maintain section-specific folder organization

**Image Organization:**
```text
assets/images/
├── consulting/      # Consulting/teaching section
├── movies/          # Cinema section
├── math/            # Algorithmic art visualizations
├── photos/
│   ├── big/         # Original high-resolution
│   └── small/       # Web-optimized versions
└── tech/            # Technology writing
```

---

### 4. Metadata Instructions

**Path:** `.github/instructions/metadata.instructions.md`

**Applies To:** All `metadata.json` files

**Key Rules:**
- Keep JSON valid and parseable
- Use consistent field structure within each section
- Maintain stable `id` and `slug` values (published items)
- Ensure `url` points to existing HTML files
- Ensure image paths point to existing assets
- Use ISO-style dates: `YYYY-MM-DD`
- Keep summaries useful for cards and SEO
- Order articles by date (newest first)
- Validate JSON before committing

**Common Fields:**
- `id` — stable internal identifier
- `slug` — URL-friendly identifier
- `title` — display title
- `description` or `summary` — short blurb for cards
- `date` — publication date
- `image` or `heroImage` — primary image path
- `tags` — discovery labels
- `featured` — highlight in special areas

**Variations by Section:**
- **Cinema:** Includes film title, director, genre, review summary
- **Tech Blog:** Includes topic, keywords, code examples metadata
- **Algorithmic Art:** Includes category, tags (3d, geometry, interactive), visualization type
- **Photo Blog:** Includes location, camera metadata, exposure info

---

### 5. Python Scripts Instructions

**Path:** `.github/instructions/python-scripts.instructions.md`

**Applies To:** All `scripts/*.py` files

**Key Rules:**
- Keep utility scripts under `scripts/`
- Use Python 3.6+ syntax
- Preserve original files (never overwrite)
- Script documentation should include:
  - Purpose
  - Usage example
  - Input/output paths
  - Dependencies
- Common script: `scripts/shape_images.py` for image resizing

**Key Script: shape_images.py**

Purpose: Proportionally downscale images for web optimization

Usage:
```bash
python scripts/shape_images.py <input_dir> <output_dir> --max-width <px> --max-height <px>
```

Example:
```bash
python scripts/shape_images.py assets/images/photos/big assets/images/photos/small --max-width 1200 --max-height 1200
```

Features:
- Preserves aspect ratio
- Avoids upscaling
- Keeps originals untouched
- Supports common image formats (PIL/Pillow)

---

## Applying Instructions

Instructions are applied automatically by GitHub Copilot based on file paths and types.

**Priority Order (when instructions overlap):**
1. Explicit user request in current chat
2. Nearby path-specific instruction (most specific first)
3. Repository-wide Copilot instruction (`.github/copilot-instructions.md`)
4. Root project guidance (`AGENTS.md`)
5. General documentation (`docs/*.md`)

## Examples

### Example 1: Adding HTML Content

When creating `cinema/new-film.html`:

- **Applies:** `html.instructions.md`
- **Required:**
  - Use `<header id="site-header"></header>` skeleton
  - Keep content in `<main id="main-collapse">`
  - Add semantic structure
  - Use relative paths (`../assets/...`)
  - Include meaningful alt text for images
  - Link to external stylesheets in `<head>`
  - Load scripts before `</body>`

### Example 2: Adding JavaScript Module

When creating `assets/js/algorithmic-art/cube-visualization.js`:

- **Applies:** `javascript.instructions.md` + `css-assets.instructions.md`
- **Required:**
  - Use vanilla JavaScript
  - Initialize on DOMContentLoaded
  - Keep functions readable and small
  - Avoid global state when possible
  - Compatible with existing sidebar.js
  - Section-specific vendor libs in `vendor/` subdirectory

### Example 3: Creating Metadata

When updating `algorithmic-art/metadata.json`:

- **Applies:** `metadata.instructions.md`
- **Required:**
  - Valid JSON syntax
  - URLs point to `3d-cube.html` and `ulam-spiral.html`
  - Image paths point to existing files
  - Dates in ISO format (`2026-05-26`)
  - Articles ordered by date (newest first)
  - Section-specific fields (e.g., `category`, `tags`)

### Example 4: Image Processing

When optimizing photos for the photo blog:

- **Applies:** `python-scripts.instructions.md` + `css-assets.instructions.md`
- **Required:**
  - Place originals in `assets/images/photos/big/`
  - Run `shape_images.py` to generate web versions
  - Do NOT overwrite originals
  - Use generated images in metadata and HTML
  - Reference paths as `./assets/images/photos/small/image.jpg`

## When to Add or Update Instructions

Add/update an instruction file when:

- A rule or guideline applies to **multiple files of the same type**
- The guideline is **specific to this project**
- The rule should **apply automatically** to new files

Example: When the site added the algorithmic-art section with Three.js visualizations, the JavaScript instructions were updated to document section-specific modules and vendor library organization.

## References

- Agentic strategy: `docs/agentic-strategy.md`
- Copilot instructions: `.github/copilot-instructions.md`
- Agent personas: `.github/agents/*.md`
- Skills guide: `docs/skills-guide.md`
