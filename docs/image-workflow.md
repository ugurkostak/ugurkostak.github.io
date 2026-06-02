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
├── cinema/          # cinema images, nested per article
│   └── <slug>/      # one folder per cinema article
│       ├── cover.<ext>   # listing/hero image (required)
│       └── *.<ext>       # additional in-article stills
├── tech/            # technology images
└── math/            # algorithmic art and visualization images
```

## Cinema Image Convention

Each cinema article owns a folder named after its `slug`:

- `assets/images/cinema/<slug>/cover.<ext>` — the listing card image and article hero. Referenced by `image` in `cinema/metadata.json`.
- Additional stills go in the same folder with descriptive filenames (e.g. `poster.png`, `still-1.jpg`, or per-segment names like `blue.jpg`, `white.png`, `red.jpg` for the trilogy). Referenced by `contentImages[].src` in metadata.

Keep filenames URL-safe (lowercase, hyphens, no spaces). When adding a new cinema entry, create the folder first, drop the cover and any stills inside, then reference them from metadata and the article HTML using the nested paths.

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
- Use `assets/images/tech/` for soft-skills/professional-growth article images unless a dedicated soft-skills section is explicitly requested.
