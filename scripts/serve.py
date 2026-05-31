"""
Local Development Server

A thin wrapper around `python -m http.server` that silently handles
BrokenPipeError / ConnectionResetError. These are raised when the browser
closes a connection before the response finishes streaming (e.g. fast
reload, navigation, prefetch cancel). They are harmless but pollute the
console with long tracebacks when serving the site locally.

Usage:
    python scripts/serve.py            # serves repo root on port 8000
    python scripts/serve.py 8080       # custom port

Run from the repository root so relative asset paths resolve correctly.
"""

from __future__ import annotations

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class QuietHTTPRequestHandler(SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler that swallows client-disconnect errors."""

    def handle_one_request(self) -> None:
        try:
            super().handle_one_request()
        except (BrokenPipeError, ConnectionResetError):
            self.log_message("client disconnected: %s", self.address_string())

    def copyfile(self, source, outputfile) -> None:
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError):
            self.log_message("client disconnected mid-response: %s", self.address_string())


def main() -> int:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = partial(QuietHTTPRequestHandler, directory=".")
    with ThreadingHTTPServer(("", port), handler) as httpd:
        print(f"Serving repository root on http://localhost:{port} (Ctrl+C to stop)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
