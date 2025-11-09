// ==========================================
// Smart POS Login System JavaScript
// ==========================================

// Demo credentials data
const demoCredentials = {
    admin: {
        email: 'admin@admin.com',
        password: '12345678',
        role: 'Admin'
    },
    cashier: {
        email: 'cashier@cashier.com',
        password: '12345678',
        role: 'Cashier'
    },
    salesman: {
        email: 'sales@salesman.com',
        password: '12345678',
        role: 'Salesman'
    }
};

// DOM elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageDisplay = document.getElementById('messageDisplay');
const messageContent = document.getElementById('messageContent');
const demoItems = document.querySelectorAll('.demo-item');

// ==========================================
// Utility Functions
// ==========================================

/**
 * Show a temporary message to the user
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showMessage(message, type = 'success', duration = 3000) {
    messageContent.textContent = message;
    messageContent.className = `message-content ${type}`;
    messageDisplay.style.display = 'block';

    // Auto-hide after duration
    setTimeout(() => {
        messageDisplay.style.display = 'none';
    }, duration);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Auto-fill form with demo credentials
 * @param {Object} credentials - Demo credentials object
 */
function autoFillForm(credentials) {
    emailInput.value = credentials.email;
    passwordInput.value = credentials.password;
    
    // Add visual feedback
    emailInput.classList.add('success-fill');
    passwordInput.classList.add('success-fill');
    
    // Remove visual feedback after animation
    setTimeout(() => {
        emailInput.classList.remove('success-fill');
        passwordInput.classList.remove('success-fill');
    }, 1000);
    
    showMessage(`Demo credentials loaded for ${credentials.role}`, 'success', 2000);
}

/**
 * Clear form validation states
 */
function clearValidationStates() {
    emailInput.classList.remove('error');
    passwordInput.classList.remove('error');
}

/**
 * Validate form inputs
 * @returns {Object} Validation result
 */
function validateForm() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    const errors = {};
    
    if (!email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Display validation errors
 * @param {Object} errors - Validation errors object
 */
function displayValidationErrors(errors) {
    if (errors.email) {
        emailInput.classList.add('error');
        emailInput.setAttribute('aria-invalid', 'true');
    } else {
        emailInput.classList.remove('error');
        emailInput.setAttribute('aria-invalid', 'false');
    }
    
    if (errors.password) {
        passwordInput.classList.add('error');
        passwordInput.setAttribute('aria-invalid', 'true');
    } else {
        passwordInput.classList.remove('error');
        passwordInput.setAttribute('aria-invalid', 'false');
    }
}

/**
 * Simulate login process
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login result
 */
async function simulateLogin(email, password) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check against demo credentials
    const matchedCredential = Object.values(demoCredentials).find(
        cred => cred.email === email && cred.password === password
    );
    
    if (matchedCredential) {
        return {
            success: true,
            user: {
                email: matchedCredential.email,
                role: matchedCredential.role,
                name: matchedCredential.role === 'Admin' ? 'System Administrator' :
                      matchedCredential.role === 'Cashier' ? 'Store Cashier' : 'Sales Representative'
            }
        };
    }
    
    // Check if it's a valid email format for non-demo login
    if (isValidEmail(email) && password.length >= 6) {
        return {
            success: false,
            message: 'Invalid credentials. Please use demo credentials or contact your administrator.'
        };
    }
    
    return {
        success: false,
        message: 'Login failed. Please check your credentials and try again.'
    };
}

/**
 * Handle successful login
 * @param {Object} userData - User data from successful login
 */
function handleSuccessfulLogin(userData) {
    showMessage(`Welcome back, ${userData.name}!`, 'success', 2000);
    
    // Redirect to dashboard
    setTimeout(() => {
        showMessage(`Redirecting to ${userData.role} dashboard...`, 'success', 1500);
        
        // Redirect to dashboard
        setTimeout(() => {
            console.log('Login successful:', userData);
            console.log('Redirecting to dashboard...');
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1000);
}

// ==========================================
// Event Listeners
// ==========================================

// Demo credential click handlers
demoItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const role = item.dataset.role;
        const credentials = demoCredentials[role];
        
        if (credentials) {
            autoFillForm(credentials);
        }
    });
    
    // Add keyboard support
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const role = item.dataset.role;
            const credentials = demoCredentials[role];
            
            if (credentials) {
                autoFillForm(credentials);
            }
        }
    });
});

// Form submission handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous validation states
    clearValidationStates();
    
    // Validate form
    const validation = validateForm();
    
    if (!validation.isValid) {
        displayValidationErrors(validation.errors);
        
        // Show first error message
        const firstError = Object.values(validation.errors)[0];
        showMessage(firstError, 'error');
        return;
    }
    
    // Get form data
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Disable form during login
    const submitBtn = document.querySelector('.sign-in-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing In...';
    console.log('Starting login process for:', email);
    
    try {
        // Attempt login
        const result = await simulateLogin(email, password);
        
        if (result.success) {
            handleSuccessfulLogin(result.user);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('An unexpected error occurred. Please try again.', 'error');
    } finally {
        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
    }
});

// Input validation on blur
emailInput.addEventListener('blur', () => {
    const validation = validateForm();
    if (!validation.isValid && validation.errors.email) {
        emailInput.classList.add('error');
    } else {
        emailInput.classList.remove('error');
    }
});

passwordInput.addEventListener('blur', () => {
    const validation = validateForm();
    if (!validation.isValid && validation.errors.password) {
        passwordInput.classList.add('error');
    } else {
        passwordInput.classList.remove('error');
    }
});

// Clear errors on input
emailInput.addEventListener('input', () => {
    emailInput.classList.remove('error');
});

passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('error');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.activeElement.closest('#loginForm')) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        emailInput.value = '';
        passwordInput.value = '';
        clearValidationStates();
        showMessage('Form cleared', 'info', 1000);
    }
});

// ==========================================
// Page Load Initialization
// ==========================================

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Smart POS Login System initialized');
    
    // Focus on email input
    emailInput.focus();
    
    // Add loading states
    document.body.classList.add('loaded');
    
    // Pre-load demo credentials for easy testing
    console.log('Demo credentials available:', demoCredentials);
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Clear any timeouts when page becomes visible
        console.log('Page became visible, clearing any pending timeouts');
    }
});