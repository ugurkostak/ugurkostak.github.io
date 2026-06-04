# Skill: Fetch Latest Blog Post

## Goal
Read the latest blog entry from an RSS or Atom feed and normalize it into JSON.

## Inputs
- `BLOG_FEED_URL`

## Outputs
- `photography/out/latest_post.json`

## Required fields
- `title`
- `url`
- `published`
- `summary`
- `image_url`

## Rules
- Prefer feed enclosure images when available.
- Fallback to the first image inside the entry summary/content.
- Fallback to `og:image` on the source page.
- Strip HTML from the summary.
- Fail clearly if the feed cannot be parsed.
