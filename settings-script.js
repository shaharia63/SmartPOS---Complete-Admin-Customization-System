// ==========================================
// SmartPOS Admin Settings JavaScript
// ==========================================

// Default settings
const defaultSettings = {
    company: {
        name: 'Xyz Computers',
        email: 'admin@xyzcomputers.com',
        phone: '+1 234 567 8900',
        address: '123 Business St, City, Country',
        businessType: 'retail',
        currency: 'USD',
        taxRate: '18',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    functions: {
        dashboard: true,
        pos: true,
        inventory: true,
        customers: true,
        suppliers: true,
        sales: true,
        purchases: true,
        expenses: true,
        reports: true,
        backup: true
    },
    ui: {
        theme: 'light',
        layout: 'sidebar',
        animations: 'enabled'
    },
    system: {
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        language: 'en'
    }
};

// Current settings (loaded from localStorage or defaults)
let currentSettings = {};

// DOM elements
const saveBtn = document.getElementById('saveSettingsBtn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const logoUpload = document.getElementById('logoUpload');
const logoPreview = document.getElementById('logoPreview');
const saveModal = document.getElementById('saveModal');

// ==========================================
// Settings Management
// ==========================================

/**
 * Load settings from localStorage or use defaults
 */
function loadSettings() {
    try {
        const saved = localStorage.getItem('smartpos-settings');
        if (saved) {
            currentSettings = { ...defaultSettings, ...JSON.parse(saved) };
        } else {
            currentSettings = { ...defaultSettings };
        }
        console.log('Settings loaded:', currentSettings);
    } catch (error) {
        console.error('Error loading settings:', error);
        currentSettings = { ...defaultSettings };
    }
    populateFormFields();
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
    try {
        collectFormData();
        localStorage.setItem('smartpos-settings', JSON.stringify(currentSettings));
        console.log('Settings saved:', currentSettings);
        showSaveSuccess();
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Error saving settings. Please try again.', 'error');
        return false;
    }
}

/**
 * Collect data from form fields
 */
function collectFormData() {
    // Company settings
    currentSettings.company = {
        name: document.getElementById('companyName').value,
        email: document.getElementById('companyEmail').value,
        phone: document.getElementById('companyPhone').value,
        address: document.getElementById('companyAddress').value,
        businessType: document.getElementById('businessType').value,
        currency: document.getElementById('currency').value,
        taxRate: document.getElementById('taxRate').value,
        timezone: document.getElementById('timezone').value || defaultSettings.company.timezone
    };
    
    // Function settings
    const functionItems = document.querySelectorAll('.function-item');
    currentSettings.functions = {};
    functionItems.forEach(item => {
        const functionName = item.querySelector('.function-name').textContent.toLowerCase().replace(/\s+/g, '');
        const checkbox = item.querySelector('input[type="checkbox"]');
        currentSettings.functions[functionName] = checkbox.checked;
    });
    
    // UI settings
    currentSettings.ui = {
        theme: document.getElementById('theme').value,
        layout: document.getElementById('layout').value,
        animations: document.getElementById('animations').value
    };
    
    // System settings
    currentSettings.system = {
        timezone: document.getElementById('timezone').value,
        dateFormat: document.getElementById('dateFormat').value,
        language: document.getElementById('language').value
    };
}

/**
 * Populate form fields with current settings
 */
function populateFormFields() {
    // Company settings
    if (currentSettings.company) {
        document.getElementById('companyName').value = currentSettings.company.name || '';
        document.getElementById('companyEmail').value = currentSettings.company.email || '';
        document.getElementById('companyPhone').value = currentSettings.company.phone || '';
        document.getElementById('companyAddress').value = currentSettings.company.address || '';
        document.getElementById('businessType').value = currentSettings.company.businessType || 'retail';
        document.getElementById('currency').value = currentSettings.company.currency || 'USD';
        document.getElementById('taxRate').value = currentSettings.company.taxRate || '18';
    }
    
    // Function settings
    if (currentSettings.functions) {
        const functionItems = document.querySelectorAll('.function-item');
        functionItems.forEach(item => {
            const functionName = item.querySelector('.function-name').textContent.toLowerCase().replace(/\s+/g, '');
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (currentSettings.functions.hasOwnProperty(functionName)) {
                checkbox.checked = currentSettings.functions[functionName];
            }
        });
    }
    
    // UI settings
    if (currentSettings.ui) {
        document.getElementById('theme').value = currentSettings.ui.theme || 'light';
        document.getElementById('layout').value = currentSettings.ui.layout || 'sidebar';
        document.getElementById('animations').value = currentSettings.ui.animations || 'enabled';
    }
    
    // System settings
    if (currentSettings.system) {
        document.getElementById('timezone').value = currentSettings.system.timezone || 'UTC';
        document.getElementById('dateFormat').value = currentSettings.system.dateFormat || 'MM/DD/YYYY';
        document.getElementById('language').value = currentSettings.system.language || 'en';
    }
}

// ==========================================
// Tab Management
// ==========================================

/**
 * Switch to specified tab
 * @param {string} tabName - Tab to switch to
 */
function switchTab(tabName) {
    // Update tab buttons
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        }
    });
    
    console.log(`Switched to ${tabName} tab`);
}

