---
applyTo: "**/metadata.json"
---

# Metadata Instructions

## Purpose

Metadata files support better UX, listing pages, cards, filters, sorting, search, and SEO.

## Rules

- Keep JSON valid and consistently formatted.
- Preserve stable `slug` values once published.
- Each entry should map to an existing HTML file.
- Use relative paths from the site root when practical.
- Keep titles human-readable and summaries concise.
- Use ISO-style dates: `YYYY-MM-DD`.
- Prefer arrays for `tags` and `categories`.

## Recommended Entry Shape

```json
{
  "id": "three-colors-trilogy",
  "slug": "three-colors-trilogy",
  "title": "Three Colors Trilogy",
  "type": "cinema",
  "status": "published",
  "date": "2026-01-01",
  "summary": "Short human-written summary for cards and previews.",
  "url": "cinema/three-colors-trilogy.html",
  "heroImage": "assets/images/movies/three_colors_trilogy.jpg",
  "thumbnail": "assets/images/movies/three_colors_trilogy.jpg",
  "alt": "Poster or still representing Three Colors Trilogy",
  "tags": ["cinema", "review"],
  "categories": ["film"],
  "featured": false,
  "sortOrder": 100
}
```

## Validation

After editing metadata:

- Parse JSON successfully.
- Check referenced `url` exists.
- Check referenced image paths exist.
- Check no duplicate `id` or `slug` values.
