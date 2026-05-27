# Documentation Overview

This document provides a quick map of all documentation for the ugurkostak.github.io project.

## Quick Navigation

### For Developers Adding Content

- **Adding a new page?** → Read `docs/site-structure.md` + use `.github/skills/add-new-page/SKILL.md`
- **Adding a blog article?** → Use `.github/skills/add-blog-item-metadata/SKILL.md`
- **Adding soft-skills content?** → Use `.github/skills/soft-skills-content/SKILL.md`
- **Resizing images?** → Use `.github/skills/process-images/SKILL.md`
- **Changing navigation?** → Use `.github/skills/update-navigation/SKILL.md`

### For Web Developers

- **Understanding the architecture?** → Read `docs/architecture.md`
- **Site structure and asset organization?** → Read `docs/site-structure.md`
- **How to implement new features?** → Read `docs/architecture.md` + check `.github/instructions/javascript.instructions.md`
- **Mobile sidebar and navigation?** → Check `.github/agents/web-dev-agent.md` and `assets/js/sidebar.js`
- **Adding interactive components?** → See `.github/skills/timeline-filter-skill/SKILL.md` as example

### For Content Editors

- **Adding/updating article text?** → Use `.github/skills/content-editing/SKILL.md`
- **Soft-skills tone and placement?** → Use `.github/skills/soft-skills-content/SKILL.md`
- **Metadata structure and guidelines?** → Read `docs/metadata-model.md`
- **Tags, categories, and featured items?** → Read `docs/metadata-model.md`

### For Project Managers/AI Agents

- **Understanding the agentic setup?** → Read `docs/agentic-strategy.md`
- **Agent responsibilities?** → Read `.github/agents/web-dev-agent.md` and `.github/agents/content-editor-agent.md`
- **All available skills?** → Read `docs/skills-guide.md`
- **File-specific instructions?** → Read `docs/instructions-guide.md`

---

## Documentation Structure

### Root Level

```
README.md              # Project overview, quick start, setup
AGENTS.md              # Project structure, agent rules, validation checklist
```

### Core Documentation (`docs/`)

#### Overview & Strategy
- **agentic-strategy.md** — How instructions, skills, and agents are organized
- **architecture.md** — Architectural decisions, constraints, modular design
- **site-structure.md** — Physical file layout, folder organization, asset placement

#### Specialized Guides
- **style-guide.md** — Design language, colors, typography, responsive breakpoints
- **metadata-model.md** — Metadata JSON structure, field guidance, validation rules
- **image-workflow.md** — Image optimization, folder structure, resizing script

#### New Reference Documents
- **skills-guide.md** — Complete overview of all available skills
- **instructions-guide.md** — Complete overview of all file-type instructions
- **documentation-overview.md** — This file; navigation for all docs

#### Agent Personas (`.github/agents/`)
- **web-dev-agent.md** — Responsibilities for HTML, JS, CSS, structure, navigation
- **content-editor-agent.md** — Responsibilities for text, metadata, UX copy, voice

### Instructions (`.github/instructions/`)

Path-specific rules automatically applied by GitHub Copilot:

```
html.instructions.md              # HTML page structure, skeleton, paths
javascript.instructions.md        # JavaScript modules, vanilla JS, organization
css-assets.instructions.md        # Asset organization, vendor libraries, image handling
metadata.instructions.md          # JSON structure, field consistency, validation
python-scripts.instructions.md    # Script guidelines, shape_images.py documentation
```

### Skills (`.github/skills/*/SKILL.md`)

Repeatable workflows for common tasks:

```
add-new-page/                      # Creating new HTML pages
update-navigation/                 # Changing sidebar links
add-blog-item-metadata/           # Adding metadata entries
process-images/                   # Resizing and optimizing images
content-editing/                  # Updating article text and metadata
static-site-review/               # Validation before deployment
soft-skills-content/              # Soft-skills and professional-growth writing
timeline-filter-skill/            # Adding year-based filtering to collections
```

---

## Current Project Structure

### Main Pages (Root Level)
- `index.html` — Homepage
- `about.html` — About
- `algorithmic-art.html` — Interactive visualizations (NEW)
- `cinema.html` — Film reviews collection
- `photography.html` — Photo gallery
- `tech-blog.html` — Technology writing
- `contact.html` — Contact

### Collection Sections
- `algorithmic-art/` — 3D cube, prime visualization (NEW)
- `cinema/` — Film reviews
- `tech-blog/` — Articles
- `photography/` — Photo stories
- Soft-skills/professional-growth writing uses `tech-blog/` by default unless a dedicated section is explicitly requested

### Assets
- `assets/js/sidebar.js` — Navigation and layout (mobile toggle, pointer/touch/click handling)
- `assets/js/blog.js` — Collection page rendering
- `assets/js/timeline-filter.js` — Year-based filtering
- `assets/js/algorithmic-art/` — Visualizations (cube, primes), vendor libraries (Three.js)
- `assets/css/` — Stylesheets
- `assets/images/<section>/` — Organized by section

### Utilities
- `scripts/shape_images.py` — Image resizing and optimization

---

## Key Recent Changes

The following changes have been documented in version 2026-05-26:

1. **Algorithmic Art Section Added**
   - New collection: `algorithmic-art/` with 3D cube and prime visualizations
   - New root page: `algorithmic-art.html`
   - New navigation entry in `assets/js/sidebar.js`

