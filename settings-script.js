// ==========================================
// Admin Settings JavaScript
// ==========================================

// Settings data structure
let settingsData = {
    company: {
        name: 'Xyz Computers',
        email: 'info@xyzcomputers.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Street, City, State 12345',
        type: 'retail',
        currency: 'USD',
        taxRate: 10,
        timezone: 'UTC'
    },
    branding: {
        logo: null,
        colors: {
            primary: '#0D6EFD',
            secondary: '#6C757D',
            success: '#198754',
            warning: '#FFC107'
        }
    },
    functions: {
        sales: { enabled: true, name: 'Sales', description: 'Manage sales transactions and invoices' },
        quotation: { enabled: true, name: 'Quotation', description: 'Create and manage customer quotes' },
        purchase: { enabled: true, name: 'Purchase', description: 'Manage purchase orders and inventory' },
        warranty: { enabled: true, name: 'Warranty', description: 'Track product warranties and returns' },
        customer: { enabled: true, name: 'Customer', description: 'Manage customer information and records' },
        supplier: { enabled: true, name: 'Supplier', description: 'Manage supplier information and contacts' },
        salesperson: { enabled: true, name: 'Sales Person', description: 'Track sales team performance' },
        product: { enabled: true, name: 'Product', description: 'Manage product catalog and inventory' },
        accounting: { enabled: true, name: 'Accounting', description: 'Financial management and reporting' },
        hrm: { enabled: false, name: 'HRM', description: 'Human resource management' },
        salary: { enabled: false, name: 'Salary', description: 'Payroll and salary management' },
        gst: { enabled: true, name: 'GST Report', description: 'Tax reporting and compliance' },
        loan: { enabled: false, name: 'Loan Management', description: 'Manage business loans and financing' },
        reports: { enabled: true, name: 'Reports', description: 'Business intelligence and analytics' },
        sms: { enabled: false, name: 'SMS & Email', description: 'Communication management' },
        usermanagement: { enabled: false, name: 'User Management', description: 'System user administration' },
        store: { enabled: true, name: 'Store Management', description: 'Multi-location store management' },
        settings: { enabled: true, name: 'Setting', description: 'System configuration and settings' },
        storechange: { enabled: true, name: 'Store Change', description: 'Switch between store locations' }
    },
    ui: {
        sidebarMode: 'auto',
        theme: 'light',
        dashboardLayout: 'grid',
        animationSpeed: 'normal'
    },
    users: {
        roles: [
            { name: 'Administrator', level: 'admin', permissions: ['all'] },
            { name: 'Manager', level: 'manager', permissions: ['sales', 'reports', 'customer', 'product'] },
            { name: 'Employee', level: 'employee', permissions: ['sales', 'customer', 'product'] }
        ]
    }
};

// ==========================================
// DOM Elements
// ==========================================

const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const logoUpload = document.getElementById('logoUpload');
const logoPreview = document.getElementById('logoPreview');
const removeLogoBtn = document.getElementById('removeLogoBtn');
const toast = document.getElementById('settingsToast');
const toastMessage = document.getElementById('toastMessage');

// ==========================================
// Settings Management
// ==========================================

/**
 * Load settings from localStorage
 */
function loadSettings() {
    const saved = localStorage.getItem('smartposSettings');
    if (saved) {
        settingsData = { ...settingsData, ...JSON.parse(saved) };
    }
    applySettingsToForm();
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
    try {
        localStorage.setItem('smartposSettings', JSON.stringify(settingsData));
        showToast('Settings saved successfully!', 'success');
        
        // Apply settings to the main dashboard
        applySettingsToDashboard();
    } catch (error) {
        console.error('Error saving settings:', error);
        showToast('Error saving settings!', 'error');
    }
}

/**
 * Reset settings to default
 */
function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
        localStorage.removeItem('smartposSettings');
        loadSettings();
        showToast('Settings reset to default!', 'success');
    }
}

/**
 * Apply settings to form inputs
 */
function applySettingsToForm() {
    // Company settings
    document.getElementById('companyName').value = settingsData.company.name;
    document.getElementById('companyEmail').value = settingsData.company.email;
    document.getElementById('companyPhone').value = settingsData.company.phone;
    document.getElementById('companyAddress').value = settingsData.company.address;
    document.getElementById('businessType').value = settingsData.company.type;
    document.getElementById('currency').value = settingsData.company.currency;
    document.getElementById('taxRate').value = settingsData.company.taxRate;
    document.getElementById('timezone').value = settingsData.company.timezone;

    // Colors
    document.getElementById('primaryColor').value = settingsData.branding.colors.primary;
    document.getElementById('primaryColorText').value = settingsData.branding.colors.primary;
    document.getElementById('secondaryColor').value = settingsData.branding.colors.secondary;
    document.getElementById('secondaryColorText').value = settingsData.branding.colors.secondary;
    document.getElementById('successColor').value = settingsData.branding.colors.success;
    document.getElementById('successColorText').value = settingsData.branding.colors.success;
    document.getElementById('warningColor').value = settingsData.branding.colors.warning;
    document.getElementById('warningColorText').value = settingsData.branding.colors.warning;

    // UI settings
    document.getElementById('sidebarMode').value = settingsData.ui.sidebarMode;
    document.getElementById('themeMode').value = settingsData.ui.theme;
    document.getElementById('dashboardLayout').value = settingsData.ui.dashboardLayout;
    document.getElementById('animationSpeed').value = settingsData.ui.animationSpeed;

    // Logo
    if (settingsData.branding.logo) {
        updateLogoPreview(settingsData.branding.logo);
    }

    // Functions
    renderFunctionList();
    renderUserRoles();
}

