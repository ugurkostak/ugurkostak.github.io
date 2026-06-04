import subprocess
import sys

SCRIPTS = [
    "scripts/fetch_latest_post.py",
    "scripts/generate_instagram_draft.py",
    "scripts/publish_creator_post.py",
]


def main():
    for script in SCRIPTS:
        print(f"\n>>> Running {script}")
        result = subprocess.run([sys.executable, script], check=False)
        if result.returncode != 0:
            raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()