2. **Asset Organization Refined**
   - Section-specific JavaScript modules in `assets/js/<section>/`
   - Vendor libraries in `assets/js/<section>/vendor/` (Three.js for algorithmic-art)
   - Image folder `assets/images/algorithmic-art/` for visualizations

3. **Mobile Sidebar Improvements**
   - Robust toggle handling with pointer/touch/click events
   - Proper ARIA state management
   - Support for multiple navbar-toggle buttons

4. **Timeline Filter Component**
   - New interactive skill for year-based filtering
   - Year-filter buttons, smooth scrolling, responsive design
   - Applicable to cinema, photography, and other timeline collections

5. **Documentation Expanded**
   - Skills guide: `docs/skills-guide.md`
   - Instructions guide: `docs/instructions-guide.md`
   - This overview: `docs/documentation-overview.md`

6. **Soft Skills Content Workflow Added**
   - New skill: `.github/skills/soft-skills-content/SKILL.md`
   - Soft-skills/professional-growth writing belongs in `tech-blog/` by default

---

## Using This Documentation

### For Quick Answers
1. Check the section title above that matches your role (Developer, Content Editor, Agent, etc.)
2. Follow the suggested starting document
3. Cross-reference related files as needed

### For Comprehensive Understanding
1. Start with `AGENTS.md` (project overview and structure)
2. Read `docs/agentic-strategy.md` (how guidance is organized)
3. Read `docs/architecture.md` (design decisions)
4. Read specific specialized guides as needed

### For Implementing a Feature
1. Read `docs/architecture.md` to understand design patterns
2. Find relevant `.github/skills/*.md` if it's a common task
3. Consult `.github/instructions/<filetype>.instructions.md` for specifics
4. Reference `docs/site-structure.md` for file placement
5. Use `.github/agents/web-dev-agent.md` checklist before finishing

---

## Documentation Maintenance

**When to update documentation:**
- After adding a new section or collection type
- After major structural changes
- After creating repeatable workflows (new skills)
- After discovering project-wide rules or patterns
- When technology stack or constraints change

**Where to update:**
- Root level changes → Update `README.md` and `AGENTS.md`
- Architecture changes → Update `docs/architecture.md`
- New task workflows → Create new `.github/skills/<task>/SKILL.md`
- New rules → Create/update `.github/instructions/<type>.instructions.md`
- New reference docs → Add to `docs/` directory

---

## Files at a Glance

### High-Level Project Docs
| File | Purpose |
|------|---------|
| `README.md` | Quick start, feature overview, project structure |
| `AGENTS.md` | Agent rules, responsibilities, validation checklist |

### Strategy & Design
| File | Purpose |
|------|---------|
| `docs/agentic-strategy.md` | How instructions, skills, agents are organized |
| `docs/architecture.md` | Design decisions, constraints, modular approach |
| `docs/style-guide.md` | Design language, colors, typography, breakpoints |

### Structure & Organization
| File | Purpose |
|------|---------|
| `docs/site-structure.md` | File layout, folder org, asset placement, current tree |
| `docs/metadata-model.md` | JSON structure, fields, validation, section variations |
| `docs/image-workflow.md` | Image optimization, resizing, folder structure |

### Workflows & Tasks
| File | Purpose |
|------|---------|
| `docs/skills-guide.md` | All available skills, combining skills, best practices |
| `docs/instructions-guide.md` | File-type rules, instruction priority, examples |

### Always-On Guidance
| File | Purpose |
|------|---------|
| `.github/copilot-instructions.md` | Core rules applied to all development |
| `.github/instructions/*.md` | Path-specific rules for different file types |

### Agent Personas
| File | Purpose |
|------|---------|
| `.github/agents/web-dev-agent.md` | Tech structure, navigation, assets, JS, metadata |
| `.github/agents/content-editor-agent.md` | Text, titles, summaries, metadata content, voice |

### Repeatable Workflows
| File | Purpose |
|------|---------|
| `.github/skills/add-new-page/SKILL.md` | Create new HTML page with proper structure |
| `.github/skills/update-navigation/SKILL.md` | Update sidebar links and active states |
| `.github/skills/add-blog-item-metadata/SKILL.md` | Add article to collection metadata |
| `.github/skills/process-images/SKILL.md` | Resize and optimize images |
| `.github/skills/content-editing/SKILL.md` | Update article text and metadata content |
| `.github/skills/static-site-review/SKILL.md` | Validate changes before deployment |
| `.github/skills/soft-skills-content/SKILL.md` | Create or improve soft-skills/professional-growth content |
| `.github/skills/timeline-filter-skill/SKILL.md` | Add year-based filtering to collections |

---

## Support & Questions

For questions about:
- **Project structure** — See `AGENTS.md` and `docs/site-structure.md`
- **How to do X** — Search `docs/skills-guide.md` for relevant skill
- **File type rules** — Check `.github/instructions/<type>.instructions.md`
- **Agent responsibilities** — Read `.github/agents/<agent>.md`
- **Architecture & constraints** — Read `docs/architecture.md`
- **Agentic setup** — Read `docs/agentic-strategy.md`

For adding new:
- **Section/collection** — Use `add-new-page` skill + `add-blog-item-metadata` skill
- **Feature/workflow** — Create new `.github/skills/<task>/SKILL.md`
- **File-type rules** — Create new `.github/instructions/<type>.instructions.md`
- **Documentation** — Add file to `docs/` directory
