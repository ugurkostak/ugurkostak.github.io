# Metadata Model

## Purpose

Metadata files describe cinema articles, tech writings, photo stories, and gallery items. They make the site easier to sort, filter, present, and improve over time.

## Recommended File Locations

```text
cinema/metadata.json
tech-blog/metadata.json
algorithmic-art/metadata.json
photography/metadata.json
```

## Recommended Top-Level Shape

```json
{
  "section": "cinema",
  "title": "Cinema",
  "description": "Film notes, reviews, and reflections.",
  "items": []
}
```

## Recommended Item Shape

```json
{
  "id": "three-colors-trilogy",
  "slug": "three-colors-trilogy",
  "title": "Three Colors Trilogy",
  "type": "cinema",
  "status": "published",
  "date": "2026-01-01",
  "publishedDate": "2026-01-01",
  "updated": "2026-01-01",
  "summary": "Short description used on cards and previews.",
  "url": "cinema/three-colors-trilogy.html",
  "heroImage": "assets/images/cinema/three-colors-trilogy/cover.png",
  "thumbnail": "assets/images/cinema/three-colors-trilogy/cover.png",
  "contentImages": [
    {
      "src": "assets/images/cinema/three-colors-trilogy/blue.jpg",
      "alt": "Additional image used inside the article",
      "caption": "Optional caption for the in-article image"
    }
  ],
  "alt": "Image representing the article",
  "tags": ["cinema", "review"],
  "categories": ["film"],
  "featured": false,
  "sortOrder": 100
}
```

## Field Guidance

- `id`: stable internal identifier
- `slug`: stable URL-friendly identifier
- `title`: display title
- `type`: section/content type
- `status`: `draft`, `published`, or `archived`
- `date`: primary chronology date for sorting. For cinema entries, keep using the established film/release date unless the section is migrated intentionally.
- `publishedDate`: site publication, watched, or posting date when it differs from the chronology date
- `updated`: last meaningful update date
- `summary`: card/listing summary
- `url`: relative path to HTML page
- `heroImage`: larger image for detail pages
- `thumbnail`: optimized image for cards
- `contentImages`: additional images used inside the page content, separate from the cover/hero image. Use an array so entries can include multiple in-article images.
- `alt`: image alt text
- `tags`: reusable discovery labels
- `categories`: broader grouping labels
- `featured`: whether item appears in featured areas
- `sortOrder`: manual ordering fallback

## Validation Rules

- JSON must parse.
- `id` and `slug` should be unique within the section.
- `slug` must equal the basename of the corresponding HTML file in the section folder (e.g. slug `tar` ⇔ `cinema/tar.html`). `blog.js` builds links as `./<section>/<slug>.html`.
- `url` (when present) should point to an existing HTML file in the section folder.
- image paths should point to existing files in `assets/images/<section>/`.
- published items should have a date and summary.
- Articles should be ordered by date (newest first).

## Alternative Metadata Shapes

Different sections may use slightly different metadata structures while maintaining core fields. For example:

**Algorithmic Art:** May include additional fields for technical metadata:

```json
{
  "id": "1",
  "title": "3D Cube Visualization",
  "slug": "3d-cube",
  "description": "Interactive 3D rotating cube - Mathematical elegance in 3 dimensions",
  "date": "2026-05-26",
  "author": "Ugur Kostak",
  "category": "visualization",
  "tags": ["3d", "geometry", "interactive"],
  "image": "./assets/images/algorithmic-art/3d-cube.jpg",
  "content": "Description of interactive visualization",
  "featured": true
}
```

Keep metadata human-readable and stable within each section type.
