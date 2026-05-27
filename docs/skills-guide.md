# Skills Guide

This document summarizes all available skills for common development tasks on the ugurkostak.github.io website.

Skills are repeatable, procedural workflows that automate and standardize recurring tasks. Each skill lives in `.github/skills/<skill-name>/SKILL.md`.

## Available Skills

### 1. Add New Static Page

**Path:** `.github/skills/add-new-page/SKILL.md`

**Use When:** Creating a new root page or section subpage for photography, cinema, tech-blog, algorithmic-art, or soft-skills content.

**What It Does:**
- Creates HTML file with project page skeleton
- Ensures proper header/main structure (`<header id="site-header"></header>` and `<main id="main-collapse">`)
- Validates navigation integration
- Updates metadata if applicable
- Checks relative paths

**Example Use Cases:**
- Adding an article to a section folder (e.g., `tech-blog/microservices.html`)
- Adding a soft-skills article in `tech-blog/` (e.g., `tech-blog/communication-feedback.html`)
- Creating a detail page linked from a metadata collection

---

### 2. Update Navigation

**Path:** `.github/skills/update-navigation/SKILL.md`

**Use When:** Changing sidebar links, adding new nav items, or updating active page highlighting.

**What It Does:**
- Updates nav configuration in `assets/js/sidebar.js`
- Verifies all URLs exist
- Tests desktop sidebar and mobile toggle
- Validates active page state

**Example Use Cases:**
- Adding algorithmic-art to the main menu
- Reordering navigation items
- Removing deprecated links
- Testing relative paths from root and nested pages
- Keeping consulting/teaching out of navigation unless explicitly requested

---

### 3. Add Blog Item to Metadata

**Path:** `.github/skills/add-blog-item-metadata/SKILL.md`

**Use When:** Adding a new cinema, tech-blog, algorithmic-art, photography, or soft-skills article.

**What It Does:**
- Creates metadata.json entry
- Validates JSON structure
- Ensures URL points to existing HTML file
- Checks image paths exist
- Orders articles by date (newest first)

**Example Use Cases:**
- Adding a new cinema review with metadata
- Publishing a new tech article
- Adding a new algorithmic-art visualization
- Publishing a soft-skills article through `tech-blog/metadata.json`
- Updating featured/unfeatured status

---

### 4. Process Images

**Path:** `.github/skills/process-images/SKILL.md`

**Use When:** Resizing photos for web, organizing image assets, or adding images to a section.

**What It Does:**
- Runs `scripts/shape_images.py` to downscale images
- Preserves aspect ratio
- Avoids upscaling
- Keeps originals in `assets/images/<section>/big/`
- Generates web versions in `assets/images/<section>/small/`
- Validates image paths in metadata

**Example Use Cases:**
- Preparing photos for the photography gallery
- Generating thumbnails for cinema article cards
- Resizing header images for tech blog
- Optimizing images for algorithmic-art visualizations
- Preparing images for soft-skills articles using `assets/images/tech/`

**Command:**
```bash
python scripts/shape_images.py assets/images/photos/big assets/images/photos/small --max-width 1200 --max-height 1200
```

---

### 5. Content Editing

**Path:** `.github/skills/content-editing/SKILL.md`

**Use When:** Updating article content, titles, summaries, tags, metadata text, or soft-skills writing.

**What It Does:**
- Edits page copy and content
- Updates metadata titles, summaries, and descriptions
- Maintains author's voice
- Preserves stable slugs
- Validates metadata JSON after changes

**Example Use Cases:**
- Rewriting article summaries
- Updating tags and categories
- Fixing typos and grammar
- Improving SEO metadata
- Improving practical, non-salesy soft-skills copy

---

### 6. Soft Skills Content

**Path:** `.github/skills/soft-skills-content/SKILL.md`

**Use When:** Creating or improving soft-skills, communication, leadership, mentoring, collaboration, feedback, career-growth, learning, teamwork, or professional-development content.

**What It Does:**
- Keeps soft-skills content practical, reflective, and specific
- Places soft-skills articles in `tech-blog/` by default
- Recommends discovery tags such as `communication`, `feedback`, `collaboration`, `mentoring`, `career-growth`, `learning`, and `teamwork`
- Prevents accidental consulting/teaching service copy unless explicitly requested

**Example Use Cases:**
- Drafting an article about feedback habits
- Improving a mentoring or collaboration essay
- Adding metadata for professional-growth writing
- Checking that a soft-skills article is not framed as consulting or teaching

---

### 7. Static Site Review

**Path:** `.github/skills/static-site-review/SKILL.md`

