# Ugur Kostak Portfolio Website

Static personal website for photography, cinema writing, technology writing, consulting, teaching, and contact information.

The site is intentionally lightweight and maintainable: plain HTML, CSS, vanilla JavaScript, organized assets, section metadata, documentation, and small Python utility scripts.

## Features

- **Responsive design** — mobile-first layout for phone, tablet, and desktop.
- **Photography and visual portfolio** — image-focused pages and galleries.
- **Cinema and technology writing** — section folders can contain article pages and metadata.
- **Fast and lightweight** — static HTML/CSS/JS without a required build step.
- **Reusable navigation layout** — sidebar, mobile bar, header, and footer should be centralized instead of duplicated across pages.
- **Organized assets** — images, fonts, JavaScript, and future CSS should live under `assets/`.
- **Metadata-ready sections** — `metadata.json` files can support cards, filters, featured content, and better UX.
- **Agent-friendly documentation** — project docs, agent personas, `.github` instructions, and skills are documented for AI-assisted development.

## Live Site

The GitHub Pages site is expected at:

```text
https://ugurkostak.github.io
```

## Local Development

No JavaScript build step is required.

From the repository root, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Avoid opening pages directly via `file://`, because browser behavior, relative paths, and local file restrictions can differ from a locally served site.

## Current Project Structure

The temporary `github/` folder should be treated as `.github/` in the final project structure.

```text
ugurkostak.github.io/
├── assets/
│   ├── fonts/
│   ├── images/
│   │   ├── consulting/
│   │   ├── movies/
│   │   ├── photos/
│   │   └── tech/
│   │       ├── accessibility-placeholder.jpg
│   │       ├── accessibility-placeholder.svg
│   │       ├── css-placeholder.jpg
│   │       ├── css-placeholder.svg
│   │       ├── javascript-placeholder.jpg
│   │       ├── javascript-placeholder.svg
│   │       ├── web-dev-placeholder.jpg
│   │       ├── web-dev-placeholder.svg
│   │       └── writing.jpg
│   ├── js/
│   └── apple-icon-180x180.png
├── cinema/
│   ├── aftersun.html
│   ├── banshees-of-inisherin.html
│   ├── birdman.html
│   ├── everything-everywhere-all-at-once.html
│   ├── metadata.json
│   ├── tar.html
│   └── three-colors-trilogy.html
├── docs/
│   ├── agents/
│   ├── architecture.md
│   ├── site-structure.md
│   └── style-guide.md
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/
│   │   ├── html.instructions.md
│   │   ├── javascript.instructions.md
│   │   ├── css-assets.instructions.md
│   │   ├── metadata.instructions.md
│   │   └── python-scripts.instructions.md
│   └── skills/
│       ├── add-new-page/
│       │   └── SKILL.md
│       ├── update-navigation/
│       │   └── SKILL.md
│       ├── add-blog-item-metadata/
│       │   └── SKILL.md
│       ├── process-images/
│       │   └── SKILL.md
│       ├── content-editing/
│       │   └── SKILL.md
│       └── static-site-review/
│           └── SKILL.md
├── scripts/
├── tech-blog/
├── .gitignore
├── AGENTS.md
└── README.md
```

## Main Page Structure

Main HTML pages should live in the repository root.

Recommended root pages:

```text
index.html
about.html
cinema.html
photography.html
tech-blog.html
consulting-teaching.html
contact.html
```

These pages are high-level entry points and should link into detailed section pages where needed.

## Section Structure

Detailed pages should live inside section folders.

Current cinema example:

```text
cinema/
├── metadata.json
├── aftersun.html
├── banshees-of-inisherin.html
├── birdman.html
├── everything-everywhere-all-at-once.html
├── tar.html
└── three-colors-trilogy.html
```

The same pattern can be used for future or growing sections:

```text
tech-blog/
photo-blog/
```

Each section can contain:

- individual HTML pages
- a `metadata.json` file
- references to images in `assets/images/...`

