# Skill: Add Blog or Gallery Item Metadata

## Use When

Use this skill when adding a cinema article, tech article, photo story, or gallery item.

## Steps

1. Determine the section: `cinema`, `tech-blog`, or `photo-blog`.
2. Create or update the section HTML page.
3. Link to unified blog files: `assets/css/blog.css` and `assets/js/blog.js` (all collection pages use the same styling).
4. Add a metadata entry in the section's `metadata.json`.
5. Include stable `id`, `slug`, `title`, `type`, `date`, `summary`, `url`, image paths, tags, and status.
6. Check that the referenced URL and images exist.
7. Keep the slug URL-safe and stable.
8. **Ensure articles are ordered by date (newest first) in the metadata array.**

## Metadata Quality Rules

- Summary should be useful for cards and previews.
- Tags should help filtering and discovery.
- Hero image and thumbnail should be optimized for web use.
- Use `featured` only for intentionally highlighted content.
- **Articles must be sorted by date descending (newest first).**

## Final Response

Report:

- metadata file changed
- item added/updated
- articles verified in correct order (newest first)
- missing assets or follow-up tasks
