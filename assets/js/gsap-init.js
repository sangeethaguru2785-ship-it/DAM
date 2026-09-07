/* GSAP custom & advanced animations for Stackly.
   Loaded after gsap.min.js + ScrollTrigger.min.js.
   GSAP handles choreographed load-time hero entrances and scroll-triggered
   micro-effects (image fades). AOS (aos-init.js) owns the scroll-based card,
   heading and text reveals, so the two never animate the same element.
   Refreshes both libraries on full load to keep measurements accurate. */
(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    document.documentElement.classList.add('gsap');
    gsap.registerPlugin(ScrollTrigger);

    var EASE = 'power3.out';
    var DURATION = 0.75;

    try {
        /* 1) Home hero entrance — choreographed load-time cascade */
        var heroGroup = gsap.utils.toArray('.hero-eyebrow, .hero h1, .hero p, .hero-buttons, .hero-stat, .hero-visual');
        if (heroGroup.length) {
            gsap.fromTo(heroGroup,
                { autoAlpha: 0, y: 28 },
                { autoAlpha: 1, y: 0, duration: DURATION, ease: EASE, stagger: 0.1, delay: 0.15 }
            );
        }

        /* 2) Inner page hero entrance — choreographed load-time cascade */
        var pageHeroGroup = gsap.utils.toArray('.page-crumb, .page-hero h1, .page-hero p, .page-hero-actions');
        if (pageHeroGroup.length) {
            gsap.fromTo(pageHeroGroup,
                { autoAlpha: 0, y: 26 },
                { autoAlpha: 1, y: 0, duration: DURATION, ease: EASE, stagger: 0.1, delay: 0.15 }
            );
        }

        /* 3) Smooth fade-in for every image not inside an AOS-revealed block
              (dashboards, standalone visuals). Opacity only, so existing CSS
              hover-zoom transforms on images are never touched. */
        gsap.utils.toArray('main img').forEach(function (img) {
            if (!img.getAttribute('src')) return;
            if (/logo\.(webp|png|jpg|svg)$/.test(img.getAttribute('src'))) return;
            if (img.closest('[data-aos], .anim, .hero, .page-hero, .au-visual, header, footer, nav, .mobile-nav, .dash-sidebar')) return;
            gsap.fromTo(img,
                { autoAlpha: 0 },
                {
                    autoAlpha: 1, duration: 0.9, ease: 'power2.out',
                    scrollTrigger: { trigger: img, start: 'top 96%', once: true }
                }
            );
        });

        window.addEventListener('load', function () {
            ScrollTrigger.refresh();
            if (window.AOS) window.AOS.refresh();
        });
    } catch (err) {
        /* Safety net: never leave hero content hidden if anything went wrong */
        document.documentElement.classList.remove('gsap');
        gsap.set('.hero-eyebrow, .hero h1, .hero p, .hero-buttons, .hero-stat, .hero-visual, .page-crumb, .page-hero h1, .page-hero p, .page-hero-actions',
            { clearProps: 'opacity,transform,visibility' });
    }
})();