**Use When:** Validating site changes before deployment or checking for common issues.

**What It Does:**
- Validates HTML structure and paths
- Checks metadata JSON validity
- Verifies image references
- Tests navigation from root and nested pages
- Checks mobile responsiveness
- Validates accessibility basics (heading hierarchy, alt text)
- Ensures no duplicated markup
- Confirms active content scope and no unintended consulting/teaching content

**Example Use Cases:**
- Before committing major changes
- Validating a new section
- Testing after large refactors
- Preparing for deployment

---

### 8. Interactive Timeline Filter (timeline-filter-skill)

**Path:** `.github/skills/timeline-filter-skill/SKILL.md`

**Use When:** Adding year-based filtering to collection pages like cinema, photography, tech-blog, algorithmic-art, or a future explicitly requested soft-skills collection.

**What It Does:**
- Adds clickable year filter buttons
- Enables smooth scroll navigation
- Provides visual feedback for selected year
- Works on desktop and mobile
- No external dependencies

**Features:**
- Automatic year extraction from timeline items
- Responsive layout (inline on desktop, stacked on mobile)
- Keyboard navigable and accessible
- Click-to-navigate on current year display

**HTML Structure Required:**
```html
<div class="timeline-section">
  <div class="timeline-separator">
    <div class="timeline-date">
      <span class="timeline-month">Month</span>
      <span class="timeline-year">Year</span>
    </div>
  </div>
  
  <div class="hero-full-wrapper">
    <div class="grid">
      <div class="gutter-sizer"></div>
      <div class="grid-sizer"></div>
      
      <div class="grid-item timeline-item" data-year="2026" data-month="May" data-published="May 15, 2026">
        <!-- Content -->
      </div>
    </div>
  </div>
</div>
```

**Data Attributes Required:**
- `data-year` — Year value (e.g., "2026")
- `data-month` — Month name (e.g., "May")
- `data-published` — Optional full date for hover display

**Example Use Cases:**
- Adding year filtering to cinema collection
- Organizing photography timeline by year
- Filtering algorithmic-art by publication year
- Enhancing tech-blog navigation

---

## Skill Usage Workflow

1. **Identify the task** — Which skill applies to what you're doing?
2. **Read the SKILL.md** — Understand the steps and constraints.
3. **Follow the steps** — Execute the skill's procedure.
4. **Validate the result** — Use the skill's final checklist.
5. **Test the site** — Run local server and check mobile/desktop behavior.

## Combining Skills

Many tasks require combining multiple skills:

- **Adding a new cinema article:**
  1. `add-new-page` (create `cinema/my-film.html`)
  2. `add-blog-item-metadata` (add entry to `cinema/metadata.json`)
  3. `process-images` (resize hero/thumbnail images)
  4. `static-site-review` (validate everything)

- **Updating navigation after new section:**
  1. `add-new-page` (create root page `algorithmic-art.html`)
  2. `update-navigation` (add to sidebar)
  3. `add-new-page` (create section page `algorithmic-art/3d-cube.html`)
  4. `add-blog-item-metadata` (add to `algorithmic-art/metadata.json`)
  5. `static-site-review` (final validation)

- **Adding a soft-skills article:**
  1. `soft-skills-content` (shape the topic, tone, and placement)
  2. `add-new-page` (create a `tech-blog/<slug>.html` page by default)
  3. `add-blog-item-metadata` (add entry to `tech-blog/metadata.json`)
  4. `content-editing` (polish copy and summary)
  5. `static-site-review` (final validation)

## Constraints and Best Practices

- **Do not introduce frameworks** unless a skill explicitly requires them.
- **Preserve stable URLs** — avoid renaming published article slugs.
- **Keep metadata consistent** — use the same field structure within each section.
- **Keep consulting/teaching out of scope** — do not add service copy, metadata, or navigation unless explicitly requested.
- **Validate before committing** — always run `static-site-review` before pushing.
- **Keep it DRY** — if a task repeats, consider creating a new skill.

## When to Create a New Skill

Create a new skill when:

- A task is **repeatable** across multiple pages or sections.
- The task has a **clear sequence of steps**.
- The steps benefit from **automation or validation**.
- The task is **important enough to standardize**.

Examples of good candidates for new skills:
- Migrating a page structure across sections
- Setting up a new visualization (like timeline filter)
- Batch processing metadata
- Implementing a new component pattern

## References

- Architecture overview: `docs/architecture.md`
- Site structure: `docs/site-structure.md`
- Metadata model: `docs/metadata-model.md`
- Image workflow: `docs/image-workflow.md`
- Agentic strategy: `docs/agentic-strategy.md`
