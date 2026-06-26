# shazamme-widget-test

Proof of concept: host a Duda custom widget's **JS controller** outside Duda, in
a version-controlled git repo served via CDN, pinned per-site by version.

Only the JS is externalised. The Duda custom widget keeps:
- its **HTML template** (Handlebars, bound to the widget's settings panel), and
- its **CSS** (base + device variants, applied by Duda's responsive engine).

Duda injects `element`, `data`, `$`, `shazamme` into the widget's JS scope;
`widget.js` here is the full controller wrapped as
`window.ShazammeJobWidget({ element, data, $, shazamme })` so it receives them.

`_duda-source/widget.raw.js` is the pristine, unwrapped Duda source.

## Duda JS box — replace ALL the JS with this version-pinned loader

```js
(function () {
  var V = '0.2.0';
  var src = 'https://cdn.jsdelivr.net/gh/Shazamme-IO/shazamme-widget-test@v' + V + '/widget.js';
  function run() { window.ShazammeJobWidget({ element: element, data: data, $: $, shazamme: shazamme }); }
  if (window.ShazammeJobWidget) run();
  else { var s = document.createElement('script'); s.src = src; s.onload = run; document.head.appendChild(s); }
})();
```

Leave the widget's HTML and CSS boxes untouched.

## Ship a change (versioning + rollback)

```bash
# edit _duda-source/widget.raw.js, then re-wrap into widget.js, bump package.json
git commit -am "feat: change controller"
git tag v0.2.1 && git push --tags
```
- **Roll forward:** change `V = '0.2.0'` → `'0.2.1'` in the one Duda widget.
- **Roll back:** change it back. Old tags are immutable and still served.

## CDN URLs

```
https://cdn.jsdelivr.net/gh/Shazamme-IO/shazamme-widget-test@v0.2.0/widget.js   (prod CDN; ~5 min to index a new tag)
https://raw.githack.com/Shazamme-IO/shazamme-widget-test/v0.2.0/widget.js        (instant, good for first test)
```

Later, the same `@version` scheme moves to `sdk.shazamme.com` — the Duda side stays a pinned URL, so nothing about the approach changes.
