import json
import os
from dotenv import load_dotenv

OUT_DIR = "photography/out"


def compact(text: str, limit: int = 220) -> str:
    text = " ".join((text or "").split())
    if len(text) <= limit:
        return text
    return text[:limit - 1].rstrip() + "…"


def build_caption(post: dict, hashtags: str, cta: str) -> str:
    title = post.get("title", "New blog post")
    summary = compact(post.get("summary", ""), 180)
    url = post.get("url", "")
    lines = [
        title,
        "",
        summary,
        "",
        cta or "Read more on the blog. Link in bio.",
        url,
    ]
    if hashtags:
        lines += ["", hashtags]
    return "\n".join(lines)


def main():
    load_dotenv()
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(os.path.join(OUT_DIR, "latest_post.json"), "r", encoding="utf-8") as f:
        post = json.load(f)
    payload = {
        "title": post.get("title"),
        "url": post.get("url"),
        "published": post.get("published"),
        "image_url": post.get("image_url"),
        "summary": post.get("summary"),
        "caption": build_caption(
            post,
            os.getenv("DEFAULT_HASHTAGS", ""),
            os.getenv("CTA_TEXT", "Read more on the blog. Link in bio."),
        ),
    }
    with open(os.path.join(OUT_DIR, "instagram_draft.json"), "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
