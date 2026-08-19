/* ═══════════════════════════════════════════════════════════════
   Prototype Pictures — main.js
   ════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Custom Cursor ──────────────────────────────────────────── */
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let rafId;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const ease = 0.18;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        cursor.style.left = cursorX + 'px';
        cursor.style.top  = cursorY + 'px';
        rafId = requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Expand on hover over interactive elements
    const hoverTargets = 'a, button, .work-card, .director-card, .nav__toggle';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor--expanded'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--expanded'));
    });


    /* ── Nav scroll state ───────────────────────────────────────── */
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }, { passive: true });


    /* ── Mobile Menu ────────────────────────────────────────────── */
    const navToggle   = document.getElementById('navToggle');
    const mobileMenu  = document.getElementById('mobileMenu');
    const menuClose   = document.getElementById('menuClose');
    const menuLinks   = mobileMenu.querySelectorAll('.mobile-menu__link');

    function openMenu() {
        mobileMenu.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);

    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });


    /* ── Reel Lightbox & Hero Reel Flow ───────────────────────── */
    const reelBtn       = document.getElementById('reelBtn');
    const lightbox      = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const reelVideo     = document.getElementById('reelVideo');
    const heroVideo     = document.querySelector('.hero__video');
    const heroTitle     = document.querySelector('.hero__credit-title');
    const heroMeta      = document.querySelector('.hero__credit-meta');
    const heroPlaceholder = document.querySelector('.hero__video-placeholder');
    const prevVideoBtn = document.getElementById('prevVideo');
    const nextVideoBtn = document.getElementById('nextVideo');

    const heroVideos = [
        {
            label: 'Family Dog (Coors Spec)',
            meta: 'Dir. Mike Overton &ensp;/&ensp; Coors',
            src: 'assets/Sequence 01_1.mp4'
        },
        {
            label: 'Late Night Priorities (Taco Bell Spec)',
            meta: 'Dir. Liam Morrison &ensp;/&ensp; Taco Bell',
            src: 'assets/Late Night.mp4'
        },
        {
            label: 'Roadkill (Short Film)',
            meta: 'Short Film',
            src: 'assets/Roadkill-web.mp4'
        }
    ];

    let heroIndex = 0;

    const videoPath = (value) => {
        try {
            return new URL(value, window.location.href).pathname;
        } catch {
            return value;
        }
    };

    function setHeroVideo(index) {
        if (!heroVideo || !heroTitle || !heroMeta) return;

        heroIndex = index;
        const active = heroVideos[heroIndex];
        heroTitle.textContent = active.label;
        heroMeta.innerHTML = active.meta;

        heroVideo.pause();
        heroVideo.removeAttribute('src');
        heroVideo.innerHTML = '';

        const sourceEl = document.createElement('source');
        sourceEl.src = active.src;
        sourceEl.type = 'video/mp4';
        heroVideo.appendChild(sourceEl);

        heroVideo.load();
        heroVideo.muted = true;
        heroVideo.volume = 0;
        heroVideo.currentTime = 0;

        const playAttempt = () => {
            heroVideo.play().catch(() => {});
        };

        heroVideo.onloadeddata = null;
        heroVideo.addEventListener('loadeddata', playAttempt, { once: true });
        requestAnimationFrame(playAttempt);
    }

    function openLightbox() {
        if (!lightbox || !reelVideo) return;
        const active = heroVideos[heroIndex];

        reelVideo.pause();
        reelVideo.removeAttribute('src');
        reelVideo.innerHTML = '';

        const sourceEl = document.createElement('source');
        sourceEl.src = active.src;
        sourceEl.type = 'video/mp4';
        reelVideo.appendChild(sourceEl);

        reelVideo.load();
        reelVideo.muted = true;
        reelVideo.play().catch(() => {});
        lightbox.classList.add('is-open');
        lightbox.removeAttribute('aria-hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox || !reelVideo) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        reelVideo.pause();
    }

    if (reelBtn) {
        reelBtn.addEventListener('click', openLightbox);
    }
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    if (prevVideoBtn) {
        prevVideoBtn.addEventListener('click', () => {
            const nextIndex = heroIndex === 0 ? heroVideos.length - 1 : heroIndex - 1;
            setHeroVideo(nextIndex);
        });
    }

    if (nextVideoBtn) {
        nextVideoBtn.addEventListener('click', () => {
            const nextIndex = heroIndex === heroVideos.length - 1 ? 0 : heroIndex + 1;
            setHeroVideo(nextIndex);
        });
    }

    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.volume = 0;
        heroVideo.addEventListener('ended', () => {
            const nextIndex = (heroIndex + 1) % heroVideos.length;
            setHeroVideo(nextIndex);
        });
        heroVideo.addEventListener('loadeddata', () => {
            if (heroPlaceholder) heroPlaceholder.style.opacity = '0';
        });
        heroVideo.addEventListener('error', () => {
            console.info('Hero video not found — showing placeholder.');
        });
    }

    setHeroVideo(0);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeMenu();
        }
    });

    /* ── Scroll Reveal ──────────────────────────────────────────── */
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ── Smooth anchor scroll (for nav links) ───────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ── Marquee pause on hover ─────────────────────────────────── */
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        marqueeTrack.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });
        marqueeTrack.addEventListener('mouseleave', () => {
            marqueeTrack.style.animationPlayState = 'running';
        });
    }

});
