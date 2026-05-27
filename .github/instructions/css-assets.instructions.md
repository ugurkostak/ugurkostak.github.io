---
applyTo: "assets/**/*"
---

# CSS and Asset Instructions

## Folder Rules

- CSS belongs in `assets/css/`.
- JavaScript belongs in `assets/js/`.
- Fonts belong in `assets/fonts/`.
- Images belong in `assets/images/<section>/`.

## Image Rules

- Movie images: `assets/images/movies/`
- Tech images: `assets/images/tech/`
- Math/algorithmic-art images: `assets/images/algorithmic-art/`
- Photo originals: `assets/images/photos/big/`
- Photo web versions: `assets/images/photos/small/`
- Soft-skills article images should follow the existing tech-blog pattern in `assets/images/tech/` unless a dedicated section is explicitly requested.

## Styling Rules

- Preserve the current design language.
- Prefer Bootstrap-compatible class patterns.
- Avoid overly specific selectors.
- Do not remove responsive behavior.
- Keep custom CSS readable if editing non-minified CSS.
- Avoid editing minified vendor/template files if readable source files exist.
- **Unified blog styling:** Use `assets/css/blog.css` for all collection pages (tech-blog, cinema, photography, etc.). Do not create page-specific CSS files for blog/gallery collections.

## Performance

- Use optimized images in page cards and lists.
- Do not reference original high-resolution photos in listing grids unless required.
