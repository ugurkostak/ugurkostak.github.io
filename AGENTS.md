# AI Agent Instructions for ugurkostak.github.io

This is a **static GitHub Pages portfolio website** built with Bootstrap 3.3.7, featuring photography galleries and a responsive sidebar navigation.

## Project Structure

```
/
├── index.html                 # Homepage with featured photo grid
├── about.html                 # Bio and professional info
├── photography.html           # Main portfolio gallery
├── movie.html                 # Services/content showcase
├── contact.html               # Contact form
├── project.html               # Individual portfolio detail page
├── components.html            # UI component reference
├── assets/
│   ├── images/                # General images
│   └── photos/small/          # Pre-resized portfolio photos (800×800px)
├── scripts/
│   └── resize_images.py       # Python script to optimize photos
├── main.{hash}.css            # Minified CSS (cache-busted)
└── main.{hash}.js             # Minified JavaScript
```

## Key Architectural Patterns

### Navigation & Page Layout
- **Fixed sidebar** (left on desktop, slide-in on mobile below 768px)
- All pages share the same template structure: header → sidebar → main content → footer
- Active page highlighting: Add `class="active"` to nav link for current page
- Responsive sidebar: Use `.sidebar` class with left positioning

### Responsive Grid System
- **Breakpoints**: Bootstrap 3 standard
  - `col-xs-*`: Mobile (< 768px)
  - `col-md-*`: Tablet (≥ 768px)
  - `col-lg-*`: Desktop (≥ 1200px)
- **Gallery grids**: Masonry layout with `.grid-item` class; hover overlays for interactivity
- Always test changes at 768px (mobile/tablet transition) and 1200px (tablet/desktop transition)

### Design Language
- **Primary accent color**: `#ff6360` (red) — use for links, buttons, highlights
- **Typography**: Cabin (headings), Source Sans Pro (body text)
- **Icons**: Font Awesome 4.7.0
- **Spacing utility**: Bootstrap classes like `.section-container-spacer`
- **Animations**: Smooth 0.2–0.3s linear transitions for interactive elements

### Asset Organization
- **Portfolio images**: Place pre-sized photos in `/assets/photos/small/`
- **General assets**: Use `/assets/images/` for non-photo assets
- **Link format**: All links are relative paths (e.g., `./assets/photos/small/image.png`)

## Build & Development

### Image Optimization
```bash
python scripts/resize_images.py
```
- Resizes photos to 800×800px for portfolio consistency
- Use this before adding new photos to the gallery

### CSS/JS
- Current main files are **minified** with hash-based filenames (cache busting)
- Work with minified files as-is; no build tool currently visible

## Common Tasks

### Add a New Portfolio Page
1. Create new `.html` file (e.g., `new-portfolio.html`)
2. Copy the page template from `project.html`
3. Update sidebar nav links across all `.html` files to include new page
4. Add `class="active"` to the nav link for the new page
5. Use Bootstrap grid classes for responsive layout

### Update Navigation
- Edit the sidebar nav menu in all HTML files (or set up a templating system if planning major changes)
- Ensure `class="active"` is on the current page's link
- Test navigation on mobile (<768px) and desktop (≥1200px)

### Add/Update Photos
1. Resize images to 800×800px using `python scripts/resize_images.py`
2. Place optimized images in `/assets/photos/small/`
3. Update HTML with relative paths to new images
4. Test responsive grid layout at all breakpoints

### Styling Changes
- Use `#ff6360` as primary accent color for consistency
- Leverage Bootstrap 3 utility classes before adding custom CSS
- Maintain 0.2–0.3s transitions for interactive elements

## Code Style & Conventions
- **HTML**: Semantic structure; relative paths for all assets
- **CSS**: Bootstrap-first; class naming is hyphenated (e.g., `.grid-item`, `.project-description`)
- **JavaScript**: Vanilla JS (minified); avoid external build tools
- **Responsive first**: Mobile breakpoint (`col-xs-*`) is baseline; add tablet/desktop overrides

## Notes for AI Agents
- **Don't edit minified files directly** if source files are available; work with readable source code
- All pages follow the same template—consistency is key
- Test responsive behavior at key breakpoints (768px, 1200px)
- Use `.active` class on nav links to highlight current page
- Font Awesome 4.7.0 for icons; check availability of icon names in that version
- Preserve the styling and guidance format in `AGENTS.md` and `.github/copilot-instructions.md` unless the user explicitly asks for those agent instructions to be changed.
