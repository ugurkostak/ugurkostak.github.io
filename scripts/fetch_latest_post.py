import json
import os
import xml.etree.ElementTree as ET
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

OUT_DIR = "photography/out"


def strip_html(text: str) -> str:
    if not text:
        return ""
    return BeautifulSoup(text, "html.parser").get_text(" ", strip=True)


def first_image_from_html(html: str):
    if not html:
        return None
    soup = BeautifulSoup(html, "html.parser")
    img = soup.find("img")
    if img and img.get("src"):
        return img.get("src")
    return None


def get_text(elem, *names):
    for name in names:
        found = elem.find(name)
        if found is not None and found.text:
            return found.text.strip()
    return ""


def parse_feed(xml_text: str):
    root = ET.fromstring(xml_text)
    channel = root.find("channel")
    if channel is not None:
        items = channel.findall("item")
        if not items:
            raise ValueError("No RSS items found")
        item = items[0]
        title = get_text(item, "title")
        url = get_text(item, "link")
        published = get_text(item, "pubDate")
        summary_html = get_text(item, "description")
        image_url = None
        enclosure = item.find("enclosure")
        if enclosure is not None and enclosure.attrib.get("url"):
            image_url = enclosure.attrib.get("url")
        if not image_url:
            image_url = first_image_from_html(summary_html)
        return {
            "title": title,
            "url": url,
            "published": published,
            "summary": strip_html(summary_html),
            "image_url": image_url,
        }

    ns = {"a": "http://www.w3.org/2005/Atom"}
    entries = root.findall("a:entry", ns)
    if entries:
        entry = entries[0]
        title = get_text(entry, "{http://www.w3.org/2005/Atom}title")
        link = entry.find("a:link", ns)
        url = link.attrib.get("href") if link is not None else ""
        published = get_text(entry, "{http://www.w3.org/2005/Atom}published", "{http://www.w3.org/2005/Atom}updated")
        summary_elem = entry.find("a:summary", ns) or entry.find("a:content", ns)
        summary_html = summary_elem.text if summary_elem is not None and summary_elem.text else ""
        image_url = first_image_from_html(summary_html)
        return {
            "title": title,
            "url": url,
            "published": published,
            "summary": strip_html(summary_html),
            "image_url": image_url,
        }

    raise ValueError("Unsupported feed format")


def ensure_image_from_page(post):
    if post.get("image_url"):
        return post
    url = post.get("url")
    if not url:
        return post
    r = requests.get(url, timeout=20)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    og = soup.find("meta", property="og:image")
    if og and og.get("content"):
        post["image_url"] = urljoin(url, og["content"])
        return post
    first = soup.find("img")
    if first and first.get("src"):
        post["image_url"] = urljoin(url, first["src"])
    return post


def main():
    load_dotenv()
    feed_url = os.getenv("BLOG_FEED_URL")
    if not feed_url:
        raise SystemExit("BLOG_FEED_URL is required")
    os.makedirs(OUT_DIR, exist_ok=True)
    r = requests.get(feed_url, timeout=20)
    r.raise_for_status()
    post = parse_feed(r.text)
    post = ensure_image_from_page(post)
    if not post.get("image_url"):
        raise SystemExit("No image URL found in feed entry or source page")
    with open(os.path.join(OUT_DIR, "latest_post.json"), "w", encoding="utf-8") as f:
        json.dump(post, f, ensure_ascii=False, indent=2)
    print(json.dumps(post, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