/**
 * Apply settings to main dashboard
 */
function applySettingsToDashboard() {
    // Update CSS custom properties for colors
    const root = document.documentElement;
    root.style.setProperty('--primary-color', settingsData.branding.colors.primary);
    root.style.setProperty('--secondary-color', settingsData.branding.colors.secondary);
    root.style.setProperty('--success-color', settingsData.branding.colors.success);
    root.style.setProperty('--warning-color', settingsData.branding.colors.warning);

    // Update company name in dashboard
    const companyTitle = document.querySelector('.company-title');
    if (companyTitle) {
        companyTitle.textContent = settingsData.company.name;
    }

    // Update sidebar company info
    const companyName = document.querySelector('.company-name');
    if (companyName) {
        companyName.textContent = settingsData.company.name;
    }

    // Update dashboard title
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
        pageTitle.textContent = `${settingsData.company.name} - SmartPOS`;
    }

    // Update function menu items based on enabled/disabled state
    updateDashboardMenu();
}

/**
 * Update dashboard menu based on function settings
 */
function updateDashboardMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const section = item.dataset.section;
        if (section && settingsData.functions[section]) {
            const isEnabled = settingsData.functions[section].enabled;
            if (!isEnabled) {
                item.style.opacity = '0.5';
                item.style.pointerEvents = 'none';
            } else {
                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
            }
        }
    });
}

// ==========================================
// Tab Navigation
// ==========================================

/**
 * Handle tab switching
 */
function switchTab(targetTab) {
    // Remove active class from all tabs and content
    navTabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to target tab and content
    const targetNavTab = document.querySelector(`[data-tab="${targetTab}"]`);
    const targetContent = document.getElementById(`${targetTab}-tab`);

    if (targetNavTab && targetContent) {
        targetNavTab.classList.add('active');
        targetContent.classList.add('active');
    }
}

// ==========================================
// Company Settings
// ==========================================

/**
 * Update company settings
 */
function updateCompanySettings() {
    settingsData.company = {
        name: document.getElementById('companyName').value,
        email: document.getElementById('companyEmail').value,
        phone: document.getElementById('companyPhone').value,
        address: document.getElementById('companyAddress').value,
        type: document.getElementById('businessType').value,
        currency: document.getElementById('currency').value,
        taxRate: parseFloat(document.getElementById('taxRate').value) || 0,
        timezone: document.getElementById('timezone').value
    };
}

// ==========================================
// Logo Management
// ==========================================

/**
 * Update logo preview
 */
function updateLogoPreview(src) {
    logoPreview.innerHTML = `
        <img src="${src}" alt="Company Logo" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px;">
    `;
}

/**
 * Handle logo upload
 */
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            showToast('Logo file too large! Please select a file under 2MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            settingsData.branding.logo = e.target.result;
            updateLogoPreview(e.target.result);
            showToast('Logo updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Remove logo
 */
function removeLogo() {
    settingsData.branding.logo = null;
    logoPreview.innerHTML = `
        <div class="logo-placeholder">
            <i class="fas fa-image"></i>
            <span>No logo uploaded</span>
        </div>
    `;
    showToast('Logo removed!', 'success');
}

// ==========================================
// Color Management
// ==========================================

/**
 * Update color settings
 */
function updateColorSettings() {
    settingsData.branding.colors = {
        primary: document.getElementById('primaryColor').value,
        secondary: document.getElementById('secondaryColor').value,
        success: document.getElementById('successColor').value,
        warning: document.getElementById('warningColor').value
    };
}

/**
 * Handle color picker changes
 */
function handleColorChange(colorId, textId) {
    const colorPicker = document.getElementById(colorId);
    const textInput = document.getElementById(textId);
    
    // Sync color picker with text input
    colorPicker.addEventListener('input', (e) => {
        textInput.value = e.target.value;
        updateColorSettings();
    });
    
    // Sync text input with color picker
    textInput.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
            colorPicker.value = e.target.value;
            updateColorSettings();
        }
    });
}

// ==========================================
// Function Management
// ==========================================

/**
 * Render function list
 */
