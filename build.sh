#!/bin/sh
# Packages the pages that are published together:
#   tutorial.html  main page (the tutorial)
#   lab.html       the full tool, linked from the last slide
# The source lab.html has no <html>/<head> (publishing adds them to the main page only),
# so here it is wrapped in a complete document, because it is a secondary page.
#
# Usage: ./build.sh [output folder]   (default: dist)
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
out="${1:-$here/dist}"
mkdir -p "$out"
cp "$here/tutorial.html" "$out/tutorial.html"
{
  printf '%s\n' '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'
  cat "$here/lab.html"
  printf '\n%s\n' '</body></html>'
} > "$out/lab.html"
echo "pages ready in $out"
