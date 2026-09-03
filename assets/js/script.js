(function () {
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

    var siteNav = document.querySelector('.site-nav');

    window.addEventListener('scroll', function () {
        if (siteNav) {
            if (window.scrollY > 60) {
                siteNav.style.boxShadow = '0 6px 26px rgba(0,0,0,0.35)';
            } else {
                siteNav.style.boxShadow = 'none';
            }
        }
    });

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
        var previewBtn = card.querySelector('[data-action="preview"]');
        if (previewBtn) {
            previewBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                openLightbox(i);
            });
        }
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

    var rangeTabs = document.querySelectorAll('.range-tab');
    rangeTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            rangeTabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
        });
    });

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

    var inviteForm = document.getElementById('inviteForm');
    var inviteSuccess = document.getElementById('inviteSuccess');
    var inviteSuccessText = document.getElementById('inviteSuccessText');

    if (inviteForm) {
        inviteForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = document.getElementById('inviteName').value;
            var email = document.getElementById('inviteEmail').value;
            var role = document.getElementById('inviteRole').value;
            if (inviteSuccessText) inviteSuccessText.textContent = name + ' (' + email + ') has been invited as ' + role + '.';
            if (inviteSuccess) inviteSuccess.classList.add('show');
            inviteForm.reset();
            setTimeout(function () {
                if (inviteSuccess) inviteSuccess.classList.remove('show');
            }, 5000);
        });
    }

    var inviteBtns = document.querySelectorAll('#inviteBtn, #inviteBtn2');
    if (inviteBtns.length && inviteForm) {
        inviteBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                inviteForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    /* â”€â”€ Contact form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

    var contactForm = document.getElementById('contactForm');
    var contactSuccess = document.getElementById('contactSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
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
            alert('Upload modal coming soon!');
        });
    });

    var newCollectionBtns = document.querySelectorAll('#newCollectionBtn, #createCollectionBtn');
    newCollectionBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            alert('Create collection dialog coming soon!');
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

})();
