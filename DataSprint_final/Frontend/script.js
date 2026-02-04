const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // --- Session Persistence Logic ---
    const checkSession = () => {
        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');
        const navAuth = document.getElementById('nav-auth-btns');
        const navUser = document.getElementById('nav-user-btns');
        const userDisplay = document.getElementById('user-display-name');

        if (token && userJson && navAuth && navUser) {
            // Check if already on index.html, if so, redirect to dashboard.html later
            // For now, just update the navbar
            const user = JSON.parse(userJson);
            navAuth.style.display = 'none';
            navUser.style.display = 'flex';
            if (userDisplay) userDisplay.innerText = user.teamName.toUpperCase();

            // Auto-redirect if on index.html
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                window.location.href = 'home.HTML';
            }
        } else if (navAuth && navUser) {
            navAuth.style.display = 'flex';
            navUser.style.display = 'none';
        }
    };

    // Logout Handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            showNotification('Logged out successfully.', 'success');
            setTimeout(() => window.location.reload(), 1000);
        });
    }

    checkSession();
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
    const forgotForm = document.getElementById('forgot-password-form');

    if (requestOtpBtn && otpSection) {
        requestOtpBtn.addEventListener('click', async () => {
            const username = document.getElementById('forgot-userid').value;
            if (username.trim() === '') {
                showNotification('Please enter your Username first.', 'warning');
                return;
            }

            try {
                requestOtpBtn.innerText = 'SENDING...';
                requestOtpBtn.disabled = true;

                const response = await fetch(`${API_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username })
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification('OTP sent to your registered email.', 'success');
                    otpSection.style.display = 'block';
                    requestOtpBtn.style.display = 'none';
                } else {
                    showNotification(data.message || 'Failed to send OTP.', 'error');
                }
            } catch (error) {
                console.error('Forgot Password Error:', error);
                showNotification('Connection to backend failed.', 'error');
            } finally {
                requestOtpBtn.innerText = 'REQUEST OTP';
                requestOtpBtn.disabled = false;
            }
        });
    }

    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('forgot-userid').value;
            const otp = document.getElementById('forgot-otp').value;
            const newPassword = document.getElementById('forgot-new-password').value;

            if (otp.length !== 6) {
                showNotification('Please enter a valid 6-digit OTP.', 'warning');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, otp, newPassword })
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification('Password reset successfully! Logic initiated.', 'success');
                    setTimeout(() => openModal('login'), 2000);
                } else {
                    showNotification(data.message || 'Reset failed.', 'error');
                }
            } catch (error) {
                console.error('Reset Error:', error);
                showNotification('Connection to backend failed.', 'error');
            }
        });
    }

    // Login Handler
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification('Welcome back! Initializing session...', 'success');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setTimeout(() => {
                        window.location.href = 'home.HTML';
                    }, 1500);
                } else {
                    showNotification(data.message || 'Login failed. Check credentials.', 'error');
                }
            } catch (error) {
                console.error('Login Error:', error);
                showNotification('Backend connection failed. Is server up?', 'error');
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

    // OTP Simulation Logic
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
                    sendOtpBtn.innerText = 'SENDING...';
                    sendOtpBtn.disabled = true;

                    const response = await fetch(`${API_URL}/auth/send-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        otpVerifyBox.style.display = 'block';
                        sendOtpBtn.innerText = 'RESEND OTP';
                        otpMsg.innerText = 'Verification code sent to ' + email;
                        otpMsg.style.color = 'var(--p-400)';
                    } else {
                        showNotification(data.message || 'Failed to send verification code.', 'error');
                    }
                } catch (error) {
                    console.error('OTP Send Error:', error);
                    showNotification('Connection to backend failed.', 'error');
                } finally {
                    sendOtpBtn.disabled = false;
                    if (sendOtpBtn.innerText !== 'RESEND OTP') sendOtpBtn.innerText = 'VERIFY';
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
            if (otp.length === 6) {
                try {
                    verifyOtpBtn.innerText = 'VERIFYING...';
                    verifyOtpBtn.disabled = true;

                    const response = await fetch(`${API_URL}/auth/verify-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, otp, type: 'registration' })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        otpMsg.innerText = 'Email Verified Successfully!';
                        otpMsg.style.color = '#4ade80';
                        verifyOtpBtn.disabled = true;
                        otpInput.disabled = true;
                        nextToStep2Btn.disabled = false;
                        sendOtpBtn.style.display = 'none';
                        showNotification('Email verified! You can proceed.', 'success');
                    } else {
                        otpMsg.innerText = data.message || 'Invalid OTP.';
                        otpMsg.style.color = '#ef4444';
                    }
                } catch (error) {
                    console.error('OTP Verify Error:', error);
                    showNotification('Connection to backend failed.', 'error');
                } finally {
                    if (!nextToStep2Btn.disabled) {
                        verifyOtpBtn.disabled = true;
                    } else {
                        verifyOtpBtn.disabled = false;
                        verifyOtpBtn.innerText = 'VERIFY OTP';
                    }
                }
            } else {
                showNotification('Please enter the 6-digit code.', 'warning');
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

        const passwordsMatch = password && confirmPassword && password.value === confirmPassword.value && password.value !== '';

        if (allFilled && passwordsMatch) {
            registerFormBtn.disabled = false;
        } else {
            registerFormBtn.disabled = true;
        }

        if (confirmPassword && confirmPassword.value) {
            if (passwordsMatch) {
                passwordMsg.innerText = 'Passwords match. Session ready.';
                passwordMsg.style.color = '#4ade80';
            } else {
                passwordMsg.innerText = 'Passwords do not match.';
                passwordMsg.style.color = '#ef4444';
            }
        }
    };

    if (password && confirmPassword) {
        [password, confirmPassword].forEach(el => el.addEventListener('input', checkFinalValidity));
    }
    document.querySelectorAll('#register-form input, #register-form select').forEach(el => {
        el.addEventListener('input', checkFinalValidity);
    });

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Collect all data from 4 steps
            const payload = {
                teamName: document.getElementById('reg-team-name').value,
                username: document.getElementById('username').value,
                password: password.value,
                name: document.getElementById('reg-lead-name').value,
                phone: document.getElementById('reg-lead-phone').value,
                email: document.getElementById('lead-email').value,
                college: document.getElementById('reg-lead-college').value,
                dept: document.getElementById('reg-lead-dept').value,
                year: document.getElementById('reg-lead-year').value,

                // Members (optional fields handle gracefully)
                m1Name: document.getElementById('reg-m1-name').value,
                m1Phone: document.getElementById('reg-m1-phone').value,
                m1Email: document.getElementById('reg-m1-email').value,
                m1College: document.getElementById('reg-m1-college').value,
                m1Dept: document.getElementById('reg-m1-dept').value,
                m1Year: document.getElementById('reg-m1-year').value,

                m2Name: document.getElementById('reg-m2-name').value,
                m2Phone: document.getElementById('reg-m2-phone').value,
                m2Email: document.getElementById('reg-m2-email').value,
                m2College: document.getElementById('reg-m2-college').value,
                m2Dept: document.getElementById('reg-m2-dept').value,
                m2Year: document.getElementById('reg-m2-year').value,

                m3Name: document.getElementById('reg-m3-name').value,
                m3Phone: document.getElementById('reg-m3-phone').value,
                m3Email: document.getElementById('reg-m3-email').value,
                m3College: document.getElementById('reg-m3-college').value,
                m3Dept: document.getElementById('reg-m3-dept').value,
                m3Year: document.getElementById('reg-m3-year').value
            };

            try {
                registerFormBtn.innerText = 'PROCESSING...';
                registerFormBtn.disabled = true;

                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification('Registration Success! Welcome to Data Sprint 3.0.', 'success');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setTimeout(() => {
                        window.location.href = 'home.HTML';
                    }, 2000);
                } else {
                    showNotification(data.message || 'Registration failed.', 'error');
                }
            } catch (error) {
                console.error('Registration Error:', error);
                showNotification('Connection to backend failed.', 'error');
            } finally {
                registerFormBtn.innerText = 'REGISTER';
                registerFormBtn.disabled = false;
            }
        });
    }

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

