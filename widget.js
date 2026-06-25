/*!
 * Shazamme external widget — proof of concept.
 *
 * Stored in git, hosted on a CDN (jsDelivr for this test, sdk.shazamme.com
 * later), and linked from a single Duda HTML/Embed widget. The Duda site holds
 * only the loader snippet + a mount <div>; all real markup/behaviour lives here
 * and is pinned by version so a change to one site never touches another.
 *
 * Mounts into any element with [data-shazamme-widget].
 */
(function () {
  'use strict';

  var VERSION = '0.1.0'; // keep in sync with package.json + git tag

  function mount(el) {
    if (el.getAttribute('data-sz-mounted') === '1') return;
    el.setAttribute('data-sz-mounted', '1');

    var title = el.getAttribute('data-title') || 'External widget is live';
    var body =
      el.getAttribute('data-body') ||
      'This markup, styling and behaviour are served from an external repo via CDN — nothing here is stored in Duda except the loader snippet.';

    el.innerHTML =
      '<div class="sz-card">' +
      '  <div class="sz-card__badge">v' + VERSION + '</div>' +
      '  <h3 class="sz-card__title">' + title + '</h3>' +
      '  <p class="sz-card__body">' + body + '</p>' +
      '  <button class="sz-card__btn" type="button">Test interaction</button>' +
      '  <div class="sz-card__out" aria-live="polite"></div>' +
      '</div>';

    var btn = el.querySelector('.sz-card__btn');
    var out = el.querySelector('.sz-card__out');
    var clicks = 0;
    btn.addEventListener('click', function () {
      clicks += 1;
      out.textContent = 'JS from v' + VERSION + ' responding — clicks: ' + clicks;
    });
  }

  function init() {
    var nodes = document.querySelectorAll('[data-shazamme-widget]');
    for (var i = 0; i < nodes.length; i++) mount(nodes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ShazammeWidget = { version: VERSION, mount: mount, init: init };
})();
