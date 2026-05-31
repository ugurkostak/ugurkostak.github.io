---
name: add-blog-item-metadata
description: "Use when: adding or updating metadata entries for cinema, tech-blog (including soft-skills unless a dedicated section is requested), algorithmic-art, or photography (including gallery items)."
---

# Skill: Add Blog Item Metadata

## Use When

Use this skill when adding or updating a cinema article, tech article, algorithmic-art visualization, photography story (including gallery items, which are part of the `photography` section), or soft-skills article.

## Steps

1. Determine the section: `cinema`, `tech-blog`, `algorithmic-art`, or `photography` (which includes gallery items).
2. Create or update the section HTML page.
3. Link to unified blog files: `assets/css/blog.css` and `assets/js/blog.js` (all collection pages use the same styling).
4. Add a metadata entry in the section's `metadata.json`.
5. For soft-skills writing, use `tech-blog/metadata.json` unless the user explicitly requests a dedicated soft-skills section.
6. Follow the existing metadata shape for the section. Include stable `id`, `slug`, `title`, `date`, description/summary text, image paths, tags, and featured/status fields where the section already uses them.
7. Check that the referenced URL and images exist.
8. Keep the slug URL-safe and stable.
9. **Ensure articles are ordered by date (newest first) in the metadata array.**
10. To remove an item, delete its entry from `metadata.json` and verify no other entries reference it.

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
