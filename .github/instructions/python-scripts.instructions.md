---
applyTo: "scripts/**/*.py"
---

# Python Script Instructions

## Rules

- Use Python standard library where possible.
- Pillow may be used for image processing.
- Scripts should be safe by default and should not overwrite originals unless explicitly requested.
- Use clear command-line arguments.
- Print a concise summary of processed, skipped, and failed files.
- Keep scripts cross-platform.
- Avoid hardcoded absolute paths.

## Image Script Expectations

- Preserve aspect ratio by default.
- Support JPEG, PNG, and WebP when Pillow supports them.
- Save optimized output into a separate folder.
- Convert EXIF orientation correctly.
- Do not upscale images unless explicitly requested.
