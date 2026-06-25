# shazamme-widget-test

Proof of concept for storing a Duda widget's HTML/CSS/JS **outside** Duda, in a
version-controlled git repo, served via CDN and pinned per-site by version.

The Duda site holds only a mount `<div>` + a loader snippet. Everything real
(markup, styling, behaviour) lives here and is pinned to a git tag, so a change
to one site can never touch another.

## Embed in ONE Duda widget

Drop an **HTML / Embed** widget on the page and paste this (pin to a tag):

```html
<div data-shazamme-widget></div>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Shazamme-IO/shazamme-widget-test@v0.1.0/widget.css">
<script src="https://cdn.jsdelivr.net/gh/Shazamme-IO/shazamme-widget-test@v0.1.0/widget.js"></script>
```

The orange badge shows the loaded version — proof of which build is live.

## Ship a change (and prove versioning + rollback)

```bash
# edit widget.js / widget.css, bump VERSION in widget.js + package.json
git commit -am "feat: tweak widget"
git tag v0.1.1 && git push --tags
```

- **Roll forward:** change `@v0.1.0` → `@v0.1.1` in that one Duda widget.
- **Roll back:** change it back. The old tagged build is immutable and still served.
- No other site/widget moves unless you change its pinned tag.

## While iterating (before you pin a tag)

jsDelivr caches tagged URLs immutably. During authoring, point at a branch and
purge the cache to see changes fast:

```
https://cdn.jsdelivr.net/gh/Shazamme-IO/shazamme-widget-test@main/widget.js
# force-refresh the CDN copy after a push:
https://purge.jsdelivr.net/gh/Shazamme-IO/shazamme-widget-test@main/widget.js
```

Pin to a real tag (`@v0.1.0`) once you're happy — never ship `@main` to a live site.

## Later: same scheme on sdk.shazamme.com

This is identical to the production plan, just a different host. When ready,
swap the CDN domain for `sdk.shazamme.com/sdk/v0.1.0/...` — the Duda side stays
a pinned URL, so nothing about the approach changes.
