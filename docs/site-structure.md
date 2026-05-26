# Site Structure

## Current Tree

```text
/
├── README.md
├── AGENTS.md
├── index.html
├── about.html
├── algorithmic-art.html      # Interactive visualizations and mathematics
├── cinema.html
├── photography.html
├── tech-blog.html
├── consulting-teaching.html
├── contact.html
├── assets/
│   ├── css/
│   ├── js/
│   │   ├── algorithmic-art/
│   │   │   ├── cube-visualization.js
│   │   │   ├── prime-visualization.js
│   │   │   └── vendor/
│   │   │       └── three.*.js (Three.js WebGL library)
│   │   ├── sidebar.js
│   │   ├── blog.js
│   │   ├── timeline-filter.js
│   │   └── [other utilities]
│   ├── fonts/
│   └── images/
│       ├── consulting/
│       ├── movies/
│       ├── photos/
│       │   ├── big/
│       │   └── small/
│       ├── math/
│       └── tech/
├── algorithmic-art/
│   ├── metadata.json
│   ├── 3d-cube.html
│   └── ulam-spiral.html
├── cinema/
│   ├── metadata.json
│   └── *.html
├── tech-blog/
│   ├── metadata.json
│   └── *.html
├── photo-blog/
│   ├── metadata.json
│   └── *.html
├── scripts/
│   └── shape_images.py
├── docs/
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/
│   │   ├── html.instructions.md
│   │   ├── javascript.instructions.md
│   │   ├── css-assets.instructions.md
│   │   ├── metadata.instructions.md
│   │   └── python-scripts.instructions.md
│   ├── agents/
│   │   ├── web-dev-agent.md
│   │   └── content-editor-agent.md
│   └── skills/
│       ├── add-new-page/
│       ├── update-navigation/
│       ├── add-blog-item-metadata/
│       ├── process-images/
│       ├── content-editing/
│       ├── static-site-review/
│       └── timeline-filter-skill/
└── .gitignore
```

## Root Pages

Root pages are high-level navigation destinations.

Examples:

- `index.html` — Homepage
- `about.html` — About page
- `algorithmic-art.html` — Interactive visualizations and mathematical explorations
- `cinema.html` — Cinema writings collection
- `photography.html` — Photography gallery
- `tech-blog.html` — Technology blog collection
- `consulting-teaching.html` — Consulting and teaching background
- `contact.html` — Contact information

## Section Folders

Section folders contain individual article/detail pages and metadata.

Current examples:

- `algorithmic-art/` — Interactive 3D visualizations, prime number explorations, and mathematical patterns
- `cinema/` — Individual film reviews and articles
- `tech-blog/` — Individual technology articles
- `photo-blog/` — (Future) Individual photo stories

Each section folder requires:

- `metadata.json` — Machine-readable collection metadata
- `*.html` — Individual detail pages (2 or more per collection)
- Optional: section-specific JavaScript modules in `assets/js/<section>/`

## Assets Organization

Do not scatter CSS, JavaScript, or fonts in the repository root. Keep them under `assets/`.

Current structure:

```text
assets/
├── css/                              # Style sheets
├── js/                               # JavaScript files
│   ├── sidebar.js                    # Navigation and layout
│   ├── blog.js                       # Collection page rendering
│   ├── timeline-filter.js            # Year-based filtering for timelines
│   ├── algorithmic-art/              # Section-specific modules
│   │   ├── cube-visualization.js
│   │   ├── prime-visualization.js
│   │   └── vendor/                   # Third-party libraries (Three.js)
│   └── [utilities]
├── fonts/                            # Web fonts
├── images/                           # Images organized by section
│   ├── consulting/
│   ├── movies/
│   ├── math/
│   ├── photos/
│   │   ├── big/                      # Original high-resolution
│   │   └── small/                    # Web-optimized versions
│   └── tech/
└── favicon.ico
```

Guidelines:

- Keep JavaScript in `assets/js/`.
- Keep section-specific modules in `assets/js/<section>/`.
- Keep third-party libraries (vendor) in `assets/js/<section>/vendor/`.
- Keep fonts in `assets/fonts/`.
- Keep images in `assets/images/<section>/`.
- Keep CSS in `assets/css/` (can be section-specific or unified).