function renderFunctionList() {
    const functionList = document.getElementById('functionList');
    functionList.innerHTML = '';

    Object.entries(settingsData.functions).forEach(([key, func]) => {
        const functionItem = document.createElement('div');
        functionItem.className = 'function-item';
        functionItem.innerHTML = `
            <div class="function-info">
                <div class="function-name">${func.name}</div>
                <div class="function-description">${func.description}</div>
            </div>
            <div class="function-status">
                <div class="toggle-switch ${func.enabled ? 'active' : ''}" 
                     onclick="toggleFunction('${key}')"></div>
            </div>
        `;
        functionList.appendChild(functionItem);
    });
}

/**
 * Toggle function enable/disable
 */
function toggleFunction(functionKey) {
    if (settingsData.functions[functionKey]) {
        settingsData.functions[functionKey].enabled = !settingsData.functions[functionKey].enabled;
        renderFunctionList();
    }
}

// ==========================================
// User Management
// ==========================================

/**
 * Render user roles
 */
function renderUserRoles() {
    const userRolesList = document.getElementById('userRolesList');
    userRolesList.innerHTML = '';

    settingsData.users.roles.forEach(role => {
        const roleItem = document.createElement('div');
        roleItem.className = 'user-role-item';
        
        const permissionsHtml = role.permissions
            .map(perm => `<span class="permission-tag">${perm}</span>`)
            .join('');
        
        roleItem.innerHTML = `
            <div class="role-header">
                <div class="role-name">${role.name}</div>
                <div class="role-badge ${role.level}">${role.level}</div>
            </div>
            <div class="role-permissions">
                ${permissionsHtml}
            </div>
        `;
        userRolesList.appendChild(roleItem);
    });
}

// ==========================================
// UI Settings
// ==========================================

/**
 * Update UI settings
 */
function updateUISettings() {
    settingsData.ui = {
        sidebarMode: document.getElementById('sidebarMode').value,
        theme: document.getElementById('themeMode').value,
        dashboardLayout: document.getElementById('dashboardLayout').value,
        animationSpeed: document.getElementById('animationSpeed').value
    };
}

// ==========================================
// Toast Notifications
// ==========================================

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// Data Management
// ==========================================

/**
 * Export settings data
 */
function exportSettings() {
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smartpos-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('Settings exported successfully!', 'success');
}

/**
 * Import settings data
 */
function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const imported = JSON.parse(e.target.result);
                    settingsData = { ...settingsData, ...imported };
                    applySettingsToForm();
                    showToast('Settings imported successfully!', 'success');
                } catch (error) {
                    showToast('Invalid settings file!', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// ==========================================
// Event Listeners
// ==========================================

// Tab navigation
navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
    });
});

// Save settings
saveSettingsBtn.addEventListener('click', () => {
    updateCompanySettings();
    updateColorSettings();
    updateUISettings();
    saveSettings();
});

// Logo upload
logoUpload.addEventListener('change', handleLogoUpload);
removeLogoBtn.addEventListener('click', removeLogo);

// Color pickers
handleColorChange('primaryColor', 'primaryColorText');
handleColorChange('secondaryColor', 'secondaryColorText');
handleColorChange('successColor', 'successColorText');
handleColorChange('warningColor', 'warningColorText');

// Form inputs - real-time updates
document.querySelectorAll('#company-tab input, #company-tab select, #company-tab textarea').forEach(input => {
    input.addEventListener('input', updateCompanySettings);
});

document.querySelectorAll('#ui-tab select').forEach(select => {
    select.addEventListener('change', updateUISettings);
});

// Data management
document.getElementById('exportDataBtn').addEventListener('click', exportSettings);
document.getElementById('importDataBtn').addEventListener('click', importSettings);
document.getElementById('resetSettingsBtn').addEventListener('click', resetSettings);

document.getElementById('clearDataBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
        localStorage.clear();
        showToast('All data cleared!', 'success');
        setTimeout(() => location.reload(), 1000);
    }
});

// ==========================================
// Initialization
// ==========================================

/**
 * Initialize settings page
 */
function initializeSettings() {
    loadSettings();
    
    // Set default active tab
    switchTab('company');
    
    // Update color variables
    updateColorSettings();
    
    console.log('Admin Settings initialized');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeSettings);

// ==========================================
// Utility Functions
// ==========================================

/**
 * Validate form data
 */
function validateForm() {
    const errors = [];
    
    // Validate company name
    if (!settingsData.company.name.trim()) {
        errors.push('Company name is required');
    }
    
    // Validate colors
    const colors = settingsData.branding.colors;
    Object.entries(colors).forEach(([key, color]) => {
        if (!/^#[0-9A-F]{6}$/i.test(color)) {
            errors.push(`Invalid ${key} color format`);
        }
    });
    
    return errors;
}

/**
 * Show loading state
 */
function showLoading() {
    document.body.classList.add('loading');
}

/**
 * Hide loading state
 */
function hideLoading() {
    document.body.classList.remove('loading');
}

// Export functions for global access
window.toggleFunction = toggleFunction;
window.updateCompanySettings = updateCompanySettings;
window.updateUISettings = updateUISettings;
window.saveSettings = saveSettings;