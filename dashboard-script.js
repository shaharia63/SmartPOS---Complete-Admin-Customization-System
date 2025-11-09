// ==========================================
// SmartPOS Dashboard JavaScript
// ==========================================

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const mainContent = document.querySelector('.main-content');
const menuItems = document.querySelectorAll('.menu-item');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
const kpiCards = document.querySelectorAll('.kpi-card');
const actionButtons = document.querySelectorAll('.action-btn');

// ==========================================
// Sidebar Management
// ==========================================

/**
 * Toggle sidebar visibility
 */
function toggleSidebar() {
    const isMobile = window.innerWidth <= 767;
    
    if (isMobile) {
        // Mobile: toggle overlay and sidebar
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    } else {
        // Desktop: collapse/expand sidebar
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
}

/**
 * Close sidebar (mobile)
 */
function closeSidebar() {
    if (window.innerWidth <= 767) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Event listeners for sidebar
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 767 && 
        sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target)) {
        closeSidebar();
    }
});

// ==========================================
// Navigation Management
// ==========================================

/**
 * Set active menu item
 * @param {string} section - Section name to activate
 */
function setActiveMenuItem(section) {
    // Remove active class from all menu items
    menuItems.forEach(item => item.classList.remove('active'));
    mobileNavItems.forEach(item => item.classList.remove('active'));
    
    // Find and activate the corresponding menu item
    const targetItem = document.querySelector(`[data-section="${section}"]`);
    if (targetItem) {
        targetItem.classList.add('active');
    }
    
    // Update breadcrumb
    updateBreadcrumb(section);
    
    // Close sidebar on mobile
    closeSidebar();
}

/**
 * Update breadcrumb navigation
 * @param {string} section - Current section
 */
function updateBreadcrumb(section) {
    const breadcrumb = document.querySelector('.breadcrumb');
    const currentPage = breadcrumb.querySelector('.current-page');
    
    // Map section names to display names
    const sectionNames = {
        'dashboard': 'Dashboard',
        'sales': 'Sales',
        'quotation': 'Quotation',
        'purchase': 'Purchase',
        'warranty': 'Warranty',
        'customer': 'Customer',
        'supplier': 'Supplier',
        'salesperson': 'Sales Person',
        'product': 'Product',
        'accounting': 'Accounting',
        'hrm': 'HRM',
        'salary': 'Salary',
        'gst': 'GST Report',
        'loan': 'Loan Management',
        'reports': 'Reports',
        'sms': 'SMS & Email',
        'usermanagement': 'User Management',
        'store': 'Store Management',
        'settings': 'Setting',
        'storechange': 'Store Change',
        'logout': 'Logout',
        'more': 'More'
    };
    
    const displayName = sectionNames[section] || section.charAt(0).toUpperCase() + section.slice(1);
    if (currentPage) {
        currentPage.textContent = displayName;
    }
}

// Add event listeners to menu items
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;
        if (section && section !== 'logout') {
            setActiveMenuItem(section);
            // Here you would typically load the corresponding page content
            showNotification(`Navigating to ${section}...`, 'info');
        } else if (section === 'logout') {
            showNotification('Logging out...', 'warning');
            setTimeout(() => {
                showNotification('Logout functionality would be implemented here', 'info');
            }, 1000);
        }
    });
});

// Add event listeners to mobile nav items
mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;
        if (section && section !== 'more') {
            setActiveMenuItem(section);
            showNotification(`Loading ${section}...`, 'info');
        } else if (section === 'more') {
            // Show more options or open sidebar
            if (window.innerWidth <= 767) {
                toggleSidebar();
            }
        }
    });
});

// ==========================================
// KPI Cards Management
// ==========================================

/**
 * Handle KPI card clicks
 * @param {HTMLElement} card - The clicked KPI card
 */
