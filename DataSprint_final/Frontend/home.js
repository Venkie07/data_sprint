document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'http://localhost:5000/api';
    let currentUser = null;

    // --- Core Session Verification & Initial Data Load ---
    const verifySession = async () => {
        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');

        if (!token || !userJson) {
            window.location.href = 'index.html';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Session invalid');

            const data = await response.json();
            currentUser = data.user;
            populateUI(currentUser);
        } catch (error) {
            console.error('Session error:', error);
            localStorage.clear();
            window.location.href = 'index.html';
        }
    };

    const populateUI = (user) => {
        // Nav & Summary
        const navName = document.getElementById('user-display-name');
        const displayTeamId = document.getElementById('display-team-id');
        const displayTeamName = document.getElementById('display-team-name');

        if (navName) navName.innerText = user.teamName.toUpperCase();
        if (displayTeamId) displayTeamId.innerText = user.id.split('-')[0].toUpperCase();
        if (displayTeamName) displayTeamName.innerText = user.teamName;

        // View Mode Spans
        document.getElementById('member-lead-name').innerText = user.name || '---';
        document.getElementById('member-lead-phone').innerText = user.phone || '---';
        document.getElementById('member-1-name').innerText = user.m1Name || '---';
        document.getElementById('member-2-name').innerText = user.m2Name || '---';
        document.getElementById('member-3-name').innerText = user.m3Name || '---';

        // Edit Mode Inputs
        document.getElementById('edit-lead-name').value = user.name || '';
        document.getElementById('edit-lead-phone').value = user.phone || '';
        document.getElementById('edit-m1-name').value = user.m1Name || '';
        document.getElementById('edit-m2-name').value = user.m2Name || '';
        document.getElementById('edit-m3-name').value = user.m3Name || '';

        // Admin Features
        const exportBtn = document.getElementById('export-db-btn');
        if (exportBtn && user.role === 'admin') {
            exportBtn.style.display = 'flex';
        }
    };

    // --- Profile Modal Logic ---
    const profileBtn = document.getElementById('profile-btn');
    const profileOverlay = document.getElementById('profile-overlay');
    const closeProfile = document.getElementById('close-profile');
    const teamSummaryTrigger = document.getElementById('team-summary-trigger');
    const teamDetailsBox = document.getElementById('team-details-box');

    if (profileBtn) profileBtn.addEventListener('click', () => profileOverlay.classList.add('active'));
    if (closeProfile) closeProfile.addEventListener('click', () => profileOverlay.classList.remove('active'));

    if (teamSummaryTrigger) {
        teamSummaryTrigger.addEventListener('click', () => {
            teamDetailsBox.classList.toggle('visible');
        });
    }

    // --- Edit Mode Toggling ---
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const viewMode = document.getElementById('profile-view-mode');
    const editMode = document.getElementById('profile-edit-mode');

    editBtn.addEventListener('click', () => {
        const isEditing = editMode.style.display === 'block';
        if (isEditing) {
            // Cancel edit
            editMode.style.display = 'none';
            viewMode.style.display = 'block';
            editBtn.innerText = 'EDIT_PROFILE';
            saveBtn.style.display = 'none';
        } else {
            // Enter edit mode
            editMode.style.display = 'block';
            viewMode.style.display = 'none';
            editBtn.innerText = 'CANCEL';
            saveBtn.style.display = 'inline-block';
        }
    });

    // --- Save Profile Changes ---
    saveBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        const payload = {
            name: document.getElementById('edit-lead-name').value,
            phone: document.getElementById('edit-lead-phone').value,
            m1Name: document.getElementById('edit-m1-name').value,
            m2Name: document.getElementById('edit-m2-name').value,
            m3Name: document.getElementById('edit-m3-name').value
        };

        try {
            saveBtn.innerText = 'SAVING...';
            const response = await fetch(`${API_URL}/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                populateUI(currentUser);
                localStorage.setItem('user', JSON.stringify(currentUser));

                // Exit edit mode
                editMode.style.display = 'none';
                viewMode.style.display = 'block';
                editBtn.innerText = 'EDIT_PROFILE';
                saveBtn.style.display = 'none';
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Connection error.');
        } finally {
            saveBtn.innerText = 'SAVE_CHANGES';
        }
    });

    // --- Password Change Logic ---
    const pwBox = document.getElementById('password-change-box');
    const pwResetBtn = document.getElementById('pw-reset-btn');
    const requestOtpBtn = document.getElementById('request-pw-otp-btn');
    const verifyOtpSection = document.getElementById('pw-otp-verify-box');
    const requestBtnBox = document.getElementById('pw-otp-request-box');
    const confirmChangeBtn = document.getElementById('confirm-pw-change-btn');

    pwResetBtn.addEventListener('click', () => {
        pwBox.style.display = pwBox.style.display === 'none' ? 'block' : 'none';
    });

    requestOtpBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        try {
            requestOtpBtn.innerText = 'SENDING...';
            const response = await fetch(`${API_URL}/users/me/request-password-otp`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                requestBtnBox.style.display = 'none';
                verifyOtpSection.style.display = 'block';
                alert('OTP sent to your email!');
            } else {
                alert('Failed to send OTP.');
            }
        } catch (error) {
            alert('Request failed.');
        } finally {
            requestOtpBtn.innerText = 'REQUEST_OTP';
        }
    });

    confirmChangeBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        const otp = document.getElementById('pw-otp-input').value;
        const newPassword = document.getElementById('new-pw-input').value;

        if (!otp || !newPassword) {
            alert('Please fill all fields.');
            return;
        }

        try {
            confirmChangeBtn.innerText = 'UPDATING...';
            const response = await fetch(`${API_URL}/users/me/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ otp, newPassword })
            });

            if (response.ok) {
                alert('Password changed! Please login again.');
                localStorage.clear();
                window.location.href = 'index.html';
            } else {
                const data = await response.json();
                alert(data.message || 'Verification failed.');
            }
        } catch (error) {
            alert('Update failed.');
        } finally {
            confirmChangeBtn.innerText = 'UPDATE_PASSWORD';
        }
    });

    // --- Logout ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // Initial load
    verifySession();
});
