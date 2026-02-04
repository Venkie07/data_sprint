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

    // Reuse background glitch logic from script.js if needed or keep it simple.
    // For now, let's just make it functional.
});
