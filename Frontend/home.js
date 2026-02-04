document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'http://localhost:5000/api';
    let currentUser = null;

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

    // --- Session Verification ---
    const verifySession = async () => {
        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');

        if (!token || !userJson) {
            window.location.href = 'index.html';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Session invalid');
            }

            const data = await response.json();
            currentUser = data.user;
            updateUI();
        } catch (error) {
            console.error('Session error:', error);
            localStorage.clear();
            window.location.href = 'index.html';
        }
    };

    const updateUI = () => {
        if (!currentUser) return;

        // Nav/Header
        const displayName = document.getElementById('user-display-name');
        if (displayName) displayName.innerText = currentUser.teamName || 'Team';

        // Profile Modal
        const displayTeamName = document.getElementById('display-team-name');
        if (displayTeamName) displayTeamName.innerText = currentUser.teamName;

        const setField = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val || '---';
        };

        setField('member-lead-name', currentUser.name);
        setField('member-1-name', currentUser.m1Name);
        setField('member-2-name', currentUser.m2Name);
        setField('member-3-name', currentUser.m3Name);
    };

    await verifySession();

    // --- Profile Modal Logic ---
    const profileBtn = document.getElementById('profile-btn');
    const profileOverlay = document.getElementById('profile-overlay');
    const closeProfile = document.getElementById('close-profile');
    const teamSummary = document.getElementById('team-summary-trigger');
    const teamDetails = document.getElementById('team-details-box');

    if (profileBtn && profileOverlay) {
        profileBtn.addEventListener('click', () => {
            profileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeProfile) {
        closeProfile.addEventListener('click', () => {
            profileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    if (teamSummary && teamDetails) {
        teamSummary.addEventListener('click', () => {
            teamDetails.classList.toggle('active');
        });
    }

    // --- Logout Logic ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // --- Password Change Logic ---
    const showPwBtn = document.getElementById('show-pw-change-btn');
    const pwBox = document.getElementById('pw-change-box');
    const requestOtpBtn = document.getElementById('request-pw-otp-btn');
    const otpMsg = document.getElementById('pw-otp-msg');
    const otpVerifyBox = document.getElementById('pw-otp-verify-box');
    const confirmBtn = document.getElementById('confirm-pw-change-btn');

    if (showPwBtn && pwBox) {
        showPwBtn.addEventListener('click', () => {
            pwBox.style.display = pwBox.style.display === 'none' ? 'block' : 'none';
        });
    }

    if (requestOtpBtn) {
        requestOtpBtn.addEventListener('click', async () => {
            try {
                requestOtpBtn.disabled = true;
                requestOtpBtn.innerText = 'REQUESTING...';

                const response = await fetch(`${API_URL}/users/me/request-password-otp`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    otpVerifyBox.style.display = 'block';
                    requestOtpBtn.style.display = 'none';
                    otpMsg.innerText = 'OTP sent to your registered email.';
                    otpMsg.style.color = 'var(--p-400)';
                } else {
                    showNotification(data.message || 'Error requesting OTP', 'error');
                }
            } catch (error) {
                showNotification('Network error.', 'error');
            } finally {
                requestOtpBtn.disabled = false;
                if (requestOtpBtn.style.display !== 'none') requestOtpBtn.innerText = 'REQUEST SECURITY OTP';
            }
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            const otp = document.getElementById('pw-otp-input').value;
            const newPassword = document.getElementById('new-password-input').value;

            if (otp.length !== 6 || newPassword.length < 6) {
                return showNotification('Invalid OTP or Password (min 6 chars)', 'warning');
            }

            try {
                confirmBtn.disabled = true;
                confirmBtn.innerText = 'UPDATING...';

                const response = await fetch(`${API_URL}/users/me/change-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ otp, newPassword })
                });

                const data = await response.json();
                if (response.ok) {
                    showNotification('Password updated successfully!', 'success');
                    setTimeout(() => location.reload(), 1500);
                } else {
                    showNotification(data.message || 'Update failed', 'error');
                }
            } catch (error) {
                showNotification('Error updating password.', 'error');
            } finally {
                confirmBtn.disabled = false;
                confirmBtn.innerText = 'UPDATE PASSWORD';
            }
        });
    }

    // --- Countdown Timer & Loading Bar ---
    const targetDate = new Date('February 12, 2026 00:00:00').getTime();
    const startDate = new Date('February 1, 2026 00:00:00').getTime();
    const totalDuration = targetDate - startDate;

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        const elapsed = now - startDate;

        if (distance < 0) {
            clearInterval(timerInterval);
            const pct = document.getElementById('loading-pct');
            const fill = document.getElementById('loading-fill');
            if (pct) pct.innerText = '100%';
            if (fill) fill.style.width = '100%';
            return;
        }

        // Percentage Calculation
        const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        const pctEl = document.getElementById('loading-pct');
        const fillEl = document.getElementById('loading-fill');
        if (pctEl) pctEl.innerText = `${percentage.toFixed(1)}%`;
        if (fillEl) fillEl.style.width = `${percentage}%`;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update Hero Elements
        const setTime = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val.toString().padStart(2, '0');
        };

        setTime('days-hero', days);
        setTime('hours-hero', hours);
        setTime('minutes-hero', minutes);
        setTime('seconds-hero', seconds);
    };

    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- Cursor Tracking ---
    const cursor = document.querySelector('.cursor-laser');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
    }

    // --- Background Glitch Logic ---
    const glitchContainer = document.getElementById('letter-glitch');
    if (glitchContainer) {
        const canvas = document.createElement('canvas');
        glitchContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width, height;
        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}/\\|';
        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        const drops = new Array(columns).fill(1).map(() => Math.random() * height / fontSize);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#16a34a';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += 0.5;
            }
            requestAnimationFrame(draw);
        };
        draw();
    }
});
