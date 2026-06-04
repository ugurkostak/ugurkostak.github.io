import json
import os
from pathlib import Path

import requests
from dotenv import load_dotenv

OUT_DIR = Path("photography/out")
GRAPH_BASE = "https://graph.facebook.com/v21.0"


def main():
    load_dotenv()
    OUT_DIR.mkdir(exist_ok=True)

    ig_user_id = os.getenv("IG_CREATOR_USER_ID")
    access_token = os.getenv("IG_ACCESS_TOKEN")
    if not ig_user_id or not access_token:
        raise SystemExit("IG_CREATOR_USER_ID and IG_ACCESS_TOKEN are required")

    draft = json.loads((OUT_DIR / "instagram_draft.json").read_text(encoding="utf-8"))

    creation_resp = requests.post(
        f"{GRAPH_BASE}/{ig_user_id}/media",
        data={
            "image_url": draft.get("image_url"),
            "caption": draft.get("caption"),
            "access_token": access_token,
        },
        timeout=30,
    )
    creation_resp.raise_for_status()
    creation_data = creation_resp.json()
    creation_id = creation_data.get("id")
    if not creation_id:
        raise SystemExit(f"Creation response missing id: {creation_data}")

    publish_resp = requests.post(
        f"{GRAPH_BASE}/{ig_user_id}/media_publish",
        data={
            "creation_id": creation_id,
            "access_token": access_token,
        },
        timeout=30,
    )
    publish_resp.raise_for_status()
    publish_data = publish_resp.json()

    result = {
        "status": "published",
        "creation": creation_data,
        "publish": publish_data,
    }
    (OUT_DIR / "publish_result.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
