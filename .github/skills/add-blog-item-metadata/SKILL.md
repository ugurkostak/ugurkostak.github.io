# Skill: Add Blog or Gallery Item Metadata

## Use When

Use this skill when adding a cinema article, tech article, photo story, or gallery item.

## Steps

1. Determine the section: `cinema`, `tech-writings`, or `photo-blog`.
2. Create or update the section HTML page.
3. Add a metadata entry in the section’s `metadata.json`.
4. Include stable `id`, `slug`, `title`, `type`, `date`, `summary`, `url`, image paths, tags, and status.
5. Check that the referenced URL and images exist.
6. Keep the slug URL-safe and stable.

## Metadata Quality Rules

- Summary should be useful for cards and previews.
- Tags should help filtering and discovery.
- Hero image and thumbnail should be optimized for web use.
- Use `featured` only for intentionally highlighted content.

## Final Response

Report:

- metadata file changed
- item added/updated
- missing assets or follow-up tasks