## Reusable Layout Strategy

The site should avoid copying the same sidebar, navbar, header, and footer markup into every HTML file.

Each page should use this placeholder:

```html
<header id="site-header"></header>
```

Page-specific content should stay inside:

```html
<main id="main-collapse">
  <!-- page-specific content -->
</main>
```

The reusable layout JavaScript should own:

- mobile navbar
- sidebar shell
- site header
- navigation links
- active page highlighting
- footer/social links
- relative path handling for root and nested pages

This replaces the older approach of manually updating sidebar links in every HTML file.

## Assets

All static assets should stay under `assets/`.

Current structure:

```text
assets/
├── fonts/
├── images/
│   ├── consulting/
│   ├── movies/
│   ├── photos/
│   └── tech/
└── js/
```

Recommended refinement as the project grows:

```text
assets/
├── css/
├── js/
├── fonts/
└── images/
    ├── consulting/
    ├── movies/
    ├── photos/
    │   ├── big/
    │   └── small/
    └── tech/
```

Guidelines:

- Keep JavaScript in `assets/js/`.
- Keep fonts in `assets/fonts/`.
- Keep images in `assets/images/<section>/`.
- If CSS is still in the root, consider moving it to `assets/css/` when paths are updated safely.
- Avoid scattering static assets in the repository root.

## Image Workflow

Original or high-resolution photos should be kept separate from generated web-sized photos.

Recommended photo folders:

```text
assets/images/photos/big/      # original/high-resolution photos
assets/images/photos/small/    # generated web-sized photos
```

Use the Python script in `scripts/` to proportionally downscale images:

```bash
python scripts/shape_images.py assets/images/photos/big assets/images/photos/small --max-width 1200 --max-height 1200
```

If the project still uses the older script name, keep this command until the migration is complete:

```bash
python scripts/resize_images.py
```

Image rules:

- Do not overwrite original photos.
- Use optimized images in cards, grids, and listing pages.
- Use larger images only where needed, such as detail pages.
- Keep filenames URL-safe: lowercase, hyphens, and no spaces.
- Add useful `alt` text in HTML and metadata.

## Metadata

Section folders can use `metadata.json` to support better UX and presentation.

Current example:

```text
cinema/metadata.json
```

Recommended future examples:

```text
tech-blog/metadata.json
photo-blog/metadata.json
```

Recommended top-level shape:

```json
{
  "section": "cinema",
  "title": "Cinema",
  "description": "Film notes, reviews, and reflections.",
  "items": []
}
```

Recommended item shape:

```json
{
  "id": "three-colors-trilogy",
  "slug": "three-colors-trilogy",
  "title": "Three Colors Trilogy",
  "type": "cinema",
  "status": "published",
  "date": "2026-01-01",
  "updated": "2026-01-01",
  "summary": "Short description used on cards and previews.",
  "url": "cinema/three-colors-trilogy.html",
  "heroImage": "assets/images/movies/three-colors-trilogy.jpg",
  "thumbnail": "assets/images/movies/three-colors-trilogy.jpg",
  "alt": "Image representing the article",
  "tags": ["cinema", "review"],
  "categories": ["film"],
  "featured": false,
  "sortOrder": 100
}
```

Metadata rules:

- Keep JSON valid and consistently formatted.
- Keep `id` and `slug` stable after publishing.
- Each `url` should point to an existing HTML file.
- Image paths should point to existing assets.
- Use ISO-style dates: `YYYY-MM-DD`.
- Keep summaries useful for cards, previews, and SEO snippets.

## Design Language

- **Primary accent color:** `#ff6360`
- **Typography:** Cabin for headings, Source Sans Pro for body text if the template already loads them.
- **Icons:** Font Awesome 4.7.0 if already included by the template.
- **Framework style:** Bootstrap 3-style grid and utility classes.
- **Responsive breakpoints:** test around `< 768px`, `768px–1199px`, and `≥ 1200px`.
- **Transitions:** keep interactive transitions subtle, around `0.2s–0.3s` where already used.

