---
applyTo: "**/*.html"
---

# HTML Instructions

## Page Skeleton

Every main or subpage should use the reusable layout placeholder:

```html
<header id="site-header"></header>
```

Page-specific content should be inside:

```html
<main id="main-collapse">
  <!-- page content -->
</main>
```

## Rules

- Do not duplicate the full sidebar/header/footer HTML in individual pages.
- Use semantic elements such as `main`, `section`, `article`, `nav`, `header`, and `footer` where appropriate.
- Preserve Bootstrap/template classes unless intentionally refactoring.
- Keep heading levels logical: one primary `h1`, then nested `h2`, `h3`, etc.
- Use descriptive anchor text.
- Use meaningful `alt` text for informative images.
- Decorative images should use empty `alt=""` when appropriate.
- Keep relative paths compatible with root and nested pages.

## Validation

After editing HTML:

- Check the page loads.
- Check sidebar/mobile navigation.
- Check images and links.
- Check there is no duplicated layout markup.
