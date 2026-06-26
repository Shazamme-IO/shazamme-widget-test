#!/usr/bin/env bash
# Wrap the pristine Duda controller (_duda-source/widget.raw.js) into the
# externally-hosted widget.js: inject our fixes.css as a scoped runtime <style>,
# then expose the controller as window.ShazammeJobWidget({element,data,$,shazamme}).
set -euo pipefail
cd "$(dirname "$0")"

CSS_JSON="$(node -e 'process.stdout.write(JSON.stringify(require("fs").readFileSync("fixes.css","utf8")))')"

{
  printf 'window.ShazammeJobWidget = function ({ element, data, $, shazamme }) {\n'
  printf '  (function(){var id="shm-ext-fix";if(!document.getElementById(id)){var s=document.createElement("style");s.id=id;s.textContent=%s;document.head.appendChild(s);}})();\n' "$CSS_JSON"
  cat _duda-source/widget.raw.js
  printf '\n};\n'
} > widget.js

node --check widget.js && echo "built widget.js OK ($(wc -l < widget.js) lines)"
