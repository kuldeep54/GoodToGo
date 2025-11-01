// Professional Authentication System
class AuthenticationManager {
    constructor() {
        this.currentUser = this.loadUser();
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.passwordStrengthRegex = {
            weak: /^.{1,5}$/,
            medium: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
            strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
        };
        this.createTestUser();
        this.init();
    }

    createTestUser() {
        // Create a test user for easy testing
        const users = JSON.parse(localStorage.getItem('goodtogo-users') || '[]');
        const testUserExists = users.find(u => u.email === 'test@goodtogo.com');
        
        if (!testUserExists) {
            const testUser = {
                id: 'test-user-1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@goodtogo.com',
                password: this.hashPassword('Test123!'),
                verified: true,
                newsletter: false,
                createdAt: new Date().toISOString()
            };
            
            users.push(testUser);
            localStorage.setItem('goodtogo-users', JSON.stringify(users));
        }
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAuth();
            });
        } else {
            this.setupAuth();
        }
    }

    setupAuth() {
        this.createAuthModals();
        this.setupEventListeners();
        this.updateAuthUI();
        this.startSessionTimer();
    }

    createAuthModals() {
        // Enhanced Login Modal
        const loginModal = `
            <div id="login-modal" class="auth-modal">
                <div class="auth-modal-content">
                    <div class="auth-header">
                        <h2>Welcome Back</h2>
                        <p>Sign in to your account</p>
                        <span class="close-auth-modal">&times;</span>
                    </div>
                    <form id="login-form" class="auth-form">
                        <div class="form-group">
                            <label for="login-email">Email Address</label>
                            <div class="input-wrapper">
                                <i class="ri-mail-line"></i>
                                <input type="email" id="login-email" placeholder="Enter your email" required>
                            </div>
                            <span class="error-message" id="login-email-error"></span>
                        </div>
                        
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <div class="input-wrapper">
                                <i class="ri-lock-line"></i>
                                <input type="password" id="login-password" placeholder="Enter your password" required>
                                <button type="button" class="toggle-password" data-target="login-password">
                                    <i class="ri-eye-line"></i>
                                </button>
                            </div>
                            <span class="error-message" id="login-password-error"></span>
                        </div>
                        
                        <div class="form-options">
                            <label class="checkbox-label">
                                <input type="checkbox" id="remember-me">
                                <span class="checkmark"></span>
                                Remember me
                            </label>
                            <a href="#" class="forgot-password">Forgot password?</a>
                        </div>
                        
                        <button type="submit" class="auth-btn primary" id="login-submit">
                            <span class="btn-text">Sign In</span>
                            <div class="btn-loader"></div>
                        </button>
                        
                        <div class="auth-divider">
                            <span>or continue with</span>
                        </div>
                        
                        <div class="social-auth">
                            <button type="button" class="social-btn google">
                                <i class="ri-google-fill"></i>
                                Google
                            </button>
                            <button type="button" class="social-btn facebook">
                                <i class="ri-facebook-fill"></i>
                                Facebook
                            </button>
                        </div>
                        
                        <p class="auth-switch">
                            Don't have an account? 
                            <a href="#" id="show-register">Create one</a>
                        </p>
                    </form>
                </div>
            </div>
        `;

        // Enhanced Register Modal
        const registerModal = `
            <div id="register-modal" class="auth-modal">
                <div class="auth-modal-content">
                    <div class="auth-header">
                        <h2>Create Account</h2>
                        <p>Join us today</p>
                        <span class="close-auth-modal">&times;</span>
                    </div>
                    <form id="register-form" class="auth-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="register-firstname">First Name</label>
                                <div class="input-wrapper">
                                    <i class="ri-user-line"></i>
                                    <input type="text" id="register-firstname" placeholder="First name" required>
                                </div>
                                <span class="error-message" id="register-firstname-error"></span>
                            </div>
                            
                            <div class="form-group">
                                <label for="register-lastname">Last Name</label>
                                <div class="input-wrapper">
                                    <i class="ri-user-line"></i>
                                    <input type="text" id="register-lastname" placeholder="Last name" required>
                                </div>
                                <span class="error-message" id="register-lastname-error"></span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="register-email">Email Address</label>
                            <div class="input-wrapper">
                                <i class="ri-mail-line"></i>
                                <input type="email" id="register-email" placeholder="Enter your email" required>
                            </div>
                            <span class="error-message" id="register-email-error"></span>
                        </div>
                        
                        <div class="form-group">
                            <label for="register-password">Password</label>
                            <div class="input-wrapper">
                                <i class="ri-lock-line"></i>
                                <input type="password" id="register-password" placeholder="Create a password" required>
                                <button type="button" class="toggle-password" data-target="register-password">
                                    <i class="ri-eye-line"></i>
                                </button>
                            </div>
                            <div class="password-strength">
                                <div class="strength-bar">
                                    <div class="strength-fill"></div>
                                </div>
                                <span class="strength-text">Password strength</span>
                            </div>
                            <span class="error-message" id="register-password-error"></span>
                        </div>
                        
                        <div class="form-group">
                            <label for="register-confirm-password">Confirm Password</label>
                            <div class="input-wrapper">
                                <i class="ri-lock-line"></i>
                                <input type="password" id="register-confirm-password" placeholder="Confirm your password" required>
                            </div>
                            <span class="error-message" id="register-confirm-password-error"></span>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="agree-terms" required>
                                <span class="checkmark"></span>
                                I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="privacy-link">Privacy Policy</a>
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="newsletter-signup">
                                <span class="checkmark"></span>
                                Subscribe to our newsletter for updates and offers
                            </label>
                        </div>
                        
                        <button type="submit" class="auth-btn primary" id="register-submit">
                            <span class="btn-text">Create Account</span>
                            <div class="btn-loader"></div>
                        </button>
                        
                        <div class="auth-divider">
                            <span>or continue with</span>
                        </div>
                        
                        <div class="social-auth">
                            <button type="button" class="social-btn google">
                                <i class="ri-google-fill"></i>
                                Google
                            </button>
                            <button type="button" class="social-btn facebook">
                                <i class="ri-facebook-fill"></i>
                                Facebook
                            </button>
                        </div>
                        
                        <p class="auth-switch">
                            Already have an account? 
                            <a href="#" id="show-login">Sign in</a>
                        </p>
                    </form>
                </div>
            </div>
        `;

        // Email Verification Modal
        const verificationModal = `
            <div id="verification-modal" class="auth-modal">
                <div class="verification-modal-content">
                    <div class="verification-header">
                        <h2>Verify Your Email</h2>
                        <p>We've sent a 6-digit code to <strong id="verification-email"></strong></p>
                        <div class="demo-notice">
                            <i class="ri-information-line"></i>
                            <span><strong>Demo Mode:</strong> This is a simulation. Enter any 6 digits to continue.</span>
                        </div>
                    </div>
                    <form id="verification-form">
                        <div class="code-inputs">
                            <input type="text" class="code-digit" maxlength="1" data-index="0">
                            <input type="text" class="code-digit" maxlength="1" data-index="1">
                            <input type="text" class="code-digit" maxlength="1" data-index="2">
                            <input type="text" class="code-digit" maxlength="1" data-index="3">
                            <input type="text" class="code-digit" maxlength="1" data-index="4">
                            <input type="text" class="code-digit" maxlength="1" data-index="5">
                        </div>
                        <div class="verification-actions">
                            <button type="submit" class="verify-btn">Verify Email</button>
                            <button type="button" class="resend-btn" onclick="auth.resendCode()">
                                <i class="ri-refresh-line"></i>
                                Resend Code
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add modals to body
        document.body.insertAdjacentHTML('beforeend', loginModal);
        document.body.insertAdjacentHTML('beforeend', registerModal);
        document.body.insertAdjacentHTML('beforeend', verificationModal);
    }

    setupEventListeners() {
        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-auth-modal') || 
                e.target.classList.contains('auth-modal')) {
                this.closeAllModals();
            }
        });

        // Show modals - use setTimeout to ensure elements exist
        setTimeout(() => {
            const loginBtn = document.getElementById('login-btn');
            const registerBtn = document.getElementById('register-btn');
            const showRegisterBtn = document.getElementById('show-register');
            const showLoginBtn = document.getElementById('show-login');
            const logoutBtn = document.getElementById('logout-btn');

            if (loginBtn) loginBtn.addEventListener('click', () => this.showModal('login-modal'));
            if (registerBtn) registerBtn.addEventListener('click', () => this.showModal('register-modal'));
            if (showRegisterBtn) showRegisterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('register-modal');
            });
            if (showLoginBtn) showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('login-modal');
            });
            if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
        }, 100);

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'login-form') {
                e.preventDefault();
                this.handleLogin(e);
            } else if (e.target.id === 'register-form') {
                e.preventDefault();
                this.handleRegister(e);
            } else if (e.target.id === 'verification-form') {
                e.preventDefault();
                this.handleVerification(e);
            }
        });

        // Password toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.toggle-password')) {
                this.togglePasswordVisibility(e.target.closest('.toggle-password'));
            }
        });

        // Password strength checker
        document.addEventListener('input', (e) => {
            if (e.target.id === 'register-password') {
                this.checkPasswordStrength(e.target.value);
            }
        });

        // Verification code input
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('code-digit')) {
                const index = parseInt(e.target.dataset.index);
                this.handleCodeInput(e, index);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('code-digit')) {
                const index = parseInt(e.target.dataset.index);
                this.handleCodeKeydown(e, index);
            }
        });

        // Social auth buttons (simulation)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.social-btn')) {
                this.handleSocialAuth(e);
            }
        });
    }

    showModal(modalId) {
        this.closeAllModals();
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
        document.body.style.overflow = 'auto';
    }

    showLogin() {
        this.showModal('login-modal');
        // Focus first input
        setTimeout(() => {
            document.getElementById('login-email').focus();
        }, 100);
    }

    showRegister() {
        this.showModal('register-modal');
        // Focus first input
        setTimeout(() => {
            document.getElementById('register-firstname').focus();
        }, 100);
    }

    showVerification(email) {
        this.showModal('verification-modal');
        document.getElementById('verification-email').textContent = email;
        // Focus first code input
        setTimeout(() => {
            document.querySelector('.code-digit').focus();
        }, 100);
        // Start resend countdown
        this.startResendCountdown();
    }

    closeAllModals() {
        document.querySelectorAll('.auth-modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
        this.clearErrors();
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('login-submit');
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        this.clearErrors();
        
        // Validation
        if (!this.validateEmail(email)) {
            this.showError('login-email-error', 'Please enter a valid email address');
            return;
        }
        
        if (!password) {
            this.showError('login-password-error', 'Password is required');
            return;
        }
        
        // Show loading
        this.setButtonLoading(submitBtn, true);
        
        // Simulate API call
        await this.delay(1500);
        
        // Check credentials
        const users = JSON.parse(localStorage.getItem('goodtogo-users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) {
            this.showError('login-email-error', 'No account found with this email');
            this.setButtonLoading(submitBtn, false);
            return;
        }
        
        if (user.password !== this.hashPassword(password)) {
            this.showError('login-password-error', 'Incorrect password');
            this.setButtonLoading(submitBtn, false);
            return;
        }
        
        if (!user.verified) {
            this.showError('login-email-error', 'Please verify your email first');
            this.setButtonLoading(submitBtn, false);
            return;
        }
        
        // Success
        this.currentUser = user;
        this.saveUser();
        this.setButtonLoading(submitBtn, false);
        this.closeAllModals();
        this.updateAuthUI();
        this.showSuccessMessage('Welcome back!');
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('register-submit');
        const formData = {
            firstName: document.getElementById('register-firstname').value,
            lastName: document.getElementById('register-lastname').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value,
            confirmPassword: document.getElementById('register-confirm-password').value,
            agreeTerms: document.getElementById('agree-terms').checked,
            newsletter: document.getElementById('newsletter-signup').checked
        };
        
        this.clearErrors();
        
        // Validation
        if (!formData.firstName.trim()) {
            this.showError('register-firstname-error', 'First name is required');
            return;
        }
        
        if (!formData.lastName.trim()) {
            this.showError('register-lastname-error', 'Last name is required');
            return;
        }
        
        if (!this.validateEmail(formData.email)) {
            this.showError('register-email-error', 'Please enter a valid email address');
            return;
        }
        
        if (!this.isPasswordStrong(formData.password)) {
            this.showError('register-password-error', 'Password must be at least 8 characters with uppercase, lowercase, number and special character');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            this.showError('register-confirm-password-error', 'Passwords do not match');
            return;
        }
        
        if (!formData.agreeTerms) {
            this.showError('register-confirm-password-error', 'You must agree to the terms and conditions');
            return;
        }
        
        // Check if email exists
        const users = JSON.parse(localStorage.getItem('goodtogo-users') || '[]');
        if (users.find(u => u.email === formData.email)) {
            this.showError('register-email-error', 'An account with this email already exists');
            return;
        }
        
        // Show loading
        this.setButtonLoading(submitBtn, true);
        
        // Simulate API call
        await this.delay(2000);
        
        // Create user
        const newUser = {
            id: Date.now().toString(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: this.hashPassword(formData.password),
            verified: false,
            newsletter: formData.newsletter,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('goodtogo-users', JSON.stringify(users));
        
        this.setButtonLoading(submitBtn, false);
        this.showVerification(formData.email);
    }

    async handleVerification(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('.verify-btn');
        const code = Array.from(document.querySelectorAll('.code-digit'))
            .map(input => input.value)
            .join('');
        
        if (code.length !== 6) {
            this.showError('verification-form', 'Please enter the complete verification code');
            return;
        }
        
        this.setButtonLoading(submitBtn, true);
        
        // Simulate verification
        await this.delay(1500);
        
        // Mark user as verified
        const users = JSON.parse(localStorage.getItem('goodtogo-users') || '[]');
        const userIndex = users.findIndex(u => u.email === document.getElementById('verification-email').textContent);
        
        if (userIndex !== -1) {
            users[userIndex].verified = true;
            localStorage.setItem('goodtogo-users', JSON.stringify(users));
            
            this.currentUser = users[userIndex];
            this.saveUser();
        }
        
        this.setButtonLoading(submitBtn, false);
        this.closeAllModals();
        this.updateAuthUI();
        this.showSuccessMessage('Account verified successfully! Welcome to GoodTOGO!');
    }

    handleSocialAuth(e) {
        const provider = e.target.closest('.social-btn').classList.contains('google') ? 'Google' : 'Facebook';
        this.showInfoMessage(`${provider} authentication would redirect to ${provider} in a real application`);
    }

    togglePasswordVisibility(button) {
        const targetId = button.dataset.target;
        const input = document.getElementById(targetId);
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'ri-eye-off-line';
        } else {
            input.type = 'password';
            icon.className = 'ri-eye-line';
        }
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        let strength = 'weak';
        let width = '25%';
        let color = '#ff4757';
        
        if (this.passwordStrengthRegex.strong.test(password)) {
            strength = 'strong';
            width = '100%';
            color = '#2ed573';
        } else if (this.passwordStrengthRegex.medium.test(password)) {
            strength = 'medium';
            width = '60%';
            color = '#ffa502';
        }
        
        strengthBar.style.width = width;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = `Password strength: ${strength}`;
        strengthText.style.color = color;
    }

    isPasswordStrong(password) {
        return this.passwordStrengthRegex.strong.test(password);
    }

    handleCodeInput(e, index) {
        const value = e.target.value;
        
        if (value && index < 5) {
            document.querySelector(`[data-index="${index + 1}"]`).focus();
        }
    }

    handleCodeKeydown(e, index) {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            document.querySelector(`[data-index="${index - 1}"]`).focus();
        }
    }

    startResendCountdown() {
        const resendBtn = document.getElementById('resend-code');
        const countdown = resendBtn.querySelector('.countdown');
        let seconds = 60;
        
        resendBtn.disabled = true;
        
        const timer = setInterval(() => {
            countdown.textContent = `(${seconds}s)`;
            seconds--;
            
            if (seconds < 0) {
                clearInterval(timer);
                countdown.textContent = '';
                resendBtn.disabled = false;
            }
        }, 1000);
    }

    setButtonLoading(button, loading) {
        const text = button.querySelector('.btn-text');
        const loader = button.querySelector('.btn-loader');
        
        if (loading) {
            text.style.opacity = '0';
            loader.style.display = 'block';
            button.disabled = true;
        } else {
            text.style.opacity = '1';
            loader.style.display = 'none';
            button.disabled = false;
        }
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    hashPassword(password) {
        // Simple hash for demo (use proper hashing in production)
        return btoa(password + 'goodtogo-salt');
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
    }

    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    showInfoMessage(message) {
        this.showToast(message, 'info');
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 'ri-check-line' : 
                    type === 'error' ? 'ri-error-warning-line' : 'ri-information-line';
        
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    resendCode() {
        this.showToast('Demo: Verification code "resent" - enter any 6 digits', 'info');
    }

    updateAuthUI() {
        // Add small delay to ensure DOM is ready
        setTimeout(() => {
            const loginBtn = document.getElementById('login-btn');
            const registerBtn = document.getElementById('register-btn');
            const authButtons = document.querySelector('.auth-buttons');
            const userMenu = document.getElementById('user-menu');
            const userName = document.getElementById('user-name');
            
            if (this.currentUser && this.currentUser.verified) {
                // Hide auth buttons
                if (authButtons) {
                    authButtons.style.display = 'none';
                }
                
                // Show user menu
                if (userMenu) {
                    userMenu.style.display = 'flex';
                    if (userName) {
                        userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
                    }
                }
            } else {
                // Show auth buttons
                if (authButtons) {
                    authButtons.style.display = 'flex';
                }
                
                // Hide user menu
                if (userMenu) {
                    userMenu.style.display = 'none';
                }
            }
        }, 50);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('goodtogo-user');
        this.updateAuthUI();
        this.showSuccessMessage('Logged out successfully');
        
        // Reload page to reset all states
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    loadUser() {
        const userData = localStorage.getItem('goodtogo-user');
        return userData ? JSON.parse(userData) : null;
    }

    saveUser() {
        if (this.currentUser) {
            localStorage.setItem('goodtogo-user', JSON.stringify(this.currentUser));
        }
    }

    startSessionTimer() {
        if (this.currentUser) {
            setTimeout(() => {
                this.showInfoMessage('Your session has expired. Please log in again.');
                this.logout();
            }, this.sessionTimeout);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async login(email, password) {
        const loginButton = document.querySelector('#login-form button[type="submit"]');
        LoadingManager.showButtonLoading(loginButton);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Demo login - check for test user
            if (email === 'test@goodtogo.com' && password === 'Test123!') {
                const user = {
                    id: 'test-user-1',
                    email: 'test@goodtogo.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                    joinDate: new Date().toISOString(),
                    verified: true
                };

                this.currentUser = user;
                localStorage.setItem('goodtogo-user', JSON.stringify(user));
                this.updateAuthUI();
                this.hideModal('login-modal');
                
                AnimationUtils.addSuccessState(loginButton);
                this.showToast('Welcome back! Login successful.', 'success');
                
                LoadingManager.hideButtonLoading(loginButton);
                return { success: true, user };
            } else {
                LoadingManager.hideButtonLoading(loginButton);
                AnimationUtils.addErrorState(loginButton);
                this.showToast('Invalid email or password. Try test@goodtogo.com / Test123!', 'error');
                return { success: false, error: 'Invalid credentials' };
            }
        } catch (error) {
            LoadingManager.hideButtonLoading(loginButton);
            AnimationUtils.addErrorState(loginButton);
            this.showToast('Login failed. Please try again.', 'error');
            return { success: false, error: error.message };
        }
    }

    async register(userData) {
        const registerButton = document.querySelector('#register-form button[type="submit"]');
        LoadingManager.showButtonLoading(registerButton);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        try {
            // Demo registration
            const user = {
                id: 'user-' + Date.now(),
                ...userData,
                avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
                joinDate: new Date().toISOString(),
                verified: false
            };

            // Store user data
            localStorage.setItem('goodtogo-pending-user', JSON.stringify(user));
            
            LoadingManager.hideButtonLoading(registerButton);
            AnimationUtils.addSuccessState(registerButton);
            
            this.hideModal('register-modal');
            this.showModal('email-verification-modal');
            this.showToast('Registration successful! Please verify your email.', 'success');
            
            return { success: true, user };
        } catch (error) {
            LoadingManager.hideButtonLoading(registerButton);
            AnimationUtils.addErrorState(registerButton);
            this.showToast('Registration failed. Please try again.', 'error');
            return { success: false, error: error.message };
        }
    }

    async verifyEmail(code) {
        const verifyButton = document.querySelector('#verify-email-form button[type="submit"]');
        LoadingManager.showButtonLoading(verifyButton);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Demo verification (accept any 6-digit code)
            if (code.length === 6 && /^\d+$/.test(code)) {
                const pendingUser = JSON.parse(localStorage.getItem('goodtogo-pending-user'));
                if (pendingUser) {
                    pendingUser.verified = true;
                    this.currentUser = pendingUser;
                    
                    localStorage.setItem('goodtogo-user', JSON.stringify(pendingUser));
                    localStorage.removeItem('goodtogo-pending-user');
                    
                    this.updateAuthUI();
                    this.hideModal('email-verification-modal');
                    
                    LoadingManager.hideButtonLoading(verifyButton);
                    AnimationUtils.addSuccessState(verifyButton);
                    this.showToast('Email verified successfully! Welcome to GoodTOGO!', 'success');
                    
                    return { success: true };
                }
            }
            
            LoadingManager.hideButtonLoading(verifyButton);
            AnimationUtils.addErrorState(verifyButton);
            this.showToast('Invalid verification code. Please try again.', 'error');
            return { success: false, error: 'Invalid code' };
        } catch (error) {
            LoadingManager.hideButtonLoading(verifyButton);
            AnimationUtils.addErrorState(verifyButton);
            this.showToast('Verification failed. Please try again.', 'error');
            return { success: false, error: error.message };
        }
    }
}

// Initialize authentication system
const auth = new AuthenticationManager();

class LoadingManager {
    static showButtonLoading(button) {
        const text = button.querySelector('.btn-text');
        const loader = button.querySelector('.btn-loader');
        
        text.style.opacity = '0';
        loader.style.display = 'block';
        button.disabled = true;
    }

    static hideButtonLoading(button) {
        const text = button.querySelector('.btn-text');
        const loader = button.querySelector('.btn-loader');
        
        text.style.opacity = '1';
        loader.style.display = 'none';
        button.disabled = false;
    }
}

class AnimationUtils {
    static addSuccessState(button) {
        button.classList.add('success-state');
        setTimeout(() => button.classList.remove('success-state'), 2000);
    }

    static addErrorState(button) {
        button.classList.add('error-state');
        setTimeout(() => button.classList.remove('error-state'), 2000);
    }
}
