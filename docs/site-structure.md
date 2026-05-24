# Site Structure

## Target Tree

```text
/
├── README.md
├── AGENTS.md
├── index.html
├── about.html
├── cinema.html
├── photography.html
├── tech-writings.html
├── consulting-teaching.html
├── contact.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── fonts/
│   └── images/
│       ├── consulting/
│       ├── movies/
│       ├── photos/
│       │   ├── big/
│       │   └── small/
│       └── tech/
├── cinema/
│   ├── metadata.json
│   └── *.html
├── tech-writings/
│   ├── metadata.json
│   └── *.html
├── photo-blog/
│   ├── metadata.json
│   └── *.html
├── scripts/
│   └── shape_images.py
├── docs/
└── .github/
```

## Root Pages

Root pages are high-level navigation destinations.

Examples:

- `index.html`
- `about.html`
- `cinema.html`
- `photography.html`
- `tech-writings.html`
- `consulting-teaching.html`
- `contact.html`

## Section Folders

Section folders contain individual article/detail pages and metadata.

Examples:

```text
cinema/
tech-writings/
photo-blog/
```

## Assets

Do not scatter CSS, JavaScript, or fonts in the repository root. Move them under `assets/` when practical.

Recommended migration:

- `main.*.css` → `assets/css/main.css` or `assets/css/main.*.css`
- `main.*.js` → `assets/js/main.js` or `assets/js/main.*.js`
- `sidebar.js` → `assets/js/sidebar.js`
