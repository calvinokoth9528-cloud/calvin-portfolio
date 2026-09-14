(function() {
    'use strict';

    // Preloader
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
            }, 500);
        }, 800);
    }

    // Detect touch
    function detectTouchDevice() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
        }
    }

    // Theme
    function initTheme() {
        const saved = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'dark' || (!saved && systemDark)) {
            document.body.classList.add('dark');
        }
    }

    // Navbar scroll state
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        let scrolled = false;
        const toggleScrolled = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                scrolled = isScrolled;
                navbar.classList.toggle('scrolled', isScrolled);
            }
        };
        toggleScrolled();
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => { toggleScrolled(); ticking = false; });
                ticking = true;
            }
        });
    }

    // Smooth scroll
    function initSmoothScroll() {
        document.querySelectorAll('.scroll-link').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        const navLinks = document.getElementById('navLinks');
                        const toggle = document.getElementById('navToggle');
                        if (navLinks && navLinks.classList.contains('open')) {
                            navLinks.classList.remove('open');
                            toggle.classList.remove('open');
                        }
                    }
                }
            });
        });
    }

    // Mobile nav toggle
    function initMobileNav() {
        const toggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        if (!toggle || !navLinks) return;
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                toggle.classList.remove('open');
                navLinks.classList.remove('open');
            }
        });
    }

    // Scroll animations
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    }

    // Skills chart
    function initSkillsChart() {
        const canvas = document.getElementById('skillsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const isDark = document.body.classList.contains('dark');

        const textColor = isDark ? '#b3bac5' : '#475569';
        const gridColor = isDark ? '#2d3139' : '#e2e8f0';
        const accentColor = '#2563eb';

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Python', 'R/Tidyverse', 'Machine Learning', 'Data Viz', 'Docker', 'APIs'],
                datasets: [{
                    label: 'Proficiency',
                    data: [95, 85, 80, 88, 75, 82],
                    backgroundColor: accentColor,
                    borderRadius: 6,
                    barThickness: 24,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    x: {
                        grid: { color: 'transparent' },
                        ticks: { color: textColor, font: { size: 12 } },
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: gridColor },
                        ticks: { color: textColor, font: { size: 11 } },
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart',
                },
            }
        });

        // Update chart on theme change
        const observer = new MutationObserver(() => {
            const isDarkNow = document.body.classList.contains('dark');
            canvas.closest('.skills-chart').querySelectorAll('*').forEach(el => el.remove());
        });
    }

    // Theme toggle button
    function initThemeButton() {
        const btn = document.createElement('button');
        btn.className = 'theme-toggle';
        btn.setAttribute('aria-label', 'Toggle dark mode');
        btn.innerHTML = '🌓';
        document.body.appendChild(btn);
        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Contact form
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = {
                name: form.querySelector('#name').value.trim(),
                email: form.querySelector('#email').value.trim(),
                subject: form.querySelector('#subject').value.trim(),
                message: form.querySelector('#message').value.trim()
            };
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            const mailto = `mailto:calvinokoth9528@gmail.com?subject=${encodeURIComponent(data.subject || `Portfolio Contact from ${data.name}`)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`)}`;
            window.location.href = mailto;
            form.reset();
            showNotification('Opening your email client...', 'success');
        });
    }

    function showNotification(message, type) {
        let el = document.createElement('div');
        el.textContent = message;
        el.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            padding: 0.75rem 1.25rem; border-radius: 8px;
            color: white; font-weight: 500; z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(320px); transition: transform 0.3s ease;
            font-size: 0.9rem;
        `;
        el.style.background = type === 'error' ? '#ef4444' : '#22c55e';
        document.body.appendChild(el);
        setTimeout(() => el.style.transform = 'translateX(0)', 10);
        setTimeout(() => {
            el.style.transform = 'translateX(320px)';
            setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
        }, 3500);
    }

    // Init
    function init() {
        initPreloader();
        detectTouchDevice();
        initTheme();
        initNavbarScroll();
        initSmoothScroll();
        initMobileNav();
        initScrollAnimations();
        initThemeButton();
        initContactForm();

        // Load Chart.js and init chart
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
            script.onload = initSkillsChart;
            document.head.appendChild(script);
        } else {
            initSkillsChart();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
