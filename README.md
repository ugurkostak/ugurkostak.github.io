# Ugur Kostak Portfolio Website

A modern, responsive photography portfolio built with Bootstrap 3.3.7 and deployed on GitHub Pages.

## Features

- **Responsive Design** — Mobile-first layout that adapts beautifully from phone (< 768px) to tablet (768px–1199px) to desktop (≥ 1200px)
- **Photography Gallery** — Masonry grid with hover overlays showcasing your work
- **Fast & Lightweight** — Static HTML/CSS/JS with minified assets and cache busting via hash-based filenames
- **Accessible Navigation** — Fixed sidebar menu on desktop, slide-in menu on mobile
- **Optimized Images** — 800×800px photos pre-sized for fast loading
- **Simple to Maintain** — No build tools or complex dependencies; plain HTML/CSS/JavaScript

## Project Structure

```
├── index.html              # Homepage with featured photos
├── about.html              # Biography and professional info
├── photography.html        # Main portfolio gallery
├── movie.html              # Services showcase
├── contact.html            # Contact form
├── project.html            # Detail page template for portfolio items
├── components.html         # UI component reference
│
├── assets/
│   ├── images/             # General images (logos, etc.)
│   └── photos/small/       # Portfolio photos (800×800px)
│
├── scripts/
│   └── resize_images.py    # Image optimization script
│
├── main.{hash}.css         # Minified CSS (cache-busted)
├── main.{hash}.js          # Minified JavaScript
├── AGENTS.md               # AI agent instructions (for developers)
└── README.md               # This file
```

## Getting Started

### View the Live Site
The site is deployed at: `https://ugurkostak.github.io`

### Local Development
No build step required. Simply open any `.html` file in your browser or serve locally:

```bash
# Python 3
python -m http.server 8000

# Or with Python 2
python -m SimpleHTTPServer 8000
```

Then visit `http://localhost:8000` in your browser.

## Customization

### Adding/Updating Photos

1. **Optimize images** to 800×800px:
   ```bash
   python scripts/resize_images.py
   ```
   Place original photos in `assets/photos/` and the script will create optimized versions in `assets/photos/small/`.

2. **Update HTML** to reference the new photos:
   ```html
   <img src="./assets/photos/small/my-photo.png" alt="Description">
   ```

3. **Test responsiveness** at key breakpoints:
   - 768px (tablet transition)
   - 1200px (desktop transition)

### Changing Content

- **Update text**: Edit any `.html` file directly
- **Change colors**: The primary accent color is `#ff6360` (red). Use this for links, buttons, and highlights
- **Update navigation**: Add links to the sidebar menu in all `.html` files, and mark the current page with `class="active"`

### Styling Changes

- The site uses **Bootstrap 3.3.7** utility classes. Leverage these before adding custom CSS
- Maintain smooth **0.2–0.3s transitions** for interactive elements
- Mobile-first approach: start with `col-xs-*` classes, then add tablet/desktop overrides with `col-md-*` and `col-lg-*`

### Adding a New Portfolio Page

1. Copy `project.html` as a template
2. Update the content in the `.main` section
3. Add a link in the sidebar navigation across all `.html` files
4. Mark the current page with `class="active"` on its nav link
5. Test navigation and responsive layout

## Design Language

| Element | Value |
|---------|-------|
| **Primary Color** | `#ff6360` (Red) |
| **Typography** | Cabin (headings), Source Sans Pro (body) |
| **Icons** | Font Awesome 4.7.0 |
| **Framework** | Bootstrap 3.3.7 |
| **Spacing** | Bootstrap utility classes (margins, padding) |

## Development Notes

For detailed developer instructions, see [AGENTS.md](AGENTS.md), which covers:
- Responsive design breakpoints and testing
- Template structure and navigation patterns
- Asset organization
- Common tasks and workflows

## Deployment

The site is automatically deployed to GitHub Pages when you push to the repository. No additional configuration needed.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

© Ugur Kostak. All rights reserved.
