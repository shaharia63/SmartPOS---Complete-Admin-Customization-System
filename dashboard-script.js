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

// Chart variables
let salesChart = null;

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

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 767) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ==========================================
// Menu Navigation
// ==========================================

/**
 * Set active menu item
 * @param {string} section - Section to activate
 */
function setActiveMenuItem(section) {
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });
    
    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });
    
    // Update page title
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        const sectionNames = {
            'dashboard': 'Dashboard',
            'pos': 'Point of Sale',
            'inventory': 'Inventory',
            'customers': 'Customers',
            'suppliers': 'Suppliers',
            'sales': 'Sales',
            'purchases': 'Purchases',
            'expenses': 'Expenses',
            'reports': 'Reports',
            'settings': 'Settings'
        };
        pageTitle.textContent = sectionNames[section] || 'Dashboard';
    }
}

// Menu item click handlers
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const section = item.dataset.section;
        if (section && !item.onclick) {
            e.preventDefault();
            setActiveMenuItem(section);
            
            // Simulate section loading
            showNotification(`Loading ${section} module...`, 'info', 2000);
        }
    });
});

// Mobile navigation handlers
mobileNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const section = item.dataset.section;
        if (section) {
            setActiveMenuItem(section);
            closeSidebar();
        }
    });
});

// ==========================================
// Chart Management
// ==========================================

/**
 * Initialize sales chart
 */
function initializeChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    try {
        // Sample data for the chart
        const salesData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'This Week',
                    data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: [1000, 1600, 2800, 4200, 1800, 2500, 3800],
                    borderColor: '#94a3b8',
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        };
        
        const config = {
            type: 'line',
            data: salesData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        };
        
        if (typeof Chart !== 'undefined') {
            salesChart = new Chart(ctx, config);
            console.log('Sales chart initialized successfully');
        } else {
            console.warn('Chart.js not loaded');
            // Fallback: show placeholder
            ctx.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">📊 Chart will appear here when Chart.js is loaded</p>';
            ctx.parentNode.appendChild(placeholder);
        }
    } catch (error) {
        console.error('Error initializing chart:', error);
        ctx.style.display = 'none';
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 40px;">❌ Chart could not be loaded</p>';
        ctx.parentNode.appendChild(errorDiv);
    }
}

/**
 * Update chart data
 * @param {Array} newData - New sales data
 */
function updateChartData(newData) {
    if (salesChart) {
        salesChart.data.datasets[0].data = newData;
        salesChart.update();
    }
}

// ==========================================
// KPI Card Management
// ==========================================

/**
 * Animate KPI values
 * @param {Element} element - KPI element
 * @param {number} from - Start value
 * @param {number} to - End value
 * @param {number} duration - Animation duration in ms
 */
function animateValue(element, from, to, duration) {
    const start = performance.now();
    const stepValue = (to - from) / (duration / 16);
    const steps = duration / 16;
    let currentStep = 0;
    const timer = setInterval(() => {
        currentStep++;
        const currentValue = Math.round(from + (stepValue * currentStep));
        element.childNodes[0].textContent = currentValue + ' ';
        
        if (currentStep >= steps) {
            clearInterval(timer);
            element.childNodes[0].textContent = to + ' ';
        }
    }, 16);
}

/**
 * Update KPI card value
 * @param {string} cardId - Card element ID
 * @param {string} newValue - New value (with currency formatting)
 */
function updateKPI(cardId, newValue) {
    const element = document.getElementById(cardId);
    if (element) {
        const currentValue = element.textContent;
        element.style.color = '#3b82f6';
        element.style.transition = 'color 0.3s';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.color = '';
        }, 300);
    }
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

// ==========================================
// Real-time Data Simulation
// ==========================================

/**
 * Simulate real-time data updates
 */
function simulateRealTimeData() {
    // Update KPI values periodically
    setInterval(() => {
        const elements = ['totalSales', 'ordersToday', 'totalProducts', 'totalCustomers'];
        const values = [
            `$${(12000 + Math.random() * 1000).toFixed(0)}`,
            Math.floor(120 + Math.random() * 20),
            Math.floor(1230 + Math.random() * 10),
            Math.floor(850 + Math.random() * 15)
        ];
        
        elements.forEach((id, index) => {
            updateKPI(id, values[index]);
        });
        
        // Add subtle notification occasionally
        if (Math.random() > 0.7) {
            showNotification('Data updated successfully', 'success', 2000);
        }
    }, 10000); // Update every 10 seconds
}

// ==========================================
// Search Functionality
// ==========================================

/**
 * Handle search input
 */
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            console.log('Search query:', query);
            
            if (query.length > 2) {
                showNotification(`Searching for: "${query}"`, 'info', 1500);
            }
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = e.target.value.trim();
                if (query) {
                    showNotification(`Search results for: "${query}"`, 'success', 2000);
                }
            }
        });
    }
}

// ==========================================
// Quick Actions
// ==========================================

/**
 * Handle quick action buttons
 */
function initializeQuickActions() {
    const actionButtons = document.querySelectorAll('.action-button, .btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!button.onclick) {
                e.preventDefault();
                const buttonText = button.textContent.trim();
                showNotification(`${buttonText} feature coming soon!`, 'info', 2000);
            }
        });
    });
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
    
    // Initialize search
    initializeSearch();
    
    // Initialize quick actions
    initializeQuickActions();
    
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
    updateKPI,
    showNotification,
    initializeChart
};