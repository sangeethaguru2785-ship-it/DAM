(function () {
    document.documentElement.classList.add('js');
    var hamburger = document.querySelector('.hamburger');
    var mobileNav = document.getElementById('mobileNav');
    var navBar = document.querySelector('.site-nav');

    function closeMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('open');
        document.body.classList.remove('nav-open');
    }

    if (hamburger && mobileNav && navBar) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = mobileNav.classList.contains('open');
            if (!isOpen) {
                mobileNav.style.top = navBar.getBoundingClientRect().bottom + 'px';
            }
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });

        mobileNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', function (e) {
            if (!mobileNav.classList.contains('open')) return;
            if (navBar.contains(e.target)) return;
            closeMenu();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' || e.key === 'Esc') closeMenu();
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 1024) closeMenu();
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - 120,
                    behavior: 'smooth'
                });
            }
        });
    });

    var animEls = document.querySelectorAll('.anim');
    var animObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                if (entry.target.hasAttribute('data-aos')) {
                    animObserver.unobserve(entry.target);
                    return;
                }
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    animEls.forEach(function (el) { animObserver.observe(el); });

    var revealEls = document.querySelectorAll('.feature-card, .story-card, .team-card, .blog-card, .faq-item, .why-content, .why-media, .quote-section .container, .book-inner, .section-head');

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                if (entry.target.hasAttribute('data-aos')) {
                    revealObserver.unobserve(entry.target);
                    return;
                }
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el, i) {
        el.style.transitionDelay = (i % 3) * 0.07 + 's';
        revealObserver.observe(el);
    });

    var counters = document.querySelectorAll('.count');
    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.dataset.count, 10) || 0;
                var duration = 1800;
                var start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    var progress = Math.min((timestamp - start) / duration, 1);
                    el.textContent = Math.floor(progress * target);
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        el.textContent = target;
                    }
                }

                requestAnimationFrame(step);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(function (el) {
        counterObserver.observe(el);
    });

    var slides = document.querySelectorAll('.testimonial-slide');
    var dotsWrap = document.querySelector('.slider-dots');
    var currentSlide = 0;
    var autoTimer;

    if (slides.length && dotsWrap) {
        slides.forEach(function (_, i) {
            var dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function () {
                goToSlide(i);
                restartAuto();
            });
            dotsWrap.appendChild(dot);
        });
    }

    var dots = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function restartAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(nextSlide, 6000);
    }

    var nextBtn = document.querySelector('.slider-btn.next');
    var prevBtn = document.querySelector('.slider-btn.prev');

    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); restartAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); restartAuto(); });

    if (slides.length > 1) restartAuto();

    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-q');
        var answer = item.querySelector('.faq-a');

        question.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');

            faqItems.forEach(function (other) {
                other.classList.remove('open');
                other.querySelector('.faq-a').style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    var filterBtns = document.querySelectorAll('.filter-btn');
    var storyCards = document.querySelectorAll('.story-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.dataset.filter;

            storyCards.forEach(function (card) {
                var match = filter === 'all' || card.dataset.category === filter;
                if (match) {
                    card.classList.remove('hide');
                    card.style.animation = 'fadeInUp 0.5s ease both';
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    /* ── Sticky header: shadow + active nav highlighting ───────── */

    var siteNav = document.querySelector('.site-nav');
    var currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var spyLinks = [];

    function setActiveNav() {
        var hash = (location.hash || '').replace('#', '').toLowerCase();
        document.querySelectorAll('.nav-menu a, .mobile-nav a').forEach(function (link) {
            var href = (link.getAttribute('href') || '').toLowerCase();
            var isActive = href === currentPage ||
                (hash && href === '#' + hash) ||
                (hash && href === currentPage + '#' + hash);
            link.classList.toggle('active', isActive && !link.classList.contains('mobile-nav-cta'));
        });
    }

    function initScrollSpy() {
        spyLinks = [];
        document.querySelectorAll('.nav-menu a[href^="#"], .mobile-nav a[href^="#"]').forEach(function (link) {
            var href = link.getAttribute('href');
            var target = document.querySelector(href);
            if (target) spyLinks.push({ link: link, target: target, top: 0 });
        });
    }

    function updateScrollSpy() {
        if (!spyLinks.length) return;
        var pos = window.scrollY + 140;
        var current = null;
        spyLinks.forEach(function (item) {
            var top = item.target.getBoundingClientRect().top + window.scrollY;
            if (pos >= top && (current === null || top > current.top)) {
                current = { link: item.link, top: top };
            }
        });
        spyLinks.forEach(function (item) {
            item.link.classList.toggle('active', !!(current && current.link === item.link));
        });
    }

    function onScroll() {
        if (siteNav) {
            if (window.scrollY > 60) {
                siteNav.style.boxShadow = '0 6px 26px rgba(0,0,0,0.35)';
                siteNav.classList.add('scrolled');
            } else {
                siteNav.style.boxShadow = 'none';
                siteNav.classList.remove('scrolled');
            }
        }
        updateScrollSpy();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', setActiveNav);
    initScrollSpy();
    setActiveNav();
    onScroll();

    var bookForm = document.getElementById('bookForm');

    if (bookForm) {
        bookForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var success = bookForm.querySelector('.form-success');
            if (success) {
                success.classList.add('show');
                bookForm.querySelector('.form-submit').disabled = true;
                bookForm.querySelector('.form-submit').style.opacity = '0.6';
                bookForm.reset();
            }
        });
    }

    /* â”€â”€ Asset Library â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

    var assetSearch = document.getElementById('assetSearch');
    var typeFilter = document.getElementById('typeFilter');
    var sortSelect = document.getElementById('sortSelect');
    var assetGrid = document.getElementById('assetGrid');
    var libTabs = document.querySelectorAll('.lib-tab');
    var viewToggleBtns = document.querySelectorAll('.view-toggle button');
    var emptyState = document.getElementById('emptyState');
    var countAll = document.getElementById('countAll');

    var libAssets = assetGrid ? Array.from(assetGrid.querySelectorAll('.asset-card.app')) : [];
    var currentLibType = 'all';

    function updateAssetCount() {
        var visible = libAssets.filter(function (a) { return a.style.display !== 'none'; });
        if (countAll) countAll.textContent = '(' + visible.length + ')';
    }

    if (countAll) updateAssetCount();

    function filterLib() {
        var q = assetSearch ? assetSearch.value.toLowerCase() : '';
        var type = currentLibType;
        var filterType = typeFilter ? typeFilter.value : 'all';
        var effectiveType = type !== 'all' ? type : filterType;

        libAssets.forEach(function (card) {
            var cardType = card.dataset.type || '';
            var tags = (card.dataset.tags || '') + ' ' + (card.dataset.name || '');
            var typeMatch = effectiveType === 'all' || cardType === effectiveType;
            var searchMatch = !q || tags.toLowerCase().indexOf(q) !== -1;
            card.style.display = (typeMatch && searchMatch) ? '' : 'none';
        });

        if (emptyState) {
            var visibleCount = libAssets.filter(function (a) { return a.style.display !== 'none'; }).length;
            emptyState.classList.toggle('show', visibleCount === 0);
        }
        updateAssetCount();
    }

    if (assetSearch) assetSearch.addEventListener('input', filterLib);
    if (typeFilter) typeFilter.addEventListener('change', filterLib);

    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            var val = sortSelect.value;
            libAssets.sort(function (a, b) {
                if (val === 'recent') return new Date(b.dataset.date) - new Date(a.dataset.date);
                if (val === 'oldest') return new Date(a.dataset.date) - new Date(b.dataset.date);
                if (val === 'name') return (a.dataset.name || '').localeCompare(b.dataset.name || '');
                if (val === 'size') return parseInt(b.dataset.size) - parseInt(a.dataset.size);
                return 0;
            });
            libAssets.forEach(function (card) { assetGrid.appendChild(card); });
        });
    }

    libTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            libTabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            currentLibType = tab.dataset.type;
            filterLib();
        });
    });

    if (viewToggleBtns.length) {
        viewToggleBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                viewToggleBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                if (assetGrid) {
                    assetGrid.classList.toggle('list-view', btn.dataset.view === 'list');
                }
            });
        });
    }

    var favBtns = document.querySelectorAll('.asset-fav');
    favBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            btn.classList.toggle('faved');
            var icon = btn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-regular');
                icon.classList.toggle('fa-solid');
            }
        });
    });

    var lightbox = document.getElementById('lightbox');
    var lbImage = document.getElementById('lbImage');
    var lbName = document.getElementById('lbName');
    var lbMeta = document.getElementById('lbMeta');
    var lbClose = document.getElementById('lbClose');
    var lbPrev = document.getElementById('lbPrev');
    var lbNext = document.getElementById('lbNext');
    var lbIndex = 0;

    function openLightbox(idx) {
        var visible = libAssets.filter(function (a) { return a.style.display !== 'none'; });
        if (!visible.length) return;
        lbIndex = idx;
        var card = visible[lbIndex];
        var thumb = card.querySelector('.asset-thumb');
        if (lbImage && thumb) lbImage.src = thumb.dataset.full || thumb.querySelector('img').src;
        if (lbName) lbName.textContent = card.dataset.name || '';
        if (lbMeta) lbMeta.textContent = card.dataset.type + ' Â· ' + card.querySelector('.asset-tags').textContent.trim();
        if (lightbox) lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function navLightbox(dir) {
        var visible = libAssets.filter(function (a) { return a.style.display !== 'none'; });
        if (!visible.length) return;
        lbIndex = (lbIndex + dir + visible.length) % visible.length;
        openLightbox(lbIndex);
    }

    if (lightbox) {
        lbClose.addEventListener('click', closeLightbox);
        lbPrev.addEventListener('click', function () { navLightbox(-1); });
        lbNext.addEventListener('click', function () { navLightbox(1); });
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (!lightbox || !lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navLightbox(-1);
        if (e.key === 'ArrowRight') navLightbox(1);
    });

    libAssets.forEach(function (card, i) {
        card.querySelectorAll('[data-action]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                window.location.href = '404.html';
            });
        });
        var thumb = card.querySelector('.asset-thumb');
        if (thumb) {
            thumb.addEventListener('click', function () {
                var visible = libAssets.filter(function (a) { return a.style.display !== 'none'; });
                var visIdx = visible.indexOf(card);
                openLightbox(visIdx !== -1 ? visIdx : i);
            });
        }
    });

    /* â”€â”€ Analytics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

    var analyticsBarData = {
        7:   { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], bars: [[42, 65], [55, 72], [48, 68], [63, 81], [71, 89], [38, 52], [46, 70]] },
        30:  { labels: ['W1', 'W2', 'W3', 'W4', 'W5'], bars: [[52, 71], [58, 76], [64, 82], [70, 88], [66, 79]] },
        90:  { labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'], bars: [[48, 66], [55, 71], [61, 77], [66, 83], [72, 88], [68, 84], [75, 90]] },
        365: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], bars: [[58, 84], [70, 90], [62, 78], [88, 95], [54, 72], [80, 88], [74, 86], [92, 99], [66, 85], [78, 91], [60, 80], [84, 93]] }
    };

    var analyticsDonutColors = ['var(--gold)', '#B9973A', '#E8DEBE', '#E0BF5C', 'var(--line)'];

    var analyticsDonutData = {
        7:   { slices: [42, 27, 16, 10, 5], total: '18K' },
        30:  { slices: [44, 25, 17, 9, 5], total: '62K' },
        90:  { slices: [45, 26, 16, 8, 5], total: '96K' },
        365: { slices: [46, 24, 17, 9, 4], total: '128K' }
    };

    function updateAnalytics(range) {
        var barChart = document.getElementById('barChart');
        if (barChart && analyticsBarData[range]) {
            var bd = analyticsBarData[range];
            var html = '';
            bd.bars.forEach(function (pair, i) {
                html += '<div class="bar-col" data-bars="' + pair[0] + ',' + pair[1] + '">'
                    + '<div class="bar b1" style="--h:' + pair[0] + '%" data-val="' + pair[0] + 'K downloads"></div>'
                    + '<div class="bar b2" style="--h:' + pair[1] + '%" data-val="' + pair[1] + 'K views"></div>'
                    + '<span class="bar-label">' + bd.labels[i] + '</span>'
                    + '</div>';
            });
            barChart.innerHTML = html;
        }

        if (analyticsDonutData[range]) {
            var dd = analyticsDonutData[range];
            var donutBox = document.querySelector('.chart-card .donut');
            var donutCenter = document.querySelector('.donut-center strong');
            var legendVals = document.querySelectorAll('.chart-card .legend li strong');

            if (donutBox) {
                var cum = 0;
                var stops = [];
                dd.slices.forEach(function (p, i) {
                    stops.push(analyticsDonutColors[i] + ' ' + cum + '% ' + (cum + p) + '%');
                    cum += p;
                });
                donutBox.style.background = 'conic-gradient(' + stops.join(', ') + ')';
            }
            if (donutCenter) donutCenter.textContent = dd.total;
            if (legendVals) {
                legendVals.forEach(function (el, i) {
                    if (dd.slices[i] !== undefined) el.textContent = dd.slices[i] + '%';
                });
            }
        }
    }

    var rangeTabs = document.querySelectorAll('.range-tab');
    rangeTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            rangeTabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            updateAnalytics(tab.getAttribute('data-range'));
        });
    });

    var activeRange = document.querySelector('.range-tab.active');
    if (activeRange) updateAnalytics(activeRange.getAttribute('data-range'));

    /* â”€â”€ Users: member search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

    var memberSearch = document.getElementById('memberSearch');
    var memberRows = document.querySelectorAll('.member-row:not(.member-head)');
    var memberEmpty = document.getElementById('memberEmpty');

    if (memberSearch) {
        memberSearch.addEventListener('input', function () {
            var q = memberSearch.value.toLowerCase();
            var visible = 0;
            memberRows.forEach(function (row) {
                var name = (row.dataset.name || '').toLowerCase();
                var match = !q || name.indexOf(q) !== -1;
                row.style.display = match ? '' : 'none';
                if (match) visible++;
            });
            if (memberEmpty) {
                memberEmpty.classList.toggle('show', visible === 0);
            }
        });
    }

    

    /* â”€â”€ Contact form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

    var contactForm = document.getElementById('contactForm');
    var contactSuccess = document.getElementById('contactSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var contactNameField = document.getElementById('contactName');
            if (contactNameField && !/^[A-Za-z\s]+$/.test(contactNameField.value.trim())) return;
            var contactEmailField = document.getElementById('contactEmail');
            if (contactEmailField && !/^[A-Za-z0-9@.]+$/.test(contactEmailField.value)) return;
            if (contactSuccess) contactSuccess.classList.add('show');
            contactForm.reset();
            setTimeout(function () {
                if (contactSuccess) contactSuccess.classList.remove('show');
            }, 5000);
        });
    }

    /* â”€â”€ Upload button placeholder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

    var uploadBtns = document.querySelectorAll('#uploadBtn, #uploadBtn2, .upload-trigger');
    uploadBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            window.location.href = '404.html';
        });
    });

    document.querySelectorAll('.cat-meta .fa-arrow-right').forEach(function (arrow) {
        arrow.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '404.html';
        });
    });

    document.querySelectorAll('.trend-card img').forEach(function (img) {
        img.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '404.html';
        });
    });

    document.querySelectorAll('.collection-card img').forEach(function (img) {
        img.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '404.html';
        });
    });

    document.querySelectorAll('.co-arrow').forEach(function (arrow) {
        arrow.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '404.html';
        });
    });

    var newCollectionBtns = document.querySelectorAll('#newCollectionBtn, #createCollectionBtn');
    newCollectionBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            window.location.href = '404.html';
        });
    });

    var exportBtns = document.querySelectorAll('#exportBtn');
    exportBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            window.location.href = '404.html';
        });
    });

    /* â”€â”€ Premium newsletter section (above footer) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

    var ncBlocks = document.querySelectorAll('.newsletter-cta-inner');
    var ncObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                ncObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    ncBlocks.forEach(function (el) { ncObserver.observe(el); });

    document.querySelectorAll('.newsletter-cta-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var ncEmail = form.querySelector('input[type="email"]');
            if (ncEmail && !/^[A-Za-z0-9@.]+$/.test(ncEmail.value)) return;
            var success = form.parentElement.querySelector('.newsletter-cta-success');
            if (success) success.classList.add('show');
            form.reset();
            var submit = form.querySelector('.nc-btn');
            if (submit) {
                submit.disabled = true;
                submit.style.opacity = '0.65';
            }
            setTimeout(function () {
                if (success) success.classList.remove('show');
                if (submit) {
                    submit.disabled = false;
                    submit.style.opacity = '';
                }
            }, 5000);
        });
    });

    /* Email fields accept only A-Z, a-z, 0-9, @ and . — reject spaces & other specials */
    document.addEventListener('input', function (e) {
        if (e.target && e.target.type === 'email') {
            var clean = e.target.value.replace(/[^A-Za-z0-9@.]/g, '');
            if (clean !== e.target.value) e.target.value = clean;
        }
    }, true);

    /* Home page: transparent header → solid on scroll */
    var heroNavPage = !!document.querySelector('.hero');
    if (heroNavPage && navBar) {
        function updateNavState() {
            if (window.scrollY > 8) {
                navBar.classList.add('is-scrolled');
            } else {
                navBar.classList.remove('is-scrolled');
            }
        }
        window.addEventListener('scroll', updateNavState, { passive: true });
        updateNavState();
    }

    /* Subtitles: subtle fade/slide-up on viewport entry */
    var subtitleEls = document.querySelectorAll('.section-head > p, .page-hero p, .hero p');
    if (subtitleEls.length) {
        if ('IntersectionObserver' in window) {
            var subtitleObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (entry.target.hasAttribute('data-aos')) {
                            subtitleObserver.unobserve(entry.target);
                            return;
                        }
                        entry.target.classList.add('sub-visible');
                        subtitleObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
            subtitleEls.forEach(function (el) { subtitleObserver.observe(el); });
        } else {
            subtitleEls.forEach(function (el) { el.classList.add('sub-visible'); });
        }
    }

})();