function handleKpiClick(card) {
    const kpiType = card.dataset.kpi;
    const kpiTitle = card.querySelector('.kpi-title').textContent;
    
    // Add click animation
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = '';
    }, 150);
    
    // Show notification and handle navigation
    showNotification(`Opening ${kpiTitle} details...`, 'info');
    
    // Simulate navigation to detailed view
    setTimeout(() => {
        showNotification(`Would navigate to ${kpiTitle} report page`, 'success');
    }, 500);
    
    // Here you would typically navigate to the detailed report page
    console.log(`Navigating to ${kpiType} details`);
}

// Add event listeners to KPI cards
kpiCards.forEach(card => {
    card.addEventListener('click', () => handleKpiClick(card));
    
    // Add keyboard support
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${card.querySelector('.kpi-title').textContent} details`);
    
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleKpiClick(card);
        }
    });
});

// ==========================================
// Action Buttons
// ==========================================

/**
 * Handle header action button clicks
 * @param {HTMLElement} button - The clicked button
 */
function handleActionClick(button) {
    const title = button.getAttribute('title');
    
    // Add click animation
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // Handle different actions
    switch (title) {
        case 'Search':
            showNotification('Search functionality would be implemented here', 'info');
            break;
        case 'Notifications':
            showNotification('Opening notifications panel...', 'info');
            break;
        case 'Bookmarks':
            showNotification('Opening bookmarks...', 'info');
            break;
        case 'Print':
            showNotification('Preparing to print dashboard...', 'success');
            setTimeout(() => window.print(), 500);
            break;
        case 'Language':
            showNotification('Language selection would be shown here', 'info');
            break;
        case 'Fullscreen':
            toggleFullscreen();
            break;
        case 'Logout':
            showNotification('Logout functionality would be implemented here', 'warning');
            break;
        default:
            showNotification(`${title} action would be executed`, 'info');
    }
}

// Add event listeners to action buttons
actionButtons.forEach(button => {
    button.addEventListener('click', () => handleActionClick(button));
});

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            showNotification('Entered fullscreen mode', 'success');
        });
    } else {
        document.exitFullscreen().then(() => {
            showNotification('Exited fullscreen mode', 'info');
        });
    }
}

// ==========================================
// Chart Management
// ==========================================

let salesChart = null;

/**
 * Initialize the sales chart
 */
function initializeChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    // Sample data for demonstration
    const labels = Array.from({length: 30}, (_, i) => (i + 1).toString());
    const salesData = Array.from({length: 30}, () => Math.floor(Math.random() * 100));
    const receivedData = Array.from({length: 30}, () => Math.floor(Math.random() * 100));
    
    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Sales',
                    data: salesData,
                    borderColor: '#0D6EFD',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#0D6EFD',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Total Received',
                    data: receivedData,
                    borderColor: '#198754',
                    backgroundColor: 'rgba(25, 135, 84, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#198754',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // We're using custom legend
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(33, 37, 41, 0.9)',
                    titleColor: '#F8F9FA',
                    bodyColor: '#F8F9FA',
                    borderColor: '#495057',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return `Day ${context[0].label}`;
                        },
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Days of Month',
                        color: '#6C757D',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    },
                    grid: {
                        color: '#E9ECEF',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#6C757D',
                        font: {
                            size: 11
                        },
                        maxTicksLimit: 15
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Amount',
                        color: '#6C757D',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    },
                    grid: {
                        color: '#E9ECEF',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#6C757D',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value;
                        }
                    },
                    beginAtZero: true
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    };
    
    // Create the chart
    salesChart = new Chart(ctx, config);
}

/**
 * Update chart data
 */
function updateChartData() {
    if (!salesChart) return;
    
    // Simulate data updates
    const newSalesData = Array.from({length: 30}, () => Math.floor(Math.random() * 100));
    const newReceivedData = Array.from({length: 30}, () => Math.floor(Math.random() * 100));
    
    salesChart.data.datasets[0].data = newSalesData;
    salesChart.data.datasets[1].data = newReceivedData;
    salesChart.update('active');
    
    showNotification('Chart data updated', 'success', 1500);
}

// ==========================================
// Notification System
// ==========================================

/**
 * Show notification to user
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 350px;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        font-size: 14px;
        font-weight: 500;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

/**
 * Get icon for notification type
 * @param {string} type - Notification type
 * @returns {string} FontAwesome icon class
 */
function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

/**
 * Get color for notification type
 * @param {string} type - Notification type
 * @returns {string} CSS color value
 */
function getNotificationColor(type) {
    const colors = {
        'success': '#198754',
        'error': '#DC3545',
        'warning': '#FFC107',
        'info': '#0D6EFD'
    };
    return colors[type] || colors.info;
}

// ==========================================
// Responsive Management
// ==========================================

/**
 * Handle window resize
 */
function handleResize() {
    const width = window.innerWidth;
    
    if (width > 767) {
        // Desktop: ensure sidebar is visible and overlay is hidden
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        // Mobile: ensure sidebar is hidden by default
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
    
    // Update chart on resize
    if (salesChart) {
        salesChart.resize();
    }
}

// Add resize listener
window.addEventListener('resize', handleResize);

// ==========================================
// Keyboard Shortcuts
// ==========================================

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchBtn = document.querySelector('[title="Search"]');
        if (searchBtn) {
            searchBtn.click();
        }
    }
    
    // Ctrl/Cmd + P for print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        const printBtn = document.querySelector('[title="Print"]');
        if (printBtn) {
            printBtn.click();
        }
    }
    
    // F11 for fullscreen
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // Escape to close sidebar
    if (e.key === 'Escape') {
        closeSidebar();
    }
}

// Add keyboard listener
document.addEventListener('keydown', handleKeyboardShortcuts);

// ==========================================
// Demo Data Simulation
// ==========================================

/**
 * Simulate real-time data updates
 */
function simulateRealTimeData() {
    setInterval(() => {
        // Randomly update KPI values
        kpiCards.forEach(card => {
            const currentValue = parseInt(card.querySelector('.kpi-value').textContent.split(' ')[0]);
            const totalValue = parseInt(card.querySelector('.kpi-total').textContent);
            
            // Small random change
            const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            const newValue = Math.max(0, currentValue + change);
            
            if (change !== 0) {
                // Animate the value change
                animateValueChange(card.querySelector('.kpi-value'), currentValue, newValue);
            }
        });
    }, 10000); // Update every 10 seconds
}

/**
 * Animate value change in KPI card
 * @param {HTMLElement} element - Element containing the value
 * @param {number} from - Starting value
 * @param {number} to - Ending value
 */
function animateValueChange(element, from, to) {
    const duration = 500;
    const steps = 20;
    const stepValue = (to - from) / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
        currentStep++;
        const currentValue = Math.round(from + (stepValue * currentStep));
        element.childNodes[0].textContent = currentValue + ' ';
        
        if (currentStep >= steps) {
            clearInterval(timer);
            element.childNodes[0].textContent = to + ' ';
        }
    }, stepDuration);
}

// ==========================================
// Page Load Initialization
// ==========================================

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize chart
    setTimeout(initializeChart, 500);
    
    // Set default active menu
    setActiveMenuItem('dashboard');
    
    // Start real-time data simulation
    setTimeout(simulateRealTimeData, 3000);
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to SmartPOS Dashboard!', 'success', 2000);
    }, 1000);
    
    console.log('SmartPOS Dashboard initialized successfully!');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && salesChart) {
        // Refresh chart when page becomes visible
        setTimeout(() => {
            salesChart.resize();
        }, 100);
    }
});

// Export functions for potential external use
window.SmartPOSDashboard = {
    setActiveMenuItem,
    updateChartData,
    showNotification,
    toggleSidebar,
    closeSidebar
};