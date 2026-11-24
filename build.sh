#!/bin/sh
# Packages the two pages, the tutorial and the full tool (lab.html, linked from the last slide).
#
# The source pages have no <html>/<head>: claude.ai adds them to the page it publishes.
#   ./build.sh [folder]          for claude.ai: tutorial.html as it is, lab.html wrapped in a full document
#   ./build.sh [folder] --site   for an ordinary web host such as GitHub Pages: index.html (the tutorial)
#                                and lab.html, both wrapped in full documents
# The default folder is dist.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
out="${1:-$here/dist}"
mode="${2:-}"
mkdir -p "$out"

wrap() {
  printf '%s\n' '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'
  cat "$1"
  printf '\n%s\n' '</body></html>'
}

wrap "$here/lab.html" > "$out/lab.html"
if [ "$mode" = "--site" ]; then
  wrap "$here/tutorial.html" > "$out/index.html"
else
  cp "$here/tutorial.html" "$out/tutorial.html"
fi
echo "pages ready in $out"
