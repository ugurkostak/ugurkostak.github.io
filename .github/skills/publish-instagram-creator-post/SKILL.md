# Skill: Publish Instagram Creator Post

## Goal
Publish a prepared blog-derived post to an Instagram Creator account using the official Graph API.

## Inputs
- `photography/out/instagram_draft.json`
- `IG_CREATOR_USER_ID`
- `IG_ACCESS_TOKEN`

## Outputs
- `photography/out/publish_result.json`

## Rules
- Require both `IG_CREATOR_USER_ID` and `IG_ACCESS_TOKEN`.
- Publish by first creating a media container, then publishing it.
- Fail safely with actionable error messages.
