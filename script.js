/* ============================================
   CLUBE DE OFERTAS - PERFUMES
   JavaScript: Animations & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('hero');

    function handleNavScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // --- Floating CTA visibility ---
    const floatingCta = document.getElementById('floating-cta');
    
    function handleFloatingCta() {
        if (window.scrollY > window.innerHeight * 0.5) {
            floatingCta.classList.add('visible');
        } else {
            floatingCta.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleFloatingCta, { passive: true });
    handleFloatingCta();

    // --- Scroll animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for sibling elements
                    const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                    let delay = 0;
                    siblings.forEach((sibling, i) => {
                        if (sibling === entry.target) {
                            delay = i * 80;
                        }
                    });

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all elements immediately
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // --- Counter animation ---
    const counters = document.querySelectorAll('.stat-number[data-target]');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

            el.textContent = currentValue.toLocaleString('pt-BR');

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString('pt-BR');
            }
        }

        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        counters.forEach(counter => {
            counter.textContent = counter.getAttribute('data-target');
        });
    }

    // --- Smooth haptic-like feedback on CTA tap (mobile) ---
    const ctaButtons = document.querySelectorAll('.cta-button, .floating-cta, .nav-cta');

    ctaButtons.forEach(btn => {
        btn.addEventListener('touchstart', () => {
            btn.style.transform = 'scale(0.97)';
        }, { passive: true });

        btn.addEventListener('touchend', () => {
            btn.style.transform = '';
        }, { passive: true });
    });

    // --- Parallax effect on hero (subtle, desktop only) ---
    if (window.innerWidth > 768) {
        const heroBgImg = document.querySelector('.hero-bg-img');
        
        if (heroBgImg) {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                if (scrolled < window.innerHeight) {
                    heroBgImg.style.transform = `scale(1.1) translateY(${scrolled * 0.2}px)`;
                }
            }, { passive: true });
        }
    }

    // --- Accessibility: Reduce animations if user prefers ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('visible');
        });
    }
});
