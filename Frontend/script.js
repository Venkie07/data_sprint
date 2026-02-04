document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api';
    // --- Custom Notification System ---
    const showNotification = (message, type = 'info') => {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerHTML = `<span>${message}</span>`;

        container.appendChild(notif);

        setTimeout(() => {
            notif.classList.add('fade-out');
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    };

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
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
    }

    // Auth Modal Logic
    const modal = document.getElementById('auth-modal');
    const modalTitle = document.getElementById('modal-title');
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    const closeModal = document.querySelector('.close-modal');

    let openModal = (type) => {
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
        requestOtpBtn.addEventListener('click', async () => {
            const username = document.getElementById('forgot-userid').value;
            if (username.trim() !== '') {
                try {
                    requestOtpBtn.disabled = true;
                    requestOtpBtn.innerText = 'REQUESTING...';

                    const response = await fetch(`${API_URL}/auth/forgot-password`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        otpSection.style.display = 'block';
                        requestOtpBtn.style.display = 'none';
                        showNotification('Security code sent to your email.');
                    } else {
                        showNotification(data.message || 'Verification request failed', 'error');
                    }
                } catch (error) {
                    showNotification('Connection error.', 'error');
                } finally {
                    requestOtpBtn.disabled = false;
                    requestOtpBtn.innerText = 'REQUEST OTP';
                }
            } else {
                showNotification('Please enter your User ID first.', 'warning');
            }
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('forgot-userid').value;
            const otp = document.getElementById('forgot-otp').value;
            const newPassword = document.getElementById('forgot-new-password').value;

            if (otp.length !== 6 || newPassword.length < 6) {
                return showNotification('Invalid OTP or Password (min 6 chars)', 'warning');
            }

            try {
                const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
                submitBtn.innerText = 'RESETTING...';
                submitBtn.disabled = true;

                const response = await fetch(`${API_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, otp, newPassword })
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification('Password updated! You can now login.', 'success');
                    setTimeout(() => {
                        openModal('login');
                    }, 2000);
                } else {
                    showNotification(data.message || 'Reset failed', 'error');
                }
            } catch (error) {
                showNotification('Network error.', 'error');
            } finally {
                const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
                submitBtn.innerText = 'RESET PASSWORD';
                submitBtn.disabled = false;
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

    // --- Multi-step Registration Form Logic ---
    let currentStep = 0;
    const formSteps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const progressFill = document.getElementById('reg-progress-fill');

    const showStep = (stepIdx) => {
        formSteps.forEach((step, idx) => {
            step.classList.toggle('active', idx === stepIdx);
        });

        stepIndicators.forEach((indicator, idx) => {
            indicator.classList.toggle('active', idx === stepIdx);
            indicator.classList.toggle('completed', idx < stepIdx);
        });

        const progressPercent = ((stepIdx + 1) / formSteps.length) * 100;
        if (progressFill) progressFill.style.width = `${progressPercent}%`;

        currentStep = stepIdx;
    };

    // Navigation Buttons Handle
    document.querySelectorAll('.next-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < formSteps.length - 1) {
                showStep(currentStep + 1);
            }
        });
    });

    document.querySelectorAll('.prev-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    // OTP Logic Integration
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    const otpVerifyBox = document.getElementById('otp-verify-box');
    const otpInput = document.getElementById('reg-otp-input');
    const otpMsg = document.getElementById('otp-msg');
    const nextToStep2Btn = document.getElementById('to-step-2');

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', async () => {
            const email = document.getElementById('lead-email').value;
            if (email.includes('@')) {
                try {
                    sendOtpBtn.disabled = true;
                    sendOtpBtn.innerText = 'SENDING...';

                    const response = await fetch(`${API_URL}/auth/send-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        otpVerifyBox.style.display = 'block';
                        sendOtpBtn.innerText = 'RESEND OTP';
                        otpMsg.innerText = 'OTP sent to ' + email;
                        otpMsg.style.color = 'var(--p-400)';
                        showNotification('Verification code sent to your email.');
                    } else {
                        showNotification(data.message || 'Failed to send OTP', 'error');
                        sendOtpBtn.innerText = 'VERIFY';
                    }
                } catch (error) {
                    showNotification('Network error. Check if server is running.', 'error');
                    sendOtpBtn.innerText = 'VERIFY';
                } finally {
                    sendOtpBtn.disabled = false;
                }
            } else {
                showNotification('Please enter a valid email address.', 'warning');
            }
        });
    }

    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', async () => {
            const email = document.getElementById('lead-email').value;
            const otp = otpInput.value;

            if (otp.length !== 6) return showNotification('Enter 6-digit OTP', 'warning');

            try {
                verifyOtpBtn.disabled = true;
                verifyOtpBtn.innerText = 'VERIFYING...';

                const response = await fetch(`${API_URL}/auth/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp })
                });

                const data = await response.json();

                if (response.ok) {
                    otpMsg.innerText = 'Email Verified Successfully!';
                    otpMsg.style.color = '#4ade80';
                    verifyOtpBtn.disabled = true;
                    otpInput.disabled = true;
                    nextToStep2Btn.disabled = false;
                    sendOtpBtn.style.display = 'none';
                    showNotification('Email verified! You can proceed.');
                } else {
                    otpMsg.innerText = data.message || 'Invalid OTP.';
                    otpMsg.style.color = '#ef4444';
                }
            } catch (error) {
                showNotification('Verification failed. Try again.', 'error');
            } finally {
                verifyOtpBtn.disabled = false;
                if (!verifyOtpBtn.disabled) verifyOtpBtn.innerText = 'VERIFY OTP';
            }
        });
    }

    // Passwords & Final Register Validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const registerFormBtn = document.getElementById('register-btn');
    const passwordMsg = document.getElementById('password-msg');

    const checkFinalValidity = () => {
        const allRequiredFields = document.querySelectorAll('#register-form [required]');
        let allFilled = true;
        allRequiredFields.forEach(field => {
            if (!field.value.trim()) allFilled = false;
        });

        const passwordsMatch = password.value === confirmPassword.value && password.value !== '';

        if (allFilled && passwordsMatch) {
            registerFormBtn.disabled = false;
        } else {
            registerFormBtn.disabled = true;
        }

        if (confirmPassword.value) {
            if (passwordsMatch) {
                passwordMsg.innerText = 'Passwords match. Session ready.';
                passwordMsg.style.color = '#4ade80';
            } else {
                passwordMsg.innerText = 'Passwords do not match.';
                passwordMsg.style.color = '#ef4444';
            }
        }
    };

    [password, confirmPassword].forEach(el => el?.addEventListener('input', checkFinalValidity));
    document.querySelectorAll('#register-form input, #register-form select').forEach(el => {
        el.addEventListener('input', checkFinalValidity);
    });

    // Reset Form on Open
    const originalOpenModal = openModal;
    openModal = (type) => {
        originalOpenModal(type);
        if (type === 'register') {
            showStep(0);
            otpVerifyBox.style.display = 'none';
            nextToStep2Btn.disabled = true;
            otpInput.value = '';
            otpInput.disabled = false;
            verifyOtpBtn.disabled = false;
            sendOtpBtn.style.display = 'inline-block';
            sendOtpBtn.innerText = 'VERIFY';
            otpMsg.innerText = '';
        }
    };

    // Auto-generate Username from Lead Email
    const leadEmail = document.getElementById('lead-email');
    const usernameField = document.getElementById('username');

    if (leadEmail && usernameField) {
        leadEmail.addEventListener('input', () => {
            const email = leadEmail.value;
            if (email.includes('@')) {
                const username = email.split('@')[0] + '@datasprint';
                usernameField.value = username;
            } else {
                usernameField.value = '';
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    // --- Auth API Integration ---

    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usernameInput = authForm.querySelector('input[type="text"]');
            const passwordInput = authForm.querySelector('input[type="password"]');
            const username = usernameInput.value;
            const password = passwordInput.value;

            try {
                const submitBtn = authForm.querySelector('.auth-submit-btn');
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'AUTHENTICATING...';
                submitBtn.disabled = true;

                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    showNotification('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'home.HTML';
                    }, 1000);
                } else {
                    showNotification(data.message || 'Login failed', 'error');
                }
            } catch (error) {
                showNotification('Connection error. Is the backend server running?', 'error');
            } finally {
                const submitBtn = authForm.querySelector('.auth-submit-btn');
                submitBtn.innerText = 'INITIATE SESSION';
                submitBtn.disabled = false;
            }
        });
    }

    const registrationForm = document.getElementById('register-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(registrationForm);
            const rawData = Object.fromEntries(formData.entries());

            // Map and prepare data for backend
            const payload = {
                teamName: rawData.team_name,
                name: rawData.lead_name,
                email: rawData.lead_email,
                phone: rawData.lead_phone,
                college: rawData.lead_college,
                dept: rawData.lead_dept,
                year: rawData.lead_year,

                m1Name: rawData.m1_name || '---',
                m1Phone: rawData.m1_phone || '---',
                m1Email: rawData.m1_email || '---',
                m1College: rawData.m1_college || '---',
                m1Dept: rawData.m1_dept || '---',
                m1Year: rawData.m1_year || '---',

                m2Name: rawData.m2_name || '---',
                m2Phone: rawData.m2_phone || '---',
                m2Email: rawData.m2_email || '---',
                m2College: rawData.m2_college || '---',
                m2Dept: rawData.m2_dept || '---',
                m2Year: rawData.m2_year || '---',

                m3Name: rawData.m3_name || '---',
                m3Phone: rawData.m3_phone || '---',
                m3Email: rawData.m3_email || '---',
                m3College: rawData.m3_college || '---',
                m3Dept: rawData.m3_dept || '---',
                m3Year: rawData.m3_year || '---',

                username: document.getElementById('username').value,
                password: password.value
            };

            try {
                const registerFormBtn = document.getElementById('register-btn');
                registerFormBtn.innerText = 'INITIALIZING...';
                registerFormBtn.disabled = true;

                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification('Registration successful!', 'success');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setTimeout(() => {
                        window.location.href = 'home.HTML';
                    }, 1500);
                } else {
                    showNotification(data.message || 'Registration failed', 'error');
                }
            } catch (error) {
                showNotification('Error connecting to server.', 'error');
            } finally {
                const registerFormBtn = document.getElementById('register-btn');
                registerFormBtn.innerText = 'REGISTER';
                registerFormBtn.disabled = false;
            }
        });
    }

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

