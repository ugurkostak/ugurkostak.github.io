---
name: add-blog-item-metadata
description: "Use when: adding or updating metadata for cinema, tech-blog, photography, algorithmic-art, or soft-skills articles. Use tech-blog for soft-skills content unless a dedicated section is requested."
---

# Skill: Add Blog or Gallery Item Metadata

## Use When

Use this skill when adding or updating a cinema article, tech article, algorithmic-art visualization, photography story, gallery item, or soft-skills article.

## Steps

1. Determine the section: `cinema`, `tech-blog`, `algorithmic-art`, or `photography`.
2. Create or update the section HTML page.
3. Link to unified blog files: `assets/css/blog.css` and `assets/js/blog.js` (all collection pages use the same styling).
4. Add a metadata entry in the section's `metadata.json`.
5. For soft-skills writing, use `tech-blog/metadata.json` unless the user explicitly requests a dedicated soft-skills section.
6. Follow the existing metadata shape for the section. Include stable `id`, `slug`, `title`, `date`, description/summary text, image paths, tags, and featured/status fields where the section already uses them.
7. Check that the referenced URL and images exist.
8. Keep the slug URL-safe and stable.
9. **Ensure articles are ordered by date (newest first) in the metadata array.**

## Metadata Quality Rules

- Summary should be useful for cards and previews.
- Tags should help filtering and discovery.
- Soft-skills tags should be specific, such as `communication`, `feedback`, `collaboration`, `mentoring`, `career-growth`, `learning`, or `teamwork`.
- Hero image and thumbnail should be optimized for web use.
- Use `featured` only for intentionally highlighted content.
- **Articles must be sorted by date descending (newest first).**

## Final Response

Report:

- metadata file changed
- item added/updated
- articles verified in correct order (newest first)
- missing assets or follow-up tasks
