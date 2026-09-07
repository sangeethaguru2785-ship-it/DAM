/* AOS (Animate On Scroll) bootstrap for Stackly.
   Loaded after aos.js. Assigns data-aos attributes to the site's animated
   blocks (.anim, section heads, content blocks, grids) so AOS drives all
   scroll-based reveals, while GSAP (gsap-init.js) handles the load-time hero
   entrances and advanced micro-effects. The two never animate the same
   element, preventing overlapping motion.
   Honors prefers-reduced-motion: nothing is hidden or animated there. */
(function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof AOS === 'undefined') return;

    var covered = new Set();

    function fade(el, delay) {
        if (!el || el.hasAttribute('data-aos')) return;
        el.setAttribute('data-aos', 'fade-up');
        if (delay) el.setAttribute('data-aos-delay', delay);
    }

    /* 1) Section heads: icon, then title, then subtitle cascade */
    document.querySelectorAll('.section-head').forEach(function (sh) {
        covered.add(sh);
        var icon = sh.querySelector(':scope > .section-icon');
        var h2 = sh.querySelector(':scope > h2');
        var p = sh.querySelector(':scope > p');
        var i = 0;
        [icon, h2, p].forEach(function (el) { if (el) fade(el, i++ * 90); });
    });

    /* 2) Long-form content blocks: children cascade (label, heading,
          paragraph, list, stats) */
    document.querySelectorAll('.why-content, .showcase-body').forEach(function (wc) {
        covered.add(wc);
        Array.prototype.slice.call(wc.children, 0, 6)
            .forEach(function (child, i) { fade(child, i * 90); });
    });

    /* 3) Grids/rows: sibling .anim cards stagger in one after another */
    var parents = new Set();
    document.querySelectorAll('.anim').forEach(function (el) {
        if (el.parentElement) parents.add(el.parentElement);
    });
    parents.forEach(function (parent) {
        var kids = Array.prototype.filter.call(parent.children, function (c) {
            return c.classList && c.classList.contains('anim') && !covered.has(c);
        });
        kids.forEach(function (card, i) {
            covered.add(card);
            fade(card, i * 70);
        });
    });

    /* 4) Any remaining .anim blocks (media, lone cards, quote/book blocks) */
    document.querySelectorAll('.anim').forEach(function (el) {
        if (covered.has(el)) return;
        covered.add(el);
        fade(el);
    });

    /* 5) Standalone CTA/chip/tab groups that were never .anim */
    document.querySelectorAll('.cta-buttons, .role-chips, .formats-row, .integrations-row, .lib-tabs, .lib-bar-inner').forEach(function (el) {
        if (covered.has(el) || el.hasAttribute('data-aos')) return;
        covered.add(el);
        fade(el, 60);
    });

    /* 6) Footer: columns fade up one after another, then the bottom bar */
    Array.prototype.slice.call(document.querySelectorAll('.footer-grid > *')).forEach(function (col, i) {
        covered.add(col);
        fade(col, i * 80);
    });
    Array.prototype.slice.call(document.querySelectorAll('.footer-bottom')).forEach(function (el) {
        covered.add(el);
        fade(el, 200);
    });

    AOS.init({
        duration: 750,
        easing: 'ease-out-cubic',
        once: true,
        offset: 70
    });
})();