## Customization

### Adding or Updating Photos

1. Put original photos in the correct source folder, preferably:

   ```text
   assets/images/photos/big/
   ```

2. Generate optimized versions:

   ```bash
   python scripts/shape_images.py assets/images/photos/big assets/images/photos/small --max-width 1200 --max-height 1200
   ```

3. Reference optimized images from HTML or metadata.
4. Test the gallery/listing layout on mobile, tablet, and desktop.

### Adding a New Cinema, Tech, or Photo Item

1. Create the new `.html` page in the relevant section folder.
2. Add or update the entry in the section `metadata.json`.
3. Use an optimized image from `assets/images/...`.
4. Check that the page URL, thumbnail, tags, summary, and date are correct.
5. Test navigation and responsive layout.

### Changing Navigation

Navigation should be changed in the reusable sidebar/layout JavaScript, not separately in every HTML file.

When changing navigation:

- update the nav configuration array
- keep labels short
- verify all URLs exist
- verify active page highlighting
- test root pages and nested pages

## Documentation

Project documentation lives in `docs/`.

Current docs:

```text
docs/
├── agents/
├── architecture.md
├── site-structure.md
└── style-guide.md
```

Recommended docs as the site grows:

```text
docs/agentic-strategy.md
docs/image-workflow.md
docs/metadata-model.md
```

## Agentic Strategy

The project uses Markdown files to guide AI agents and Copilot-style workflows.

### Core Files

Recommended:

```text
AGENTS.md
README.md
docs/agents/
.github/
```

### `.github` Instructions and Skills

Repository-wide Copilot guidance:

```text
.github/copilot-instructions.md
```

Path-specific instructions:

```text
.github/instructions/
├── html.instructions.md
├── javascript.instructions.md
├── css-assets.instructions.md
├── metadata.instructions.md
└── python-scripts.instructions.md
```

Repeatable workflow skills:

```text
.github/skills/
├── add-new-page/
│   └── SKILL.md
├── update-navigation/
│   └── SKILL.md
├── add-blog-item-metadata/
│   └── SKILL.md
├── process-images/
│   └── SKILL.md
├── content-editing/
│   └── SKILL.md
└── static-site-review/
    └── SKILL.md
```

### Web Development Agent

Focus areas:

- HTML structure
- reusable sidebar/header/footer
- navigation
- JavaScript behavior
- asset paths
- metadata integration
- image workflow
- accessibility
- responsive behavior

### Content Editor and Creator Agent

Focus areas:

- page copy
- article titles
- article summaries
- tags and categories
- metadata text
- UX copy
- preserving the author’s voice

Recommended folder:

```text
docs/agents/
├── web-dev-agent.md
└── content-editor-agent.md
```

## Deployment

The site is deployed with GitHub Pages. For a user/organization site repository named `ugurkostak.github.io`, pushing changes to the configured branch publishes the static files.

No additional build step is required unless one is intentionally added later.

## Browser Support

Target modern browsers:

- Chrome / Edge
- Firefox
- Safari
- iOS Safari
- Chrome on Android

## Development Checklist

Before finishing a change, check:

- Page loads through the local server.
- No obvious browser console errors.
- Navigation works from root pages and nested pages.
- Mobile sidebar/navbar behavior still works.
- Active navigation state is correct.
- Images load from `assets/images/...`.
- Metadata JSON remains valid.
- Links use correct relative paths.
- No duplicated sidebar/header/footer markup was introduced.
- No unnecessary dependency or build step was added.

## Common Commands

Start local server:

```bash
python -m http.server 8000
```

Resize photos proportionally:

```bash
python scripts/shape_images.py assets/images/photos/big assets/images/photos/small --max-width 1200 --max-height 1200
```

Older image workflow, if still present:

```bash
python scripts/resize_images.py
```

## License

© Ugur Kostak. All rights reserved.
