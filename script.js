document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 1000); // Show logo for 1s after load
        });

        // Fallback: hide preloader after 5s regardless of load event
        setTimeout(() => {
            if (!preloader.classList.contains('fade-out')) {
                preloader.classList.add('fade-out');
            }
        }, 5000);
    }

    // Countdown Timer & Loading Bar
    const targetDate = new Date('February 12, 2026 00:00:00').getTime();
    const startDate = new Date('February 1, 2026 00:00:00').getTime(); // Reference point for percentage
    const totalDuration = targetDate - startDate;

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        const elapsed = now - startDate;

        if (distance < 0) {
            clearInterval(timerInterval);
            document.getElementById('loading-pct').innerText = '100%';
            document.getElementById('loading-fill').style.width = '100%';
            return;
        }

        // Percentage Calculation
        const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        document.getElementById('loading-pct').innerText = `${percentage.toFixed(1)}%`;
        document.getElementById('loading-fill').style.width = `${percentage}%`;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update Hero Elements
        const heroDays = document.getElementById('days-hero');
        const heroHours = document.getElementById('hours-hero');
        const heroMins = document.getElementById('minutes-hero');
        const heroSecs = document.getElementById('seconds-hero');

        if (heroDays) heroDays.innerText = days.toString().padStart(2, '0');
        if (heroHours) heroHours.innerText = hours.toString().padStart(2, '0');
        if (heroMins) heroMins.innerText = minutes.toString().padStart(2, '0');
        if (heroSecs) heroSecs.innerText = seconds.toString().padStart(2, '0');

        // Update Sticky Elements
        const stickyDays = document.getElementById('days-sticky');
        const stickyHours = document.getElementById('hours-sticky');
        const stickyMins = document.getElementById('minutes-sticky');
        const stickySecs = document.getElementById('seconds-sticky');

        if (stickyDays) stickyDays.innerText = days.toString().padStart(2, '0');
        if (stickyHours) stickyHours.innerText = hours.toString().padStart(2, '0');
        if (stickyMins) stickyMins.innerText = minutes.toString().padStart(2, '0');
        if (stickySecs) stickySecs.innerText = seconds.toString().padStart(2, '0');
    };

    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // Custom Cursor Tracking
    const cursor = document.querySelector('.cursor-laser');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (cursor && !isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
    } else if (cursor) {
        cursor.style.display = 'none';
    }

    // Auth Modal Logic
    const modal = document.getElementById('auth-modal');
    const modalTitle = document.getElementById('modal-title');
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    const closeModal = document.querySelector('.close-modal');

    const openModal = (type) => {
        modalTitle.innerText = type.toUpperCase();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Hide all forms first
        document.getElementById('auth-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('admin-login-form').style.display = 'none';
        document.getElementById('forgot-password-form').style.display = 'none';

        if (type === 'register') {
            document.getElementById('register-form').style.display = 'block';
        } else if (type === 'admin') {
            document.getElementById('admin-login-form').style.display = 'block';
            modalTitle.innerText = "ADMIN";
        } else if (type === 'forgot') {
            document.getElementById('forgot-password-form').style.display = 'block';
            modalTitle.innerText = "FORGOT PASSWORD";
            // Reset OTP section
            document.getElementById('otp-section').style.display = 'none';
            document.getElementById('request-otp-btn').style.display = 'block';
        } else {
            document.getElementById('auth-form').style.display = 'block';
            modalTitle.innerText = "LOGIN";
        }
    };

    const hideModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    loginBtn.addEventListener('click', () => openModal('login'));
    registerBtn.addEventListener('click', () => openModal('register'));
    closeModal.addEventListener('click', hideModal);

    // Form Switching Links
    const adminLink = document.getElementById('go-to-admin');
    if (adminLink) {
        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('admin');
        });
    }

    const forgotLinks = ['go-to-forgot', 'admin-forgot'];
    forgotLinks.forEach(id => {
        const link = document.getElementById(id);
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openModal('forgot');
            });
        }
    });

    const backToLogin = document.getElementById('back-to-login');
    if (backToLogin) {
        backToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('login');
        });
    }

    const requestOtpBtn = document.getElementById('request-otp-btn');
    const otpSection = document.getElementById('otp-section');
    if (requestOtpBtn && otpSection) {
        requestOtpBtn.addEventListener('click', () => {
            const userId = document.getElementById('forgot-userid').value;
            if (userId.trim() !== '') {
                otpSection.style.display = 'block';
                requestOtpBtn.style.display = 'none';
            } else {
                alert('Please enter your User ID first.');
            }
        });
    }

    const registerLink = document.getElementById('go-to-register');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('register');
        });
    }

    const loginLink = document.getElementById('go-to-login');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('login');
        });
    }

    // Password Validation Logic
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const registerFormBtn = document.getElementById('register-btn');
    const passwordMsg = document.getElementById('password-msg');

    const validatePasswords = () => {
        if (password.value === confirmPassword.value && password.value !== '') {
            registerFormBtn.disabled = false;
            passwordMsg.innerText = 'Passwords match';
            passwordMsg.style.color = 'var(--p-400)';
        } else {
            registerFormBtn.disabled = true;
            if (confirmPassword.value !== '') {
                passwordMsg.innerText = 'Passwords do not match';
                passwordMsg.style.color = '#ef4444';
            } else {
                passwordMsg.innerText = '';
            }
        }
    };

    password.addEventListener('input', validatePasswords);
    confirmPassword.addEventListener('input', validatePasswords);

    // Auto-generate Username from Lead Email
    const leadEmail = document.getElementById('lead-email');
    const usernameField = document.getElementById('username');

    leadEmail.addEventListener('input', () => {
        const email = leadEmail.value;
        if (email.includes('@')) {
            const username = email.split('@')[0] + '@datasprint';
            usernameField.value = username;
        } else {
            usernameField.value = '';
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    // Navigation Smooth Scroll Fix for Snap
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Only smooth scroll if the link is a hash (internal section)
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }

                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(faq => faq.classList.remove('active'));

            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Sticky Loader Scroll Logic
    const stickyLoader = document.getElementById('sticky-loader');
    if (stickyLoader) {
        window.addEventListener('scroll', () => {
            // Show loader only when not on home page (scrolled > 300px)
            if (window.scrollY > 300) {
                stickyLoader.classList.add('visible');
            } else {
                stickyLoader.classList.remove('visible');
            }
        });

        // Automatic Flip Logic
        const widgetInner = stickyLoader.querySelector('.widget-inner');
        if (widgetInner) {
            let isFlipped = false;
            setInterval(() => {
                isFlipped = !isFlipped;
                if (isFlipped) {
                    widgetInner.style.transform = 'rotateY(180deg)';
                } else {
                    widgetInner.style.transform = 'rotateY(0deg)';
                }
            }, 10000); // Flip every 10 seconds
        }
    }

    // Scroll Reveal Intersection Observer
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    console.log('DATA SPRINT 3.0 Initialized');

    // --- Letter Glitch Background Logic ---
    const glitchContainer = document.getElementById("letter-glitch");
    if (glitchContainer) {
        const glitchConfig = {
            glitchColors: ['#16a34a', '#4ade80', '#052e16', '#22c55e', '#14532d'],
            glitchSpeed: 80,
            smooth: true,
            outerVignette: true,
            centerVignette: false,
            characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'
        };

        const gCanvas = document.createElement("canvas");
        const gCtx = gCanvas.getContext("2d");
        glitchContainer.appendChild(gCanvas);

        if (glitchConfig.outerVignette) {
            const v = document.createElement("div");
            v.className = "vignette-outer";
            glitchContainer.appendChild(v);
        }

        const gFontSize = 14;
        const gCharWidth = 10;
        const gCharHeight = 20;

        let gLetters = [];
        let gGrid = { columns: 0, rows: 0 };
        let gLastTime = Date.now();
        let gAnimId;

        const gChars = Array.from(glitchConfig.characters);
        const gGetRandChar = () => gChars[Math.floor(Math.random() * gChars.length)];
        const gGetRandColor = () => glitchConfig.glitchColors[Math.floor(Math.random() * glitchConfig.glitchColors.length)];

        const gHexToRgb = hex => {
            hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b);
            const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return res && { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16) };
        };

        const gLerpColor = (a, b, f) => {
            return `rgb(${Math.round(a.r + (b.r - a.r) * f)}, ${Math.round(a.g + (b.g - a.g) * f)}, ${Math.round(a.b + (b.b - a.b) * f)})`;
        };

        const gRgbToHex = rgb => {
            const res = rgb.match(/\d+/g);
            return res ? "#" + res.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('') : "#ffffff";
        };

        function gResize() {
            const dpr = window.devicePixelRatio || 1;
            const rect = glitchContainer.getBoundingClientRect();
            gCanvas.width = rect.width * dpr;
            gCanvas.height = rect.height * dpr;
            gCanvas.style.width = rect.width + "px";
            gCanvas.style.height = rect.height + "px";
            gCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            gGrid.columns = Math.ceil(rect.width / gCharWidth);
            gGrid.rows = Math.ceil(rect.height / gCharHeight);
            gLetters = Array.from({ length: gGrid.columns * gGrid.rows }, () => ({
                char: gGetRandChar(),
                color: gGetRandColor(),
                targetColor: gGetRandColor(),
                progress: 1
            }));
            gDraw();
        }

        function gDraw() {
            gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
            gCtx.font = `${gFontSize}px monospace`;
            gCtx.textBaseline = "top";
            gLetters.forEach((l, i) => {
                const x = (i % gGrid.columns) * gCharWidth;
                const y = Math.floor(i / gGrid.columns) * gCharHeight;
                gCtx.fillStyle = l.color;
                gCtx.fillText(l.char, x, y);
            });
        }

        function gGlitch() {
            const count = Math.max(1, Math.floor(gLetters.length * 0.03));
            for (let i = 0; i < count; i++) {
                const idx = Math.floor(Math.random() * gLetters.length);
                gLetters[idx].char = gGetRandChar();
                gLetters[idx].targetColor = gGetRandColor();
                gLetters[idx].progress = glitchConfig.smooth ? 0 : 1;
                if (!glitchConfig.smooth) gLetters[idx].color = gLetters[idx].targetColor;
            }
        }

        function gSmoothColors() {
            let redraw = false;
            gLetters.forEach(l => {
                if (l.progress < 1) {
                    l.progress += 0.04;
                    const a = gHexToRgb(l.color.startsWith('rgb') ? gRgbToHex(l.color) : l.color);
                    const b = gHexToRgb(l.targetColor);
                    if (a && b) {
                        l.color = gLerpColor(a, b, Math.min(l.progress, 1));
                        redraw = true;
                    }
                }
            });
            if (redraw) gDraw();
        }

        function gAnimate() {
            const now = Date.now();
            if (now - gLastTime >= glitchConfig.glitchSpeed) {
                gGlitch();
                gDraw();
                gLastTime = now;
            }
            if (glitchConfig.smooth) gSmoothColors();
            gAnimId = requestAnimationFrame(gAnimate);
        }

        window.addEventListener("resize", () => {
            cancelAnimationFrame(gAnimId);
            gResize();
            gAnimate();
        });

        gResize();
        gAnimate();
    }

    // --- Go Up Button Logic ---
    const goUpBtn = document.getElementById('go-up-btn');
    if (goUpBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                goUpBtn.classList.add('visible');
            } else {
                goUpBtn.classList.remove('visible');
            }
        });

        goUpBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Hero Action Buttons ---
    const exploreBtn = document.getElementById('explore-btn');
    const registerHeroBtn = document.getElementById('register-hero-btn');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (registerHeroBtn) {
        registerHeroBtn.addEventListener('click', () => {
            openModal('register');
        });
    }
});
