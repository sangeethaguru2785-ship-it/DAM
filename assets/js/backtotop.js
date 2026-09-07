(function () {
    if (document.getElementById('backToTop')) return;

    var style = document.createElement('style');
    style.textContent =
        '#backToTop{' +
            'position:fixed;' +
            'right:22px;' +
            'bottom:22px;' +
            'z-index:9999;' +
            'width:48px;' +
            'height:48px;' +
            'border-radius:50%;' +
            'display:flex;' +
            'align-items:center;' +
            'justify-content:center;' +
            'background:linear-gradient(135deg,#E0BF5C 0%,#C9A227 55%,#A8861E 100%);' +
            'color:#151208;' +
            'font-size:18px;' +
            'border:none;' +
            'cursor:pointer;' +
            'box-shadow:0 8px 24px rgba(201,162,39,0.4);' +
            'opacity:0;' +
            'visibility:hidden;' +
            'transform:translateY(14px);' +
            'transition:opacity .3s ease,transform .3s ease,visibility .3s,box-shadow .3s ease;' +
        '}' +
        '#backToTop.show{' +
            'opacity:1;' +
            'visibility:visible;' +
            'transform:translateY(0);' +
        '}' +
        '#backToTop:hover{' +
            'transform:translateY(-4px);' +
            'box-shadow:0 14px 34px rgba(201,162,39,0.55);' +
        '}' +
        '#backToTop:active{' +
            'transform:translateY(0);' +
        '}' +
        '@media (max-width:768px){' +
            '#backToTop{' +
                'right:16px;' +
                'bottom:16px;' +
                'width:44px;' +
                'height:44px;' +
                'font-size:16px;' +
            '}' +
        '}';

    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(btn);

    var threshold = 300;

    function onScroll() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (scrollTop > threshold) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();