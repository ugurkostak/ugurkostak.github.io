# Image Workflow

## Goals

- Keep original images safe.
- Generate web-optimized versions.
- Keep section assets organized.
- Improve performance and UX.

## Folder Structure

```text
assets/images/
├── photos/
│   ├── big/         # original/high-resolution photos
│   └── small/       # generated web-sized photos
├── movies/          # cinema images
├── tech/            # technology images
├── consulting/      # consulting/teaching images
└── math/            # algorithmic art and visualization images
```

## Downscaling

Use the script:

```bash
python scripts/shape_images.py assets/images/photos/big assets/images/photos/small --max-width 1200 --max-height 1200
```

The script:

- preserves aspect ratio
- avoids upscaling by default
- keeps originals untouched
- supports common image formats through Pillow

## Recommended Sizes

- Card thumbnails: around 600–900 px wide
- Standard web images: around 1200 px wide or high
- Large hero images: around 1600–2000 px if needed

## Best Practices

- Use generated small images in grids and listing cards.
- Use larger images only on detail pages.
- Keep filenames URL-safe: lowercase, hyphens, no spaces.
- Add alt text in HTML and metadata.
