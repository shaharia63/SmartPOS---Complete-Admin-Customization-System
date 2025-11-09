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
    
    // In a real application, you would redirect to the dashboard
    setTimeout(() => {
        showMessage(`Redirecting to ${userData.role} dashboard...`, 'success', 1500);
        
        // Redirect to dashboard
        setTimeout(() => {
            console.log('Login successful:', userData);
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
    
    // Make demo items focusable
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Use demo credentials for ${item.dataset.role}`);
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

// Real-time validation
emailInput.addEventListener('input', () => {
    if (emailInput.value.trim()) {
        emailInput.classList.remove('error');
        emailInput.setAttribute('aria-invalid', 'false');
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.trim()) {
        passwordInput.classList.remove('error');
        passwordInput.setAttribute('aria-invalid', 'false');
    }
});

// Forgot password handler
document.querySelector('.forgot-link').addEventListener('click', (e) => {
    e.preventDefault();
    showMessage('Password reset functionality would be implemented here.', 'success');
});

// ==========================================
// Accessibility Enhancements
// ==========================================

// Add ARIA labels and descriptions
emailInput.setAttribute('aria-describedby', 'email-error');
passwordInput.setAttribute('aria-describedby', 'password-error');

// Create error message elements (hidden by default)
const emailError = document.createElement('div');
emailError.id = 'email-error';
emailError.className = 'error-message';
emailError.style.cssText = 'color: var(--error-500); font-size: 12px; margin-top: 4px; display: none;';

const passwordError = document.createElement('div');
passwordError.id = 'password-error';
passwordError.className = 'error-message';
passwordError.style.cssText = 'color: var(--error-500); font-size: 12px; margin-top: 4px; display: none;';

emailInput.parentNode.appendChild(emailError);
passwordInput.parentNode.appendChild(passwordError);

// Update error message display
function updateErrorDisplay() {
    const validation = validateForm();
    
    if (validation.errors.email) {
        emailError.textContent = validation.errors.email;
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
    
    if (validation.errors.password) {
        passwordError.textContent = validation.errors.password;
        passwordError.style.display = 'block';
    } else {
        passwordError.style.display = 'none';
    }
}

// Update error display on input
emailInput.addEventListener('blur', updateErrorDisplay);
passwordInput.addEventListener('blur', updateErrorDisplay);

// ==========================================
// Keyboard Shortcuts
// ==========================================

// Press Enter on demo items to auto-fill
document.addEventListener('keydown', (e) => {
    // Alt + 1, 2, 3 for quick demo login
    if (e.altKey) {
        switch(e.key) {
            case '1':
                autoFillForm(demoCredentials.admin);
                break;
            case '2':
                autoFillForm(demoCredentials.cashier);
                break;
            case '3':
                autoFillForm(demoCredentials.salesman);
                break;
        }
    }
});

// ==========================================
// Page Load Initialization
// ==========================================

// Add loading state management
window.addEventListener('load', () => {
    // Remove any loading states
    document.body.classList.add('loaded');
    
    // Focus on email input for better UX
    setTimeout(() => {
        emailInput.focus();
    }, 500);
});

// Add CSS for success fill animation
const style = document.createElement('style');
style.textContent = `
    .success-fill {
        animation: successFill 0.3s ease-out;
    }
    
    @keyframes successFill {
        0% { background-color: var(--bg-surface); }
        50% { background-color: var(--primary-100); }
        100% { background-color: var(--bg-surface); }
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease-in;
    }
`;
document.head.appendChild(style);

console.log('Smart POS Login System loaded successfully!');
console.log('Demo shortcuts: Alt+1 (Admin), Alt+2 (Cashier), Alt+3 (Salesman)');