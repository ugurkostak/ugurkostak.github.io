# Skill: Process Images

## Use When

Use this skill when adding, resizing, or preparing images for web presentation.

## Steps

1. Put originals in `assets/images/photos/big/` or the relevant section image folder.
2. Run `scripts/shape_images.py` to generate web-sized versions.
3. Store generated photos in `assets/images/photos/small/` or the appropriate output folder.
4. Use optimized images in gallery grids and cards.
5. Keep original files untouched.
6. Update metadata and HTML to point to optimized images.

## Example Command

```bash
python scripts/shape_images.py assets/images/photos/big assets/images/photos/small --max-width 1200 --max-height 1200
```

## Final Response

Report:

- number of images processed
- output folder
- any skipped files
