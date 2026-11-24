#!/bin/sh
# Packages the pages that are published together:
#   the tutorial, lab.html (the full tool) and glossary.html (one page per concept),
#   plus glossary-data.js, the concepts shared by the tutorial and the glossary.
#
# The source pages have no <html>/<head>: claude.ai adds them to the page it publishes.
#   ./build.sh [folder]          for claude.ai: tutorial.html as it is, the other pages wrapped in full documents
#   ./build.sh [folder] --site   for an ordinary web host such as GitHub Pages: index.html (the tutorial)
#                                and the other pages, all wrapped in full documents
# The default folder is dist. Wrapped pages set OFFKEY_BUNDLED, which shows the links back to the tutorial.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
out="${1:-$here/dist}"
mode="${2:-}"
mkdir -p "$out"

wrap() {
  printf '%s\n' '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style><script>window.OFFKEY_BUNDLED=true</script></head><body>'
  cat "$1"
  printf '\n%s\n' '</body></html>'
}

wrap "$here/lab.html" > "$out/lab.html"
wrap "$here/glossary.html" > "$out/glossary.html"
cp "$here/glossary-data.js" "$out/glossary-data.js"
if [ "$mode" = "--site" ]; then
  wrap "$here/tutorial.html" > "$out/index.html"
else
  cp "$here/tutorial.html" "$out/tutorial.html"
fi
echo "pages ready in $out"