// Tab button event listeners
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        switchTab(tabName);
    });
});

// ==========================================
// Logo Management
// ==========================================

/**
 * Handle logo upload
 */
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('File size must be less than 2MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const logoPreview = document.getElementById('logoPreview');
        logoPreview.innerHTML = `
            <img src="${e.target.result}" alt="Company Logo" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        `;
        logoPreview.style.background = 'white';
        logoPreview.style.border = '2px solid #e2e8f0';
        
        // Store logo data
        currentSettings.company.logo = e.target.result;
        showNotification('Logo uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
}

// ==========================================
// Export/Import Settings
// ==========================================

/**
 * Export settings to JSON file
 */
function exportSettings() {
    try {
        collectFormData();
        const dataStr = JSON.stringify(currentSettings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `smartpos-settings-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showNotification('Settings exported successfully', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting settings', 'error');
    }
}

/**
 * Import settings from JSON file
 * @param {Event} event - File input change event
 */
function importSettings(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedSettings = JSON.parse(e.target.result);
            currentSettings = { ...defaultSettings, ...importedSettings };
            populateFormFields();
            showNotification('Settings imported successfully', 'success');
        } catch (error) {
            console.error('Import error:', error);
            showNotification('Error importing settings. Invalid file format.', 'error');
        }
    };
    reader.readAsText(file);
}

/**
 * Reset to default settings
 */
function resetToDefaults() {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
        currentSettings = { ...defaultSettings };
        populateFormFields();
        showNotification('Settings reset to defaults', 'success');
    }
}

// ==========================================
// UI Interactions
// ==========================================

/**
 * Initialize toggle switches
 */
function initializeToggles() {
    const toggles = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const functionName = toggle.closest('.function-item').querySelector('.function-name').textContent;
            showNotification(`${functionName} ${toggle.checked ? 'enabled' : 'disabled'}`, 'info', 1500);
        });
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const inputs = document.querySelectorAll('.settings-input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

/**
 * Validate individual field
 * @param {Event} event - Input blur event
 */
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Basic validation rules
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
    } else if (field.type === 'number' && value && (isNaN(value) || value < 0 || value > 100)) {
        showFieldError(field, 'Please enter a valid number between 0 and 100');
    }
}

/**
 * Show field error
 * @param {Element} field - Input field
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px;';
    field.parentNode.appendChild(errorDiv);
}

/**
 * Clear field error
 */
function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
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

// ==========================================
// Notifications
// ==========================================

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (info, success, warning, error)
 * @param {number} duration - Duration in ms
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    // Set background color based on type
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
    `;
    closeBtn.onclick = () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    };
}

/**
 * Show save success modal
 */
function showSaveSuccess() {
    const modal = document.getElementById('saveModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 100);
    }
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.getElementById('saveModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// ==========================================
// Event Listeners
// ==========================================

// Save button
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        collectFormData();
        if (saveSettings()) {
            showSaveSuccess();
        }
    });
}

// Logo upload
if (logoUpload) {
    logoUpload.addEventListener('change', handleLogoUpload);
}

// Logo preview click
if (logoPreview) {
    logoPreview.addEventListener('click', () => {
        logoUpload.click();
    });
}

// Export/Import buttons
const exportBtn = document.querySelector('[onclick="exportSettings()"]');
if (exportBtn) {
    exportBtn.onclick = exportSettings;
}

const importBtn = document.querySelector('[onclick="importSettings(event)"]');
if (importBtn) {
    importBtn.onclick = (event) => importSettings(event);
}

// Reset button
const resetBtn = document.querySelector('[onclick="resetToDefaults()"]');
if (resetBtn) {
    resetBtn.onclick = resetToDefaults;
}

// Modal close
window.closeModal = closeModal;

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        collectFormData();
        if (saveSettings()) {
            showSaveSuccess();
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ==========================================
// Page Load Initialization
// ==========================================

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('SmartPOS Admin Settings initialized');
    
    // Load settings
    loadSettings();
    
    // Initialize UI components
    initializeToggles();
    initializeFormValidation();
    
    // Set default tab
    switchTab('company');
    
    console.log('Settings page ready');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh settings when page becomes visible
        loadSettings();
    }
});

// Export functions for external use
window.SmartPOSSettings = {
    loadSettings,
    saveSettings,
    switchTab,
    exportSettings,
    importSettings,
    resetToDefaults,
    showNotification
};