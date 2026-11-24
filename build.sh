#!/bin/sh
# Assembla le pagine da pubblicare insieme:
#   tutorial.html  pagina principale (il tutorial)
#   lab.html       il tool completo, collegato dall'ultima slide
# lab.html in sorgente non ha <html>/<head> (li aggiunge la pubblicazione della pagina
# principale): qui viene avvolto in un documento completo, perché è una pagina secondaria.
#
# Uso: ./build.sh [cartella di destinazione]   (predefinita: dist)
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
out="${1:-$here/dist}"
mkdir -p "$out"
cp "$here/tutorial.html" "$out/tutorial.html"
{
  printf '%s\n' '<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'
  cat "$here/lab.html"
  printf '\n%s\n' '</body></html>'
} > "$out/lab.html"
echo "pagine pronte in $out"
