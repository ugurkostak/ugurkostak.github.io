---
name: instagram-creator-blog-publisher
description: Fetch the latest blog post and publish it to an Instagram Creator account through the official Graph API.
tools: python
---

# Instagram Creator Blog Publisher Agent

A GitHub-ready automation scaffold for **Instagram Creator accounts**.

This agent fetches the latest post from your blog, creates an Instagram caption, and publishes it through the **official Instagram Graph API** for a **Creator account**.

## Scope

This version is intentionally **Creator-account only**:
- no personal-account fallback
- no manual-draft mode
- no business-mode branching

## Purpose

Turn the newest blog post into an Instagram post for a Creator account.

## Responsibilities

- Read the latest blog entry from the configured feed.
- Extract title, summary, URL, publication date, and image.
- Generate a concise Instagram caption.
- Publish the post through the official Instagram Graph API.
- Store logs and publish results in `photography/out/`.

## Guardrails

- This agent is **Creator-account only**.
- Stop if `IG_CREATOR_USER_ID` or `IG_ACCESS_TOKEN` is missing.
- Stop if no image can be derived from the feed entry or source page.
- Keep captions concise and grounded in the source content.
- Always include the canonical blog URL in the payload.

## Requirements

- Instagram account converted to **Creator**
- Meta developer app
- Instagram Graph API access
- Access token and Instagram user ID
- Recommended: Creator account linked to a Facebook Page for the Graph API flow

## Skills to use

- `fetch-latest-blog-post`
- `create-instagram-caption`
- `publish-instagram-creator-post`

## Workflow

1. Load environment variables.
2. Fetch the newest blog post.
3. Create the Instagram caption payload.
4. Publish the post to the Creator account.
5. Write artifacts to `photography/out/`.

## How it works

1. `fetch_latest_post.py` reads your RSS or Atom feed and extracts the newest post.
2. `generate_instagram_draft.py` creates an Instagram-ready caption and payload.
3. `publish_creator_post.py` publishes the image post through the Instagram Graph API.
4. GitHub Actions can run the pipeline manually or on a schedule.

## Environment variables

Copy `.env.example` to `.env` locally, or use the same values as GitHub repository secrets.

### Required secrets

- `BLOG_FEED_URL`
- `IG_CREATOR_USER_ID`
- `IG_ACCESS_TOKEN`
- `DEFAULT_HASHTAGS`
- `CTA_TEXT`

## Local run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r scripts/requirements.txt
python scripts/run_pipeline.py
```

## Output artifacts

- `photography/out/latest_post.json`
- `photography/out/instagram_draft.json`
- `photography/out/publish_result.json`

## Current limitations

- This scaffold currently publishes **single-image posts**.
- The source blog post should expose an image in the feed or in page metadata (`og:image` preferred).
- The Graph API publishing flow is used here because it is the official content-management path for Creator accounts.
