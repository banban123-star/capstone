// --- Mock Inventory Data for Diagnostics Autocomplete ---
const mockInventory = [
    { id: 'p1', name: 'Coolant Temp Sensor (OEM Honda)', sku: '37870-KZR-601', price: 850.00, stock: 24 },
    { id: 'p2', name: 'Front Disc Brake Pads', sku: '06455-K59-A71', price: 450.00, stock: 3 },
    { id: 'p3', name: 'Yamaha V-Belt', sku: '2DP-E7641-00', price: 1200.00, stock: 0 },
    { id: 'p4', name: 'Yamalube Standard Engine Oil', sku: 'YAM-OIL-STD', price: 400.00, stock: 45 },
    { id: 'p5', name: 'Spark Plug (NGK CPR8EA-9)', sku: 'NGK-CPR8EA', price: 250.00, stock: 12 },
    { id: 'p6', name: 'Air Filter Element', sku: 'AF-17210-KZR', price: 320.00, stock: 9 },
    { id: 'p7', name: 'Brake Fluid DOT 3 (250ml)', sku: 'BF-DOT3-250', price: 180.00, stock: 14 },
    { id: 'p8', name: 'Front Tire 80/90-14 Tubeless', sku: 'TR-8090-14F', price: 1650.00, stock: 2 },
    { id: 'p9', name: 'Rear Tire 90/90-14 Tubeless', sku: 'TR-9090-14R', price: 1850.00, stock: 0 },
    { id: 'p10', name: 'Motorcycle Battery 12V 5Ah', sku: 'BAT-12V5AH', price: 1450.00, stock: 5 },
    { id: 'p11', name: 'Headlight Bulb (H4)', sku: 'BLB-H4-35', price: 140.00, stock: 18 },
    { id: 'p12', name: 'Brake / Tail Light Bulb', sku: 'BLB-BRK-21', price: 60.00, stock: 25 },
    { id: 'p13', name: 'Chain & Sprocket Kit', sku: 'CHN-428-KIT', price: 1850.00, stock: 4 },
    { id: 'p14', name: 'CVT Roller Set', sku: 'CVT-RLR-SET', price: 520.00, stock: 6 },
    { id: 'p15', name: 'Oil Filter', sku: 'OF-15410-KZR', price: 150.00, stock: 20 },
    { id: 'p16', name: 'Radiator Coolant (1L)', sku: 'CLT-1L', price: 220.00, stock: 10 },
    { id: 'p17', name: 'Clutch Cable', sku: 'CBL-CLT-01', price: 280.00, stock: 7 },
    { id: 'p18', name: 'Regulator / Rectifier', sku: 'REG-RECT-12V', price: 950.00, stock: 2 },
    { id: 'p19', name: 'Fork Oil Seal Kit', sku: 'FRK-SEAL-KIT', price: 480.00, stock: 3 },
    { id: 'p20', name: 'Rear Brake Shoes', sku: 'BRK-SHOE-R', price: 260.00, stock: 6 },
    { id: 'p21', name: 'Front Brake Disc', sku: 'BRK-DISC-F', price: 1350.00, stock: 2 },
    { id: 'p22', name: 'Tire Patch / Sealant Kit', sku: 'TR-PATCH-KIT', price: 120.00, stock: 15 },
    { id: 'p23', name: 'Chain Lube Spray', sku: 'CHN-LUBE-SP', price: 210.00, stock: 14 },
    { id: 'p25', name: 'Turn Signal Bulb', sku: 'BLB-SIG-10', price: 45.00, stock: 30 }
];

document.addEventListener('change', function(e) {
    // 1. Walk-in Motorcycle Selector Logic
    if (e.target.id === 'motorcycle-select') {
        const walkinFields = document.getElementById('walkin-fields');
        if (walkinFields) {
            if (e.target.value === 'walkin') {
                walkinFields.classList.remove('hidden');
            } else {
                walkinFields.classList.add('hidden');
            }
        }
    }
});

document.addEventListener('input', function(e) {
    // 2. Parts Autocomplete Search Logic
    if (e.target.id === 'part-search-input') {
        const query = e.target.value.toLowerCase();
        const dropdown = document.getElementById('part-autocomplete-dropdown');
        
        if (!query) {
            dropdown.classList.add('hidden');
            return;
        }
        
        const matches = mockInventory.filter(p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query));
        
        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(part => `
                <div class="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex justify-between items-center autocomplete-item" data-id="${part.id}">
                    <div>
                        <div class="text-sm font-bold text-slate-800">${part.name}</div>
                        <div class="text-[10px] text-slate-500">SKU: ${part.sku}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold text-blue-600">₱${part.price.toFixed(2)}</div>
                        <div class="text-[10px] font-semibold ${part.stock > 0 ? 'text-emerald-600' : 'text-red-500'}">Stock: ${part.stock}</div>
                    </div>
                </div>
            `).join('');
            dropdown.classList.remove('hidden');
        } else {
            dropdown.innerHTML = `<div class="p-3 text-sm text-slate-500 text-center">No parts found matching "${query}"</div>`;
            dropdown.classList.remove('hidden');
        }
    }
});


document.addEventListener('click', function(e) {
    // 3. Select Item from Autocomplete
    const autocompleteItem = e.target.closest('.autocomplete-item');
    if (autocompleteItem) {
        const partId = autocompleteItem.getAttribute('data-id');
        const part = mockInventory.find(p => p.id === partId);
        
        if (addPartToPlan(part)) {
            document.getElementById('part-search-input').value = '';
            document.getElementById('part-autocomplete-dropdown').classList.add('hidden');
        }
    }

    // 4. Chip Controls (Minus, Plus, Remove)
    const btnMinus = e.target.closest('.btn-qty-minus');
    if (btnMinus) {
        const valSpan = btnMinus.nextElementSibling;
        let qty = parseInt(valSpan.textContent);
        if (qty > 1) valSpan.textContent = qty - 1;
    }

    const btnPlus = e.target.closest('.btn-qty-plus');
    if (btnPlus) {
        const valSpan = btnPlus.previousElementSibling;
        let qty = parseInt(valSpan.textContent);
        let max = parseInt(btnPlus.getAttribute('data-max'));
        if (qty < max) {
            valSpan.textContent = qty + 1;
        } else {
            alert(`Only ${max} units available in stock.`);
        }
    }

    const btnRemove = e.target.closest('.btn-remove-part');
    if (btnRemove) {
        btnRemove.closest('div[id^="selected-part-"]').remove();
    }
    
    // 5. Hide Autocomplete Dropdown when clicking outside
    if (!e.target.closest('#part-autocomplete-dropdown') && !e.target.closest('#part-search-input')) {
        const dropdown = document.getElementById('part-autocomplete-dropdown');
        if (dropdown) dropdown.classList.add('hidden');
    }
});

// --- Diagnostics View Toggle Handler ---
document.addEventListener('change', function(e) {
    // Check if the changed element is one of our master toggles
    if (e.target.id === 'toggle-physical' || e.target.id === 'toggle-ecu') {
        const isPhysicalOn = document.getElementById('toggle-physical').checked;
        const isEcuOn = document.getElementById('toggle-ecu').checked;

        const physicalCard = document.getElementById('physical-inspection-card');
        const ecuCard = document.getElementById('ecu-scan-card');

        // Toggle the Tailwind 'hidden' class based on checkbox state
        if (physicalCard) physicalCard.classList.toggle('hidden', !isPhysicalOn);
        if (ecuCard) ecuCard.classList.toggle('hidden', !isEcuOn);
    }
});

// --- Dynamic Loading Logic (SPA) ---
const mainContentArea = document.getElementById('main-content-area');
const headerTitle = document.getElementById('header-title');

let viewLoadToken = 0;

async function loadView(viewName) {
    const loadToken = ++viewLoadToken;
    try {
        // Chief / Sub-Mechanic get the mobile version of a screen once it has been converted
        const useMobileView = document.body.classList.contains('mobile-app') && mobileViews.includes(viewName);
        const response = await fetch(`views/${useMobileView ? 'mobile/' : ''}${viewName}.html`);
        if (!response.ok) throw new Error('File not found');
        const html = await response.text();
        if (loadToken !== viewLoadToken) return; // a newer navigation superseded this one
        mainContentArea.innerHTML = html;
        mainContentArea.classList.toggle('m-screen', useMobileView);
        mainContentArea.scrollTop = 0;

        if (useMobileView && viewName === 'dashboard') renderMobileHome();

        // Initialize Diagnostics view state
        if (viewName === 'diagnostics') {
            const isPhysicalOn = document.getElementById('toggle-physical')?.checked;
            const isEcuOn = document.getElementById('toggle-ecu')?.checked;
            if (document.getElementById('physical-inspection-card')) document.getElementById('physical-inspection-card').classList.toggle('hidden', !isPhysicalOn);
            if (document.getElementById('ecu-scan-card')) document.getElementById('ecu-scan-card').classList.toggle('hidden', !isEcuOn);
            renderInspection();
            planReviewed = false;
            updatePlanTotals();
        }

        // Initialize Inventory view
        if (viewName === 'inventory') {
            renderInventory();
        }

        if (viewName === 'users') { renderUsers(); }
        if (viewName === 'backup') { renderBackupHistory(); }
        if (viewName === 'repairs') { renderRepairs(); }
        if (viewName === 'customers') { renderCustomers(); }

        // Initialize Transactions view
        if (viewName === 'transactions') {
            renderTransactions();
        }

        // Initialize History view
        if (viewName === 'history') {
            renderHistory();
        }

        // NEW: Initialize Reports view
        if (viewName === 'reports') {
            renderReports('today');
        }
        if (viewName === 'audit') { renderAudit(); }

    } catch (error) {
        mainContentArea.innerHTML = `<div class="p-8 text-center bg-white rounded-xl border border-red-200">
            <h2 class="text-red-500 font-bold text-lg mb-2">Error loading view: ${viewName}.html</h2>
            <p class="text-slate-500 text-sm">Please ensure you are opening this project using a Local Server (e.g., Live Server in VS Code) and not just double-clicking the HTML file.</p>
        </div>`;
    }
}

// --- Sidebar Navigation Logic ---
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const mobileCloseBtn = document.getElementById('mobile-close-btn');
const mobileOverlay = document.getElementById('mobile-overlay');
const navLinks = document.querySelectorAll('.nav-link[data-target]');

function toggleSidebar(show) {
    if (show) {
        sidebar.classList.remove('-translate-x-full');
        mobileOverlay.classList.remove('hidden');
        setTimeout(() => mobileOverlay.classList.remove('opacity-0'), 10);
    } else {
        sidebar.classList.add('-translate-x-full');
        mobileOverlay.classList.add('opacity-0');
        setTimeout(() => mobileOverlay.classList.add('hidden'), 300);
    }
}

sidebarToggle.addEventListener('click', () => toggleSidebar(true));
mobileCloseBtn.addEventListener('click', () => toggleSidebar(false));
mobileOverlay.addEventListener('click', () => toggleSidebar(false));

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        if(!targetId) return;

        // UI Reset
        navLinks.forEach(nav => {
            nav.classList.remove('active', 'bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-900/20');
            nav.classList.add('hover:bg-slate-800', 'hover:text-white');
            const icon = nav.querySelector('i');
            if(icon && icon.classList.contains('ph-fill')) {
                icon.classList.remove('ph-fill');
                icon.classList.add('ph');
            }
        });

        // Activate clicked
        this.classList.add('active', 'bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-900/20');
        this.classList.remove('hover:bg-slate-800');
        const activeIcon = this.querySelector('i');
        if(activeIcon) {
            activeIcon.classList.remove('ph');
            activeIcon.classList.add('ph-fill');
        }

        const isMobileMode = document.body.classList.contains('mobile-app');
        headerTitle.textContent = (isMobileMode && mobileTitles[targetId]) ? mobileTitles[targetId] : this.textContent.trim();
        if (isMobileMode) syncMobileNav(targetId);
        loadView(targetId); // FETCH THE HTML FILE

        if(window.innerWidth < 1024) toggleSidebar(false);
    });
});

// --- Role-Based Access Control (RBAC) Simulation ---
const systemUsers = {
    superadmin: { name: 'System Admin', role: 'Super Admin', initials: 'SA', color: 'bg-slate-800' },
    owner: { name: 'Admin', role: 'Shop Owner', initials: 'IG', color: 'bg-blue-600' },
    chief: { name: 'Larpus', role: 'Chief Mechanic', initials: 'JB', color: 'bg-purple-600' },
    sub: { name: 'Hiyo', role: 'Sub-Mechanic', initials: 'F', color: 'bg-slate-600' },
    cashier: { name: 'Sarah Lee', role: 'Cashier', initials: 'SL', color: 'bg-emerald-600' }
};

let currentRole = 'owner';

function switchRole(roleId) {
    const user = systemUsers[roleId];
    currentRole = roleId;

    // 0. Chief / Sub-Mechanic run in the mobile-app UI; every other role keeps the desktop UI
    const wasMobile = document.body.classList.contains('mobile-app');
    const isMobile = applyMobileMode(roleId);
    document.querySelectorAll('#role-switcher, #m-role-switcher').forEach(s => { s.value = roleId; });
    
    // 1. Update Profile UI
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-role-text').textContent = user.role;
    const avatar = document.getElementById('user-avatar');
    avatar.textContent = user.initials;
    avatar.className = `w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-inner ${user.color}`;

    // 2. Hide/Show Nav Links based on data-roles attribute
    const allNavLinks = document.querySelectorAll('.nav-link[data-roles]');
    let isCurrentViewAllowed = false;
    const currentActiveTarget = document.querySelector('.nav-link.active')?.getAttribute('data-target');

    allNavLinks.forEach(link => {
        const allowedRoles = link.getAttribute('data-roles').split(',');
        
        if (allowedRoles.includes(roleId)) {
            link.style.display = 'flex'; // Show link
            if (link.getAttribute('data-target') === currentActiveTarget) {
                isCurrentViewAllowed = true;
            }
        } else {
            link.style.display = 'none'; // Hide link
        }
    });

    // 3. Hide/Show Header Sections (Admin & Settings are Owner Only)
    const adminHeader = document.getElementById('nav-header-admin');
    const settingsHeader = document.getElementById('nav-header-settings');
    
    if (roleId === 'owner') {
        if(adminHeader) adminHeader.style.display = 'block';
        if(settingsHeader) settingsHeader.style.display = 'block';
    } else {
        if(adminHeader) adminHeader.style.display = 'none';
        if(settingsHeader) settingsHeader.style.display = 'none';
    }

    // 4. Force redirect to Dashboard if the user is currently on a restricted page
    if (!isCurrentViewAllowed) {
        document.querySelector('.nav-link[data-target="dashboard"]').click();
    } else if (wasMobile || isMobile) {
        // Entering/leaving mobile mode (or switching between the two mobile roles): re-render the current screen
        document.querySelector(`.nav-link[data-target="${currentActiveTarget}"]`)?.click();
    }
}

// Trigger initial setup to make sure Dashboard is shown and Owner is logged in
document.addEventListener('DOMContentLoaded', () => {
    switchRole('owner');
    // Simulate clicking the dashboard to load it initially
    document.querySelector('.nav-link[data-target="dashboard"]').click();
});


// --- Event Delegation for Dynamic Content ---
let isScannerConnected = false;

document.addEventListener('click', function(e) {
    
    // 1. Diagnostics Logic
    if (e.target.closest('#btn-connect-scanner')) {
        const connectBtn = e.target.closest('#btn-connect-scanner');
        const btBadge = document.getElementById('bt-badge');
        const btnRunScan = document.getElementById('btn-run-scan');
        const dtcResultsContainer = document.getElementById('dtc-results-container');
        
        if (!isScannerConnected) {
            isScannerConnected = true;
            connectBtn.innerHTML = `<i class="ph ph-x"></i> Disconnect`;
            connectBtn.classList.replace('bg-slate-800', 'bg-slate-200');
            connectBtn.classList.replace('hover:bg-slate-900', 'hover:bg-slate-300');
            connectBtn.classList.replace('text-white', 'text-slate-700');
            btBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected`;
            btBadge.className = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200";
            btnRunScan.disabled = false;
            btnRunScan.classList.remove('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
            btnRunScan.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700', 'shadow-md', 'shadow-blue-500/30');
        } else {
            isScannerConnected = false;
            connectBtn.innerHTML = `<i class="ph-fill ph-bluetooth"></i> Pair / Connect`;
            connectBtn.classList.replace('bg-slate-200', 'bg-slate-800');
            connectBtn.classList.replace('hover:bg-slate-300', 'hover:bg-slate-900');
            connectBtn.classList.replace('text-slate-700', 'text-white');
            btBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500"></span> Disconnected`;
            btBadge.className = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200";
            btnRunScan.disabled = true;
            btnRunScan.classList.add('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
            btnRunScan.classList.remove('bg-blue-600', 'text-white', 'hover:bg-blue-700', 'shadow-md', 'shadow-blue-500/30');
            if(dtcResultsContainer) dtcResultsContainer.classList.add('hidden');
        }
    }

    if (e.target.closest('#btn-run-scan')) {
        const runScanBtn = e.target.closest('#btn-run-scan');
        if(!isScannerConnected) return;
        runScanBtn.disabled = true;
        const dtcResultsContainer = document.getElementById('dtc-results-container');
        const originalContent = runScanBtn.innerHTML;
        runScanBtn.innerHTML = `<i class="ph ph-spinner animate-spin text-2xl"></i> Scanning ECU...`;
        runScanBtn.classList.replace('bg-blue-600', 'bg-blue-400');
        dtcResultsContainer.classList.add('hidden');

        setTimeout(() => {
            runScanBtn.innerHTML = originalContent;
            runScanBtn.disabled = false;
            runScanBtn.classList.replace('bg-blue-400', 'bg-blue-600');
            dtcResultsContainer.classList.remove('hidden');
            dtcResultsContainer.classList.add('animate-[fadeIn_0.5s_ease-out]');
            setTimeout(() => { if (typeof offerAutoAssign === 'function') offerAutoAssign(); }, 700);   // scan finished -> review auto-assigned parts
        }, 1500);
    }

    // 2. Report Tabs
    const reportBtn = e.target.closest('.report-tab-btn');
    if (reportBtn) {
        const targetId = reportBtn.getAttribute('data-target');
        const view = document.getElementById('view-reports');
        if(view) {
            view.querySelectorAll('.report-tab-btn').forEach(b => {
                b.classList.remove('active', 'text-blue-600', 'border-blue-600');
                b.classList.add('text-slate-500', 'border-transparent', 'hover:border-slate-300', 'hover:text-slate-800');
            });
            reportBtn.classList.add('active', 'text-blue-600', 'border-blue-600');
            reportBtn.classList.remove('text-slate-500', 'border-transparent', 'hover:border-slate-300', 'hover:text-slate-800');
            view.querySelectorAll('.report-tab-content').forEach(content => {
                content.classList.toggle('hidden', content.id !== targetId);
                content.classList.toggle('block', content.id === targetId);
            });
        }
    }

    // 3. User Tabs
    const userBtn = e.target.closest('.user-tab-btn');
    if (userBtn) {
        const targetId = userBtn.getAttribute('data-target');
        const view = document.getElementById('view-users');
        if(view) {
            view.querySelectorAll('.user-tab-btn').forEach(b => {
                b.classList.remove('active', 'text-blue-600', 'border-blue-600');
                b.classList.add('text-slate-500', 'border-transparent', 'hover:border-slate-300', 'hover:text-slate-800');
            });
            userBtn.classList.add('active', 'text-blue-600', 'border-blue-600');
            userBtn.classList.remove('text-slate-500', 'border-transparent', 'hover:border-slate-300', 'hover:text-slate-800');
            view.querySelectorAll('.user-tab-content').forEach(content => {
                content.classList.toggle('hidden', content.id !== targetId);
                content.classList.toggle('block', content.id === targetId);
            });
        }
    }
});

// --- Generic Modal Handler ---
function toggleModal(modalId, backdropId, contentId, show, effect = 'scale') {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById(backdropId);
    const content = document.getElementById(contentId);
    if (!modal || !backdrop || !content) return;

    if (show) {
        modal.classList.remove('hidden');
        void modal.offsetWidth; 
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        if(effect === 'scale') {
            content.classList.remove('opacity-0', 'scale-95');
            content.classList.add('opacity-100', 'scale-100');
        } else if(effect === 'slide') {
            content.classList.remove('translate-x-full');
            content.classList.add('translate-x-0');
        }
    } else {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
        if(effect === 'scale') {
            content.classList.remove('opacity-100', 'scale-100');
            content.classList.add('opacity-0', 'scale-95');
        } else if(effect === 'slide') {
            content.classList.remove('translate-x-0');
            content.classList.add('translate-x-full');
        }
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

// --- Active Repairs / Inventory Modals ---

function openPushRepairModal() { 
    const mainSelect = document.getElementById('motorcycle-select');
    const modalSelect = document.getElementById('modal-motorcycle-select');
    if (mainSelect && modalSelect) modalSelect.value = mainSelect.value;
    
    // Reset toggle switch and tabs on open
    const toggle = document.getElementById('toggle-new-reg');
    if(toggle) toggle.checked = false;
    
    const tabsContainer = document.getElementById('registration-tabs-container');
    if(tabsContainer) tabsContainer.classList.add('hidden');

    switchPushRepairTab('existing');
    renderPushPlanSummary();
    toggleModal('modal-push-repair', 'push-repair-backdrop', 'push-repair-content', true); 
    setTimeout(updateDiagStepper, 0);
}

function toggleRegistrationMode(checkbox) {
    const tabsContainer = document.getElementById('registration-tabs-container');
    if (checkbox.checked) {
        tabsContainer.classList.remove('hidden');
        switchPushRepairTab('customer'); // Default to customer when turned on
    } else {
        tabsContainer.classList.add('hidden');
        switchPushRepairTab('existing'); // Revert back to existing dropdown
    }
}
// =====================================================================
// Diagnosis -> Parts plan -> Registration flow
// Auto-assigns parts from the ECU/OBD scan + physical inspection, lets the
// mechanic edit / finalize them, then continues to "Confirm Vehicle for Repair".
// =====================================================================

const fmtPeso = n => '₱ ' + (Number(n) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const sourceBadgeStyles = {
    ecu:      { cls: 'bg-blue-50 text-blue-600 border-blue-200',         icon: 'ph-cpu',    label: 'ECU/OBD' },
    physical: { cls: 'bg-orange-50 text-orange-600 border-orange-200',   icon: 'ph-wrench', label: 'Physical' },
    manual:   { cls: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: 'ph-user',   label: 'Manual' }
};
function sourceBadgesHTML(sources) {
    return (sources && sources.length ? sources : ['manual']).map(s => {
        const b = sourceBadgeStyles[s] || sourceBadgeStyles.manual;
        return `<span class="inline-flex items-center gap-1 ${b.cls} px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider"><i class="ph-bold ${b.icon}"></i> ${b.label}</span>`;
    }).join('');
}

let planReviewed = false;      // true once the mechanic finalized the parts list
let planCommitting = false;
let reviewItems = [];          // working list shown inside the review modal

function escHTML(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

// Adds a part chip to the Repair Plan (shared by the search dropdown, the inspection suggestions and the review modal)
function addPartToPlan(part, opts = {}) {
    if (!part) return false;
    if (part.stock === 0) {
        alert('This item is currently out of stock.');
        return false;
    }

    const container = document.getElementById('selected-parts-container');
    if (!container) return false;

    const qty = Math.max(1, Math.min(opts.qty || 1, part.stock));
    const sources = opts.sources && opts.sources.length ? opts.sources : ['manual'];
    const reasons = opts.reasons || [];

    if (!document.getElementById(`selected-part-${part.id}`)) {
        const html = `
            <div id="selected-part-${part.id}" data-id="${part.id}" data-price="${part.price}" data-sources="${sources.join(',')}" data-reasons="${escHTML(reasons.join(' | '))}"
                 class="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm animate-[fadeIn_0.2s_ease-out]">
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5">
                        <div class="text-sm font-bold text-slate-800 truncate">${part.name}</div>
                        ${sourceBadgesHTML(sources)}
                    </div>
                    <div class="text-xs text-slate-500">₱${part.price.toFixed(2)} / unit · <span class="line-total font-bold text-slate-700">${fmtPeso(part.price * qty)}</span></div>
                    ${reasons.length ? `<div class="text-[10px] text-slate-400 mt-0.5 truncate" title="${escHTML(reasons.join(' | '))}"><i class="ph ph-info"></i> ${escHTML(reasons.join(' · '))}</div>` : ''}
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <div class="flex items-center bg-slate-50 rounded-md border border-slate-200">
                        <button class="px-2.5 py-1 text-slate-400 hover:text-blue-600 btn-qty-minus transition-colors"><i class="ph-bold ph-minus"></i></button>
                        <span class="w-6 text-center text-xs font-bold text-slate-700 qty-val">${qty}</span>
                        <button class="px-2.5 py-1 text-slate-400 hover:text-blue-600 btn-qty-plus transition-colors" data-max="${part.stock}"><i class="ph-bold ph-plus"></i></button>
                    </div>
                    <button class="text-slate-400 hover:bg-red-50 hover:text-red-500 rounded p-1.5 btn-remove-part transition-colors" title="Remove part"><i class="ph-bold ph-x"></i></button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }
    updatePlanTotals();
    return true;
}

// Recalculates line totals, parts total, estimated total, empty state, badge and stepper
function updatePlanTotals() {
    const container = document.getElementById('selected-parts-container');
    if (!container) return;
    let total = 0, count = 0;
    container.querySelectorAll('[id^="selected-part-"]').forEach(chip => {
        const price = parseFloat(chip.dataset.price) || 0;
        const qty = parseInt(chip.querySelector('.qty-val')?.textContent) || 1;
        total += price * qty;
        count++;
        const lt = chip.querySelector('.line-total');
        if (lt) lt.textContent = fmtPeso(price * qty);
    });
    const labor = parseFloat(document.getElementById('labor-cost-input')?.value) || 0;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('plan-parts-count', count);
    set('plan-parts-total', fmtPeso(total));
    set('plan-grand-total', fmtPeso(total + labor));
    document.getElementById('plan-empty')?.classList.toggle('hidden', count > 0);

    const badge = document.getElementById('plan-state-badge');
    if (badge) {
        const done = planReviewed && count > 0;
        badge.textContent = done ? 'Parts finalized' : (count ? 'Needs review' : 'Draft');
        badge.className = 'text-[10px] font-bold px-2 py-1 rounded-full border ' + (done
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : count ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200');
    }
    updateDiagStepper();
}

function hasDiagnosisData() {
    let inspected = 0;
    if (typeof inspectionItems !== 'undefined' && typeof getInspItem === 'function') {
        inspected = inspectionItems.filter(i => getInspItem(i.id).status).length;
    }
    const dtcVisible = document.getElementById('toggle-ecu')?.checked && !document.getElementById('dtc-results-container')?.classList.contains('hidden');
    const findings = (document.getElementById('final-findings')?.value || '').trim();
    return inspected > 0 || !!dtcVisible || !!findings;
}

function updateDiagStepper() {
    const steps = document.querySelectorAll('#diag-stepper .diag-step');
    if (!steps.length) return;
    const pushOpen = !document.getElementById('modal-push-repair')?.classList.contains('hidden');
    const done = [hasDiagnosisData(), planReviewed && document.querySelectorAll('#selected-parts-container [id^="selected-part-"]').length > 0, false];
    let activeSet = false;
    steps.forEach((el, i) => {
        const isDone = done[i];
        const isActive = !isDone && !activeSet || (i === 2 && pushOpen);
        if (isActive) activeSet = true;
        el.classList.toggle('is-done', isDone);
        el.classList.toggle('is-active', isActive && !isDone);
        el.querySelector('.diag-step-dot').innerHTML = isDone ? '<i class="ph-bold ph-check"></i>' : (i + 1);
    });
}

// =====================================================================
// AUTO-ASSIGN RULE ENGINE (if / else)
// Reads the diagnosis (ECU codes, inspection results, odometer, complaints)
// and decides which inventory parts to assign. The mechanic edits the result
// in the Review screen before finalizing.
//   level 'fix'   -> recommended (pre-ticked when in stock)
//   level 'watch' -> optional   (unticked)
// =====================================================================

let reviewNotes = [];           // diagnosis items that need labor/service only (no stock part)
let autoAssignPrompted = false; // pop the review screen once when the inspection is completed

// ECU / OBD trouble code -> parts
function partsForDtc(code) {
    const c = String(code || '').toUpperCase();
    const out = [];
    if (c === 'P0117' || c === 'P0118' || c === 'P0119') {
        out.push({ id: 'p1', qty: 1 });                       // coolant temp sensor circuit
    } else if (/^P030[0-6]$/.test(c)) {
        out.push({ id: 'p5', qty: 1 });                       // misfire -> spark plug
    } else if (c === 'P0562' || c === 'P0563') {
        out.push({ id: 'p10', qty: 1 });                      // system voltage -> battery
    } else if (c === 'P0171' || c === 'P0172') {
        out.push({ id: 'p6', qty: 1 });                       // fuel trim -> air filter
        out.push({ id: 'p5', qty: 1 });
    } else if (c === 'P0217') {
        out.push({ id: 'p16', qty: 1 });                      // overtemp -> coolant
    }
    return out;
}

// One inspection item (status Fix / Watch) -> parts
function partsForInspectionItem(item, st) {
    const out = [];
    const has = (...tags) => tags.some(t => st.tags.includes(t));
    const isFix = st.status === 'fix';
    const push = (id, qty, why) => out.push({ id, qty: qty || 1, why });

    if (item.id === 'tire_f' || item.id === 'tire_r') {
        const front = item.id === 'tire_f';
        if (has('Puncture / nail') && !has('Cracked sidewall', 'Bulge', 'Worn tread')) {
            push('p22', 1, 'Puncture repair only');           // patch / sealant kit, tire still usable
        } else {
            push(front ? 'p8' : 'p9', 1);                     // replace the tire
        }
    } else if (item.id === 'psi_f' || item.id === 'psi_r') {
        if (has('Slow leak')) push('p22', 1, 'Slow leak');
    } else if (item.id === 'pad_f') {
        push('p2', 1);
    } else if (item.id === 'pad_r') {
        push('p20', 1);
    } else if (item.id === 'brake_fluid') {
        push('p7', 1);
    } else if (item.id === 'brake_feel') {
        if (has('Spongy', 'Too soft')) push('p7', 1, 'Bleed brake line');
    } else if (item.id === 'brake_disc') {
        if (has('Warped', 'Scored', 'Below min thickness')) push('p21', 1);
    } else if (item.id === 'oil') {
        push('p4', 1);
        if (isFix && has('Black / dirty', 'Milky', 'Overdue change')) push('p15', 1, 'Change filter with oil');
    } else if (item.id === 'coolant') {
        push('p16', 1);
    } else if (item.id === 'air_filter') {
        push('p6', 1);
    } else if (item.id === 'spark') {
        push('p5', 1);
    } else if (item.id === 'leaks') {
        if (has('Engine oil')) push('p4', 1, 'Top up after leak repair');
        else if (has('Coolant')) push('p16', 1, 'Top up after leak repair');
    } else if (item.id === 'chain') {
        if (has('Cracked belt')) push('p3', 1);                          // CVT drive belt
        else if (has('Dry / rusty') && !isFix) push('p23', 1);           // just lube it
        else if (isFix || has('Stretched', 'Too loose', 'Too tight')) push('p13', 1);  // chain + sprocket set
    } else if (item.id === 'sprocket') {
        if (has('Worn rollers', 'Flat spots')) push('p14', 1);           // CVT rollers
        else push('p13', 1);
    } else if (item.id === 'clutch') {
        if (has('Cable frayed')) push('p17', 1);
    } else if (item.id === 'battery') {
        const onlyTerminals = has('Corroded terminals') && !has('Weak', 'Swollen', 'Old (2+ years)');
        if (!onlyTerminals || isFix) push('p10', 1);                     // terminal cleaning alone needs no part
    } else if (item.id === 'charging') {
        if (has('Bad regulator', 'Overcharging')) push('p18', 1);
    } else if (item.id === 'lights') {
        if (has('Headlight out')) push('p11', 1);
        if (has('Brake light out')) push('p12', 1);
        if (has('Signal out')) push('p25', 1);
    } else if (item.id === 'fork') {
        if (has('Leaking seals')) push('p19', 1);
    }
    // everything else (wheels, shocks, steering, frame, horn, starter...) = labor / service, no stock part
    return out;
}

// Odometer + complaints -> maintenance parts (always optional)
function partsForServiceAndComplaints(odo, complaints) {
    const out = [];
    const km = parseInt(odo, 10);

    if (complaints.includes('Regular maintenance')) {
        if (isNaN(km)) {
            out.push({ id: 'p4', qty: 1, why: 'Regular maintenance (enter odometer for full interval)' });
        } else {
            if (km >= 3000)  out.push({ id: 'p4',  qty: 1, why: `Oil change interval (${km.toLocaleString()} km)` });
            if (km >= 6000)  out.push({ id: 'p15', qty: 1, why: 'Oil filter interval (6,000 km)' });
            if (km >= 10000) out.push({ id: 'p5',  qty: 1, why: 'Spark plug interval (10,000 km)' });
            if (km >= 12000) out.push({ id: 'p6',  qty: 1, why: 'Air filter interval (12,000 km)' });
            if (km >= 20000) out.push({ id: 'p3',  qty: 1, why: 'Drive belt interval (20,000 km)' });
        }
    }
    complaints.forEach(c => {
        if (c === 'Overheating') out.push({ id: 'p16', qty: 1, why: 'Complaint: Overheating' });
        else if (c === 'Hard to start') out.push({ id: 'p5', qty: 1, why: 'Complaint: Hard to start' });
        else if (c === 'Poor acceleration') out.push({ id: 'p6', qty: 1, why: 'Complaint: Poor acceleration' });
        else if (c === 'Brake problem') out.push({ id: 'p7', qty: 1, why: 'Complaint: Brake problem' });
        else if (c === 'Oil leak') out.push({ id: 'p4', qty: 1, why: 'Complaint: Oil leak (top up)' });
    });
    return out;
}

// Diagnosis -> suggested parts (merged, de-duplicated)
function buildDiagnosisSuggestions() {
    const list = [];
    reviewNotes = [];

    const add = (id, source, reason, level, qty) => {
        const part = mockInventory.find(p => p.id === id);
        if (!part) return;
        const q = Math.max(1, Math.min(qty || 1, part.stock || 1));
        let s = list.find(x => x.id === id);
        if (!s) {
            s = { id, qty: q, sources: [], reasons: [], level, checked: level !== 'watch' && part.stock > 0 };
            list.push(s);
        } else {
            s.qty = Math.max(s.qty, q);
        }
        if (!s.sources.includes(source)) s.sources.push(source);
        if (reason && !s.reasons.includes(reason)) s.reasons.push(reason);
        if (level !== 'watch' && s.level === 'watch') { s.level = level; s.checked = part.stock > 0; }
    };

    // 1. ECU / OBD codes currently shown in the results table
    const dtcVisible = document.getElementById('toggle-ecu')?.checked && !document.getElementById('dtc-results-container')?.classList.contains('hidden');
    if (dtcVisible) {
        document.querySelectorAll('#dtc-results-container tbody tr').forEach(tr => {
            const cells = tr.querySelectorAll('td');
            const code = cells[0]?.textContent.trim();
            if (!code) return;
            const desc = cells[1]?.textContent.trim() || '';
            const found = partsForDtc(code);
            if (found.length) found.forEach(p => add(p.id, 'ecu', `${code}: ${desc}`, 'fix', p.qty));
            else reviewNotes.push(`${code}${desc ? ' (' + desc + ')' : ''}: no stock part mapped. Needs mechanic's diagnosis.`);
        });
    }

    // 2. Physical inspection: Fix -> recommended, Watch -> optional
    const physicalOn = document.getElementById('toggle-physical')?.checked !== false;
    if (physicalOn && typeof inspectionItems !== 'undefined' && typeof getInspItem === 'function') {
        inspectionItems.forEach(item => {
            const st = getInspItem(item.id);
            if (st.status !== 'fix' && st.status !== 'watch') return;
            const statusLabel = st.status === 'fix' ? 'Fix' : 'Watch';
            const detail = [...st.tags, st.value !== '' && item.measure ? `${st.value} ${item.measure.unit}` : ''].filter(Boolean).join(', ');
            const found = partsForInspectionItem(item, st);

            if (found.length) {
                found.forEach(p => add(p.id, 'physical', `${item.label} (${statusLabel})${detail ? ': ' + detail : ''}${p.why ? ' · ' + p.why : ''}`, st.status, p.qty));
            } else if (st.status === 'fix') {
                reviewNotes.push(`${item.label}${detail ? ' (' + detail + ')' : ''}: labor / service only, no stock part needed.`);
            }
        });

        // 3. Odometer service intervals + customer complaints (optional suggestions)
        const { odo, complaints } = inspectionState.intake;
        partsForServiceAndComplaints(odo, complaints).forEach(p => add(p.id, 'physical', p.why, 'watch', p.qty));
    }
    return list;
}

// Pops the review screen when the diagnosis produced suggestions
function offerAutoAssign() {
    const open = id => !document.getElementById(id)?.classList.contains('hidden');
    if (!document.getElementById('modal-auto-assign') || open('modal-auto-assign') || open('modal-push-repair')) return;
    if (buildDiagnosisSuggestions().length > 0) openAutoAssignModal();
}

// Called after inspection edits: once every item is checked, pop the screen
function maybeAutoPopAssign() {
    if (typeof inspectionItems === 'undefined') return;
    const done = inspectionItems.filter(i => getInspItem(i.id).status).length;
    if (done < inspectionItems.length) { autoAssignPrompted = false; return; }
    if (autoAssignPrompted) return;
    autoAssignPrompted = true;
    setTimeout(offerAutoAssign, 400);
}

function openAutoAssignModal() {
    reviewItems = buildDiagnosisSuggestions();

    // Merge anything already in the plan (keep mechanic's qty / manual items)
    document.querySelectorAll('#selected-parts-container [id^="selected-part-"]').forEach(chip => {
        const id = chip.dataset.id;
        const qty = parseInt(chip.querySelector('.qty-val')?.textContent) || 1;
        const existing = reviewItems.find(r => r.id === id);
        if (existing) {
            existing.qty = qty; existing.checked = true;
        } else {
            reviewItems.push({
                id, qty, checked: true, level: 'manual',
                sources: (chip.dataset.sources || 'manual').split(','),
                reasons: chip.dataset.reasons ? chip.dataset.reasons.split(' | ') : []
            });
        }
    });

    const modalSearch = document.getElementById('modal-manual-search');
    if (modalSearch) modalSearch.value = '';
    renderReviewList();
    toggleModal('modal-auto-assign', 'auto-assign-backdrop', 'auto-assign-content', true);
}

function renderReviewList() {
    const wrap = document.getElementById('ra-list');
    if (!wrap) return;

    const groups = [
        { key: 'rec',    title: 'Recommended replacements',  note: 'Based on ECU codes and items marked Fix', icon: 'ph-seal-check', tone: 'text-red-600',     filter: r => r.level === 'fix' || r.level === 'ecu' },
        { key: 'watch',  title: 'Optional: flagged Watch',   note: 'Worn but not critical. Tick to include',  icon: 'ph-warning',    tone: 'text-amber-600',   filter: r => r.level === 'watch' },
        { key: 'manual', title: 'Added by mechanic',         note: 'Manually added or kept from your plan',   icon: 'ph-user',       tone: 'text-emerald-600', filter: r => r.level === 'manual' }
    ];

    const rowHTML = r => {
        const part = mockInventory.find(p => p.id === r.id);
        if (!part) return '';
        const out = part.stock === 0;
        const low = !out && part.stock <= 3;
        const stockTxt = out ? '<span class="text-red-600 font-bold">Out of stock · order needed</span>'
            : `<span class="${low ? 'text-amber-600' : 'text-emerald-600'} font-semibold">In stock: ${part.stock}${low ? ' (low)' : ''}</span>`;
        return `
        <div class="flex items-start gap-3 p-3 bg-white rounded-xl border ${r.checked ? 'border-purple-200 ring-1 ring-purple-100' : 'border-slate-200'} shadow-sm ${out ? 'opacity-70' : ''}">
            <input type="checkbox" data-ra="toggle" data-id="${r.id}" ${r.checked ? 'checked' : ''} ${out ? 'disabled' : ''} class="mt-1 w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer">
            <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span class="text-sm font-bold text-slate-800">${part.name}</span>
                    ${sourceBadgesHTML(r.sources)}
                </div>
                ${r.reasons.length ? `<div class="text-[11px] text-slate-500 mt-0.5">${r.reasons.map(escHTML).join('<br>')}</div>` : ''}
                <div class="text-[11px] text-slate-500 mt-1">${fmtPeso(part.price)} each · ${stockTxt}</div>
            </div>
            <div class="flex flex-col items-end gap-1.5 shrink-0">
                <div class="flex items-center bg-slate-50 rounded-md border border-slate-200 shadow-sm ${r.checked && !out ? '' : 'opacity-40 pointer-events-none'}">
                    <button data-ra="minus" data-id="${r.id}" class="px-2 py-1 text-slate-400 hover:text-purple-600 transition-colors"><i class="ph-bold ph-minus"></i></button>
                    <span class="w-6 text-center text-xs font-bold text-slate-700">${r.qty}</span>
                    <button data-ra="plus" data-id="${r.id}" class="px-2 py-1 text-slate-400 hover:text-purple-600 transition-colors"><i class="ph-bold ph-plus"></i></button>
                </div>
                <div class="text-xs font-extrabold ${r.checked ? 'text-slate-800' : 'text-slate-300'}">${fmtPeso(part.price * r.qty)}</div>
                ${r.level === 'manual' ? `<button data-ra="remove" data-id="${r.id}" class="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1"><i class="ph-bold ph-trash"></i> Remove</button>` : ''}
            </div>
        </div>`;
    };

    let html = groups.map(g => {
        const rows = reviewItems.filter(g.filter);
        if (!rows.length) return '';
        return `<div class="flex flex-col gap-2">
            <div class="flex items-baseline justify-between gap-2 px-1">
                <span class="text-[11px] font-bold uppercase tracking-wider ${g.tone} flex items-center gap-1.5"><i class="ph-fill ${g.icon} text-sm"></i> ${g.title} (${rows.length})</span>
                <span class="text-[10px] text-slate-400 hidden sm:inline">${g.note}</span>
            </div>
            ${rows.map(rowHTML).join('')}
        </div>`;
    }).join('');

    if (!reviewItems.length) {
        html = `<div class="border border-dashed border-slate-300 rounded-xl p-6 text-center bg-white">
            <i class="ph-fill ph-clipboard-text text-3xl text-slate-300 block mb-1"></i>
            <p class="text-sm font-bold text-slate-500">No parts matched the diagnosis.</p>
            <p class="text-xs text-slate-400 mt-0.5">Mark items as <b>Fix</b> in the inspection or run an ECU scan, or add parts manually below.</p>
        </div>`;
    }
    if (reviewNotes.length) {
        html += `<div class="rounded-xl border border-slate-200 bg-white p-3 text-[11px] text-slate-500">
            <p class="font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5"><i class="ph-fill ph-info text-slate-400"></i> No stock part needed / mapped</p>
            <ul class="list-disc pl-4 flex flex-col gap-0.5">${reviewNotes.map(n => `<li>${escHTML(n)}</li>`).join('')}</ul>
        </div>`;
    }
    wrap.innerHTML = html;

    // Basis chips
    const fixN = reviewItems.filter(r => r.level === 'fix' || r.level === 'ecu').length;
    const watchN = reviewItems.filter(r => r.level === 'watch').length;
    const ecuN = reviewItems.filter(r => r.sources.includes('ecu')).length;
    const basis = document.getElementById('ra-basis');
    if (basis) {
        const chip = (cls, txt) => `<span class="px-2 py-1 rounded-full border ${cls}">${txt}</span>`;
        basis.innerHTML = hasDiagnosisData()
            ? [chip('bg-blue-50 text-blue-600 border-blue-200', `${ecuN} from ECU/OBD`),
               chip('bg-red-50 text-red-600 border-red-200', `${fixN} recommended`),
               chip('bg-amber-50 text-amber-600 border-amber-200', `${watchN} optional`)].join('')
            : chip('bg-slate-100 text-slate-500 border-slate-200', 'No diagnosis recorded yet. Add parts manually.');
    }

    // Totals
    let total = 0, n = 0;
    reviewItems.forEach(r => {
        const part = mockInventory.find(p => p.id === r.id);
        if (part && r.checked) { total += part.price * r.qty; n++; }
    });
    const totalEl = document.getElementById('auto-assign-total');
    if (totalEl) totalEl.textContent = fmtPeso(total);
    const countEl = document.getElementById('ra-count');
    if (countEl) countEl.textContent = n;
}

function closeAutoAssignModal() {
    toggleModal('modal-auto-assign', 'auto-assign-backdrop', 'auto-assign-content', false);
}

// Review modal interactions (single set of delegated listeners)
document.addEventListener('click', function(e) {
    const ra = e.target.closest('#ra-list [data-ra]');
    if (ra && ra.dataset.ra !== 'toggle') {
        const r = reviewItems.find(x => x.id === ra.dataset.id);
        const part = r && mockInventory.find(p => p.id === r.id);
        if (r && part) {
            if (ra.dataset.ra === 'minus' && r.qty > 1) r.qty--;
            else if (ra.dataset.ra === 'plus') {
                if (r.qty < part.stock) r.qty++;
                else alert(`Only ${part.stock} units available in stock.`);
            } else if (ra.dataset.ra === 'remove') reviewItems = reviewItems.filter(x => x !== r);
            renderReviewList();
        }
    }

    // Add part from the modal search
    const item = e.target.closest('.modal-autocomplete-item');
    if (item) {
        const part = mockInventory.find(p => p.id === item.dataset.id);
        if (part && part.stock > 0) {
            const existing = reviewItems.find(r => r.id === part.id);
            if (existing) existing.checked = true;
            else reviewItems.push({ id: part.id, qty: 1, checked: true, level: 'manual', sources: ['manual'], reasons: [] });
            renderReviewList();
        }
        document.getElementById('modal-manual-search').value = '';
        document.getElementById('modal-manual-autocomplete').classList.add('hidden');
    } else if (!e.target.closest('#modal-manual-search')) {
        document.getElementById('modal-manual-autocomplete')?.classList.add('hidden');
    }

    // Keep plan totals / stepper fresh after any qty / remove click or typing in the diagnostics view
    if (e.target.closest('#view-diagnostics') || e.target.closest('#modal-push-repair')) {
        if (e.target.closest('#selected-parts-container .btn-qty-minus, #selected-parts-container .btn-qty-plus, #selected-parts-container .btn-remove-part') && !planCommitting) planReviewed = false;
        setTimeout(updatePlanTotals, 0);
    }
});

document.addEventListener('change', function(e) {
    if (e.target.matches && e.target.matches('#ra-list [data-ra="toggle"]')) {
        const r = reviewItems.find(x => x.id === e.target.dataset.id);
        if (r) { r.checked = e.target.checked; renderReviewList(); }
    }
    if (e.target.id === 'toggle-ecu' || e.target.id === 'toggle-physical') setTimeout(updatePlanTotals, 0);
});

document.addEventListener('input', function(e) {
    if (e.target.id === 'labor-cost-input' || e.target.id === 'final-findings') updatePlanTotals();

    if (e.target.id === 'modal-manual-search') {
        const query = e.target.value.toLowerCase();
        const dropdown = document.getElementById('modal-manual-autocomplete');
        if (!query) { dropdown.classList.add('hidden'); return; }

        const matches = mockInventory.filter(p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query));
        dropdown.innerHTML = matches.length ? matches.map(part => `
            <div class="p-2 border-b border-slate-100 hover:bg-slate-50 ${part.stock > 0 ? 'cursor-pointer modal-autocomplete-item' : 'opacity-50'} flex justify-between items-center" data-id="${part.id}">
                <div>
                    <div class="text-xs font-bold text-slate-800">${part.name}</div>
                    <div class="text-[9px] ${part.stock > 0 ? 'text-slate-500' : 'text-red-500 font-bold'}">${part.stock > 0 ? 'Stock: ' + part.stock : 'Out of stock'}</div>
                </div>
                <div class="text-xs font-bold text-emerald-600">₱${part.price.toFixed(2)}</div>
            </div>
        `).join('') : `<div class="p-3 text-xs text-slate-500 text-center">No parts found.</div>`;
        dropdown.classList.remove('hidden');
    }
});

// Commit the reviewed list into the Repair Plan; optionally continue to registration
function confirmAutoAssign(event, proceed) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Saving...`;
    btn.disabled = true;

    setTimeout(() => {
        const container = document.getElementById('selected-parts-container');
        if (container) {
            planCommitting = true;
            container.innerHTML = '';
            reviewItems.filter(r => r.checked).forEach(r => {
                const part = mockInventory.find(p => p.id === r.id);
                addPartToPlan(part, { qty: r.qty, sources: r.sources, reasons: r.reasons });
            });
            planReviewed = true;
            planCommitting = false;
            updatePlanTotals();
        }

        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeAutoAssignModal();
        if (proceed) setTimeout(openPushRepairModal, 320);
    }, 400);
}

// "Proceed" button: auto-assign from diagnosis -> mechanic edits/finalizes -> registration
function proceedFromDiagnosis() {
    if (!hasDiagnosisData() && !confirm('No diagnosis has been recorded yet (no inspection results, ECU codes or findings).\n\nContinue anyway?')) return;
    openAutoAssignModal();
}

function renderPushPlanSummary() {
    const box = document.getElementById('push-plan-summary');
    if (!box) return;
    const chips = [...document.querySelectorAll('#selected-parts-container [id^="selected-part-"]')];
    const labor = parseFloat(document.getElementById('labor-cost-input')?.value) || 0;
    let parts = 0;
    const rows = chips.map(chip => {
        const price = parseFloat(chip.dataset.price) || 0;
        const qty = parseInt(chip.querySelector('.qty-val')?.textContent) || 1;
        parts += price * qty;
        const name = chip.querySelector('.text-sm')?.textContent || '';
        return `<li class="flex justify-between gap-2"><span class="truncate">${qty} × ${escHTML(name)}</span><span class="font-semibold shrink-0">${fmtPeso(price * qty)}</span></li>`;
    });
    box.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
            <span class="font-bold text-blue-700 uppercase text-[11px] tracking-wider flex items-center gap-1.5"><i class="ph-fill ph-wrench"></i> Repair plan</span>
            <button type="button" onclick="closePushRepairModal(); setTimeout(openAutoAssignModal, 320);" class="text-[10px] font-bold text-blue-600 hover:underline">Edit parts</button>
        </div>
        ${chips.length ? `<ul class="flex flex-col gap-1 text-slate-600 mb-2">${rows.join('')}</ul>` : '<p class="text-slate-500 mb-2">No parts assigned (labor / inspection only).</p>'}
        <div class="border-t border-blue-100 pt-1.5 flex justify-between font-bold text-slate-800"><span>Est. total (parts${labor ? ' + labor' : ''})</span><span>${fmtPeso(parts + labor)}</span></div>`;
}

window.toggleRejectReason = function(checkbox, reasonId) {
    const reasonDiv = document.getElementById(reasonId);
    if(reasonDiv) {
        if(!checkbox.checked) {
            reasonDiv.classList.remove('hidden');
        } else {
            reasonDiv.classList.add('hidden');
        }
    }
};
function closePushRepairModal() { 
    toggleModal('modal-push-repair', 'push-repair-backdrop', 'push-repair-content', false); 
}

function confirmPushRepair(event) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    
    // Show a loading state on the button
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Pushing...`;
    btn.disabled = true;

    // Simulate network delay, close the modal, and redirect to the Repairs page
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closePushRepairModal();
        
        alert("Vehicle successfully pushed to the Active Repairs queue!");
        clearInspectionDraft();
        const planBox = document.getElementById('selected-parts-container');
        if (planBox) planBox.innerHTML = '';
        const laborInput = document.getElementById('labor-cost-input');
        if (laborInput) laborInput.value = '';
        planReviewed = false;
        updatePlanTotals();
        
        // Auto-navigate user to the active repairs tab
        const repairsLink = document.querySelector('.nav-link[data-target="repairs"]');
        if (repairsLink) repairsLink.click();
    }, 800);
}

function switchPushRepairTab(tabKey) {
    const tabs = ['existing', 'customer', 'vehicle'];
    tabs.forEach(key => {
        const pane = document.getElementById(`pane-push-${key}`);
        const btn = document.getElementById(`tab-btn-${key}`);
        if (pane) pane.classList.toggle('hidden', key !== tabKey);
        if (btn) {
            if (key === tabKey) {
                btn.className = 'py-2 rounded-lg transition-all bg-white text-blue-600 shadow-sm font-bold text-center';
            } else {
                btn.className = 'py-2 rounded-lg transition-all text-slate-600 hover:text-slate-900 text-center';
            }
        }
    });
}

function saveQuickCustomer() {
    const first = document.getElementById('quick-cust-first').value.trim();
    const last = document.getElementById('quick-cust-last').value.trim();
    const phone = document.getElementById('quick-cust-phone').value.trim();

    if (!first || !last || !phone) {
        alert('Please provide the first name, last name, and phone number.');
        return;
    }

    const fullName = `${first} ${last}`;
    const vehOwnerSelect = document.getElementById('quick-veh-owner');
    if (vehOwnerSelect) {
        const opt = new Option(`${fullName} (${phone})`, fullName, true, true);
        vehOwnerSelect.add(opt);
    }

    alert(`Customer "${fullName}" added. You can now register their vehicle or proceed.`);
    switchPushRepairTab('vehicle');
}

function saveQuickVehicle() {
    const owner = document.getElementById('quick-veh-owner').value;
    const brand = document.getElementById('quick-veh-brand').value;
    const model = document.getElementById('quick-veh-model').value.trim();
    const plate = document.getElementById('quick-veh-plate').value.trim();

    if (!plate || !model) {
        alert('Please provide both the model and plate number.');
        return;
    }

    const label = `${owner} - ${brand} ${model} (${plate})`;
    const modalSelect = document.getElementById('modal-motorcycle-select');
    const mainSelect = document.getElementById('motorcycle-select');

    if (modalSelect) {
        const opt = new Option(label, `custom-${Date.now()}`, true, true);
        modalSelect.add(opt);
    }
    if (mainSelect) {
        const opt2 = new Option(label, `custom-${Date.now()}`, true, true);
        mainSelect.add(opt2);
    }

    switchPushRepairTab('existing');
}
function openRepairModal() { toggleModal('repair-modal', 'repair-modal-backdrop', 'repair-modal-content', true); }
function closeRepairModal() { toggleModal('repair-modal', 'repair-modal-backdrop', 'repair-modal-content', false); }
function completeJob(event) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Sending to Cashier...`;
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeRepairModal();
        alert("Job successfully marked ready for billing and pushed to Cashier.");
    }, 800);
}

function openAddPartModal() { toggleModal('modal-add-part', 'add-part-backdrop', 'add-part-content', true); }
function closeAddPartModal() { toggleModal('modal-add-part', 'add-part-backdrop', 'add-part-content', false); }
function openRestockModal() { toggleModal('modal-restock', 'restock-backdrop', 'restock-content', true); }
function closeRestockModal() { toggleModal('modal-restock', 'restock-backdrop', 'restock-content', false); }
function openWalkInModalInv(itemName, itemPrice) {
    document.getElementById('walkin-inv-item-name').textContent = itemName;
    document.getElementById('walkin-inv-item-price').textContent = "₱" + itemPrice;
    toggleModal('modal-walk-in-inv', 'walkin-inv-backdrop', 'walkin-inv-content', true);
}
function closeWalkInModalInv() { toggleModal('modal-walk-in-inv', 'walkin-inv-backdrop', 'walkin-inv-content', false); }
function confirmWalkInSaleInv(event) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Processing...`;
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeWalkInModalInv();
        alert("Payment Confirmed! Stock has been deducted automatically.");
    }, 800);
}

// --- Transactions & Billing Logic ---
function openWalkInCheckout() { 
    document.getElementById('walkin-tendered').value = "";
    document.getElementById('walkin-change').textContent = "0.00";
    toggleModal('modal-txn-walkin', 'txn-walkin-backdrop', 'txn-walkin-content', true); 
}
function closeWalkInCheckout() { toggleModal('modal-txn-walkin', 'txn-walkin-backdrop', 'txn-walkin-content', false); }

function calcWalkinChange() {
    const totalDue = 850.00;
    const tendered = parseFloat(document.getElementById('walkin-tendered').value) || 0;
    const changeLabel = document.getElementById('walkin-change');
    if (tendered >= totalDue) {
        changeLabel.textContent = (tendered - totalDue).toFixed(2);
        changeLabel.parentElement.classList.remove('text-red-400');
        changeLabel.parentElement.classList.add('text-emerald-400');
    } else {
        changeLabel.textContent = "0.00";
        changeLabel.parentElement.classList.remove('text-emerald-400');
        changeLabel.parentElement.classList.add('text-red-400');
    }
}

function processWalkinPayment(event) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Processing...`;
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeWalkInCheckout();
        openReceiptModal();
    }, 800);
}

function openRepairCheckout(isFinalSettlement) {
    document.getElementById('repair-tendered').value = "";
    document.getElementById('repair-change').textContent = "0.00";
    
    const btnAdvance = document.getElementById('btn-advance-payment');
    const btnSettle = document.getElementById('btn-settle-balance');

    if(isFinalSettlement) {
        btnAdvance.classList.add('hidden');
        btnSettle.classList.remove('hidden');
    } else {
        btnAdvance.classList.remove('hidden');
        btnSettle.classList.add('hidden');
    }
    toggleModal('modal-txn-repair', 'txn-repair-backdrop', 'txn-repair-content', true);
}
function closeRepairCheckout() { toggleModal('modal-txn-repair', 'txn-repair-backdrop', 'txn-repair-content', false); }

function calcRepairChange() {
    const remainingBalance = 2000.00;
    const tendered = parseFloat(document.getElementById('repair-tendered').value) || 0;
    const changeLabel = document.getElementById('repair-change');
    if (tendered >= remainingBalance) {
        changeLabel.textContent = (tendered - remainingBalance).toFixed(2);
        changeLabel.classList.remove('text-red-400');
        changeLabel.classList.add('text-emerald-400');
    } else {
        changeLabel.textContent = "0.00";
        changeLabel.classList.remove('text-emerald-400');
        changeLabel.classList.add('text-red-400');
    }
}

function processRepairPayment(event) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Finalizing Job...`;
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeRepairCheckout();
        openReceiptModal();
    }, 1000);
}

function openReceiptModal() { toggleModal('modal-receipt', 'receipt-backdrop', 'receipt-content', true); }
function closeReceiptModal() { toggleModal('modal-receipt', 'receipt-backdrop', 'receipt-content', false); }

// --- Service History & Audit Logic ---
function openHistoryDetailModal() { toggleModal('modal-history-detail', 'history-detail-backdrop', 'history-detail-content', true); }
function closeHistoryDetailModal() { toggleModal('modal-history-detail', 'history-detail-backdrop', 'history-detail-content', false); }

function openTimelineModal(plate, model) {
    document.getElementById('timeline-vehicle-details').textContent = `${plate} • ${model}`;
    toggleModal('modal-history-timeline', 'history-timeline-backdrop', 'history-timeline-content', true, 'slide');
}
function closeTimelineModal() { toggleModal('modal-history-timeline', 'history-timeline-backdrop', 'history-timeline-content', false, 'slide'); }

function toggleAuditDetail(detailId) {
    const detailRow = document.getElementById(detailId);
    const iconId = detailId.replace('audit-detail-', 'audit-icon-');
    const icon = document.getElementById(iconId);
    if(detailRow.classList.contains('hidden')) {
        detailRow.classList.remove('hidden');
        if(icon) icon.classList.add('rotate-180');
    } else {
        detailRow.classList.add('hidden');
        if(icon) icon.classList.remove('rotate-180');
    }
}

// --- User Management Logic ---
function openUserModal() { toggleModal('modal-user-form', 'user-form-backdrop', 'user-form-content', true); }
function closeUserModal() { toggleModal('modal-user-form', 'user-form-backdrop', 'user-form-content', false); }

// --- Customers & Motorcycles Logic ---
function toggleCustomerRow(rowId) {
    const detailRow = document.getElementById(rowId);
    const iconId = rowId.replace('cust-row-', 'cust-icon-');
    const icon = document.getElementById(iconId);
    
    if(detailRow.classList.contains('hidden')) {
        detailRow.classList.remove('hidden');
        if(icon) icon.classList.add('rotate-180', 'text-blue-500');
    } else {
        detailRow.classList.add('hidden');
        if(icon) icon.classList.remove('rotate-180', 'text-blue-500');
    }
}

function openCustomerModal() { toggleModal('modal-customer', 'customer-backdrop', 'customer-content', true); }
function closeCustomerModal() { toggleModal('modal-customer', 'customer-backdrop', 'customer-content', false); }

function openMotorcycleModal() { toggleModal('modal-motorcycle', 'motorcycle-backdrop', 'motorcycle-content', true); }
function closeMotorcycleModal() { toggleModal('modal-motorcycle', 'motorcycle-backdrop', 'motorcycle-content', false); }

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCustomerModal();
        closeMotorcycleModal();
    }
});

function createRepairTicket(modelName, plateNumber) {
    if(confirm(`Do you want to create a new active repair ticket and run a diagnostic scan for:\n\n${modelName} (${plateNumber})?`)) {
        const diagLink = document.querySelector('.nav-link[data-target="diagnostics"]');
        if (diagLink) {
            diagLink.click();
        }
    }
}

// --- New Advance Payment Modal Logic ---
function openAdvanceModal() { 
    document.getElementById('advance-amount').value = "";
    document.getElementById('advance-remaining').textContent = "₱1,800.00";
    toggleModal('modal-advance', 'advance-backdrop', 'advance-content', true); 
}
function closeAdvanceModal() { toggleModal('modal-advance', 'advance-backdrop', 'advance-content', false); }

function calcRemainingAdvance() {
    const estimatedCost = 1800.00;
    const advance = parseFloat(document.getElementById('advance-amount').value) || 0;
    const remainingLabel = document.getElementById('advance-remaining');
    
    let remaining = estimatedCost - advance;
    if (remaining < 0) remaining = 0; // Prevent negative remaining balance
    
    remainingLabel.textContent = `₱${remaining.toFixed(2)}`;
}

function confirmAdvancePayment(event) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Recording...`;
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeAdvanceModal();
        alert("Advance Payment successfully recorded!");
    }, 800);
}

// --- Interactive Inventory Logic ---

const fullInventoryData = [
    { id: 'inv1', name: 'Coolant Temp Sensor (OEM Honda)', sku: '37870-KZR-601', comp: 'Click 125i, PCX 150', category: 'Electrical / Sensors', loc: 'Shelf A-2', price: 850.00, stock: 24, reserved: 2, dtc: 'P0118, P0119', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Sens' },
    { id: 'inv2', name: 'Front Disc Brake Pads', sku: '06455-K59-A71', comp: 'Click 125i/150i', category: 'Brakes', loc: 'Shelf B-1', price: 450.00, stock: 3, reserved: 1, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Pad' },
    { id: 'inv3', name: 'Yamaha V-Belt', sku: '2DP-E7641-00', comp: 'NMAX V1/V2', category: 'Engine / Trans.', loc: 'Shelf C-4', price: 1200.00, stock: 0, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Belt' },
    { id: 'inv4', name: 'Yamalube Standard Engine Oil', sku: 'YAM-OIL-STD', comp: 'Universal (Yamaha)', category: 'Fluids & Oils', loc: 'Shelf D-1', price: 400.00, stock: 45, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Oil' },
    { id: 'inv5', name: 'Spark Plug (NGK CPR8EA-9)', sku: 'NGK-CPR8EA', comp: 'Click, NMAX, Aerox', category: 'Electrical / Sensors', loc: 'Shelf A-3', price: 250.00, stock: 12, reserved: 0, dtc: 'P0300', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Plug' }
];

function renderInventory() {
    const tbody = document.getElementById('inventory-tbody');
    if (!tbody) return;

    // Get filter values
    const query = (document.getElementById('inv-search')?.value || '').toLowerCase();
    const stockFilter = document.getElementById('inv-filter-stock')?.value || '';
    const catFilter = document.getElementById('inv-filter-category')?.value || '';

    // Apply filters
    const filtered = fullInventoryData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query) || item.comp.toLowerCase().includes(query);
        
        let matchesStock = true;
        if (stockFilter === 'low') matchesStock = item.stock > 0 && item.stock <= 5;
        if (stockFilter === 'out') matchesStock = item.stock === 0;

        let matchesCat = true;
        if (catFilter) matchesCat = item.category.toLowerCase().includes(catFilter);

        return matchesSearch && matchesStock && matchesCat;
    });

    // Render HTML
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-500 font-medium">No items found matching your criteria.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(item => {
        // Stock Badge Styling
        let stockBadge = '';
        let rowClass = 'hover:bg-blue-50/30 transition-colors';
        let btnStatus = `onclick="openWalkInModalInv('${item.name}', '${item.price.toFixed(2)}')" class="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1"`;

        if (item.stock === 0) {
            stockBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200"><span class="w-2 h-2 rounded-full bg-red-500"></span> 0 Available</span>`;
            rowClass += ' opacity-75 bg-slate-50';
            btnStatus = `disabled class="bg-slate-100 text-slate-400 border border-slate-200 px-3 py-1.5 rounded-md text-xs font-bold cursor-not-allowed flex items-center gap-1"`;
        } else if (item.stock <= 5) {
            stockBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200"><span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> ${item.stock} Available</span>`;
        } else {
            stockBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> ${item.stock} Available</span>`;
        }

        let dtcTag = item.dtc ? `<span class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200"><i class="ph-bold ph-cpu text-blue-500"></i> Linked DTC: ${item.dtc}</span>` : '';

        return `
            <tr class="${rowClass}">
                <td class="p-4">
                    <div class="flex items-center gap-3">
                        <img src="${item.img}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-white shrink-0 shadow-sm">
                        <div>
                            <div class="font-bold text-slate-800">${item.name}</div>
                            <div class="text-[11px] text-slate-500 mt-0.5 mb-1.5">SKU: ${item.sku} | Comp: ${item.comp}</div>
                            ${dtcTag}
                        </div>
                    </div>
                </td>
                <td class="p-4">
                    <div class="font-medium text-slate-600">${item.category}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1"><i class="ph-fill ph-map-pin"></i> Loc: ${item.loc}</div>
                </td>
                <td class="p-4 font-bold text-slate-800">₱${item.price.toFixed(2)}</td>
                <td class="p-4">
                    ${stockBadge}
                    <div class="text-[10px] font-semibold text-slate-400 mt-1.5 ml-1">(${item.reserved} Reserved)</div>
                </td>
                <td class="p-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button class="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"><i class="ph-bold ph-pencil-simple text-lg"></i></button>
                        <button ${btnStatus}>
                            <i class="ph-bold ph-shopping-cart-simple"></i> Walk-in Sale
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Global Event Listeners for Inventory Filtering
document.addEventListener('input', function(e) {
    if (e.target.id === 'inv-search') renderInventory();
});

document.addEventListener('change', function(e) {
    if (e.target.id === 'inv-filter-stock' || e.target.id === 'inv-filter-category') renderInventory();
});

// --- Interactive Walk-In Cart Logic ---

let walkinCart = [];
let walkinTotalDue = 0;

// Updates HTML list and calculates totals
function renderWalkinCart() {
    const container = document.getElementById('walkin-cart-container');
    const totalLabel = document.getElementById('walkin-total-due');
    if (!container || !totalLabel) return;

    walkinTotalDue = walkinCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    totalLabel.textContent = `₱${walkinTotalDue.toFixed(2)}`;

    if (walkinCart.length === 0) {
        container.innerHTML = `<div class="text-center p-6 bg-slate-50 rounded-lg border border-slate-200 border-dashed text-xs text-slate-400 font-medium">Cart is empty. Search and select parts above.</div>`;
    } else {
        container.innerHTML = walkinCart.map((item, index) => `
            <div class="bg-white p-3 border border-slate-200 rounded-lg flex justify-between items-center shadow-sm animate-[fadeIn_0.2s_ease-out]">
                <div class="flex-1">
                    <div class="text-sm font-bold text-slate-700 truncate pr-2">${item.name}</div>
                    <div class="text-xs text-slate-500">₱${item.price.toFixed(2)} / unit</div>
                </div>
                <div class="flex items-center gap-2 sm:gap-4">
                    <div class="flex items-center bg-slate-50 rounded-md border border-slate-200">
                        <button class="px-2 py-1 text-slate-400 hover:text-emerald-600 btn-cart-minus transition-colors" data-index="${index}"><i class="ph-bold ph-minus"></i></button>
                        <span class="w-6 text-center text-xs font-bold text-slate-700">${item.qty}</span>
                        <button class="px-2 py-1 text-slate-400 hover:text-emerald-600 btn-cart-plus transition-colors" data-index="${index}"><i class="ph-bold ph-plus"></i></button>
                    </div>
                    <div class="text-sm font-bold text-slate-800 w-16 text-right">₱${(item.price * item.qty).toFixed(2)}</div>
                    <button class="text-slate-400 hover:text-red-500 p-1 btn-cart-remove" data-index="${index}"><i class="ph-bold ph-trash"></i></button>
                </div>
            </div>
        `).join('');
    }
    
    // Automatically trigger change calculation whenever cart updates
    calcWalkinChange(); 
}

// 1. Search Bar Autocomplete Listener
document.addEventListener('input', function(e) {
    if (e.target.id === 'walkin-search-input') {
        const query = e.target.value.toLowerCase();
        const dropdown = document.getElementById('walkin-autocomplete-dropdown');
        
        if (!query) {
            dropdown.classList.add('hidden');
            return;
        }
        
        const matches = typeof fullInventoryData !== 'undefined' ? fullInventoryData.filter(p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)) : [];
        
        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(part => `
                <div class="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex justify-between items-center walkin-autocomplete-item" data-id="${part.id}">
                    <div>
                        <div class="text-sm font-bold text-slate-800">${part.name}</div>
                        <div class="text-[10px] text-slate-500">Stock Available: ${part.stock}</div>
                    </div>
                    <div class="text-sm font-bold text-emerald-600">₱${part.price.toFixed(2)}</div>
                </div>
            `).join('');
            dropdown.classList.remove('hidden');
        } else {
            dropdown.innerHTML = `<div class="p-3 text-sm text-slate-500 text-center">No parts found matching "${query}".</div>`;
            dropdown.classList.remove('hidden');
        }
    }
});

// 2. Click Delegate for Cart Actions & Autocomplete Selection
document.addEventListener('click', function(e) {
    // Add Item to Cart
    const autocompleteItem = e.target.closest('.walkin-autocomplete-item');
    if (autocompleteItem) {
        const partId = autocompleteItem.getAttribute('data-id');
        const part = fullInventoryData.find(p => p.id === partId);
        
        if (part && part.stock > 0) {
            const existingItem = walkinCart.find(item => item.id === partId);
            if (existingItem) {
                if(existingItem.qty < part.stock) existingItem.qty += 1;
                else alert('Not enough stock available for this item.');
            } else {
                walkinCart.push({ ...part, qty: 1 });
            }
            renderWalkinCart();
        } else {
            alert('This item is out of stock.');
        }
        
        document.getElementById('walkin-search-input').value = '';
        document.getElementById('walkin-autocomplete-dropdown').classList.add('hidden');
    }

    // Minus Button
    const btnMinus = e.target.closest('.btn-cart-minus');
    if (btnMinus) {
        const idx = btnMinus.getAttribute('data-index');
        if (walkinCart[idx].qty > 1) walkinCart[idx].qty -= 1;
        renderWalkinCart();
    }

    // Plus Button
    const btnPlus = e.target.closest('.btn-cart-plus');
    if (btnPlus) {
        const idx = btnPlus.getAttribute('data-index');
        if (walkinCart[idx].qty < walkinCart[idx].stock) walkinCart[idx].qty += 1;
        else alert('You cannot exceed the available stock limit.');
        renderWalkinCart();
    }

    // Remove Button
    const btnRemove = e.target.closest('.btn-cart-remove');
    if (btnRemove) {
        const idx = btnRemove.getAttribute('data-index');
        walkinCart.splice(idx, 1);
        renderWalkinCart();
    }

    // Hide dropdown if clicked outside
    if (!e.target.closest('#walkin-autocomplete-dropdown') && !e.target.closest('#walkin-search-input')) {
        const dropdown = document.getElementById('walkin-autocomplete-dropdown');
        if (dropdown) dropdown.classList.add('hidden');
    }
});

// 3. Override Change Calculator
window.calcWalkinChange = function() {
    const tendered = parseFloat(document.getElementById('walkin-tendered')?.value) || 0;
    const changeLabel = document.getElementById('walkin-change');
    
    if (!changeLabel) return;

    if (tendered >= walkinTotalDue && walkinTotalDue > 0) {
        changeLabel.textContent = `₱${(tendered - walkinTotalDue).toFixed(2)}`;
        changeLabel.parentElement.classList.remove('text-red-400');
        changeLabel.parentElement.classList.add('text-emerald-400');
    } else {
        changeLabel.textContent = "₱0.00";
        changeLabel.parentElement.classList.remove('text-emerald-400');
        changeLabel.parentElement.classList.add('text-red-400');
    }
};

// 4. Override Open Modal to clear previous data
window.openWalkInCheckout = function() {
    walkinCart = []; // Reset Cart Array
    walkinTotalDue = 0;
    
    if (document.getElementById('walkin-search-input')) document.getElementById('walkin-search-input').value = "";
    if (document.getElementById('walkin-tendered')) document.getElementById('walkin-tendered').value = "";
    
    renderWalkinCart(); // Triggers empty state render
    toggleModal('modal-txn-walkin', 'txn-walkin-backdrop', 'txn-walkin-content', true); 
};

// --- Interactive Transactions Queue & Filter Logic ---
let currentTxnFilter = 'all';
const mockTxnData = [
    {
        id: 'TXN-101',
        category: 'walkin',
        type: 'Walk-in Sale',
        typeClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        typeIcon: 'ph-shopping-bag',
        customer: 'Walk-in Customer',
        details: 'Purchased: Coolant Temp Sensor (x1)',
        amount: 850.00,
        amountSuffix: '',
        status: 'Unpaid',
        statusClass: 'bg-red-50 text-red-600 border-red-100',
        statusDot: 'bg-red-500',
        btnText: 'Process Payment',
        btnClass: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
        btnIcon: 'ph-wallet',
        btnAction: 'openWalkInCheckout()'
    },
    {
        id: 'TXN-102',
        category: 'advance',
        type: 'Repair Service',
        typeClass: 'text-orange-600 bg-orange-50 border-orange-100',
        typeIcon: 'ph-wrench',
        customer: 'Juan Dela Cruz',
        details: 'Honda Click 125i (ABC-1234)',
        amount: 1800.00,
        amountSuffix: '<span class="text-[10px] font-normal text-slate-400 ml-1">(Est.)</span>',
        status: 'Unpaid',
        statusClass: 'bg-red-50 text-red-600 border-red-100',
        statusDot: 'bg-red-500',
        btnText: 'Advance Payment',
        btnClass: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
        btnIcon: 'ph-hand-coins',
        btnAction: 'openAdvanceModal()'
    },
    {
        id: 'TXN-103',
        category: 'settle',
        type: 'Repair Service',
        typeClass: 'text-blue-600 bg-blue-50 border-blue-100',
        typeIcon: 'ph-wrench',
        customer: 'Maria Clara',
        details: 'Yamaha NMAX (XYZ-9876)',
        amount: 2500.00,
        amountSuffix: '<span class="text-[10px] font-normal text-slate-400 ml-1">(Final)</span>',
        status: 'Partial/Adv Paid (₱500)',
        statusClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        statusDot: 'bg-yellow-500',
        btnText: 'Settle Balance',
        btnClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md',
        btnIcon: 'ph-check-circle',
        btnAction: 'openRepairCheckout(true)'
    },
    {
        id: 'TXN-104',
        category: 'completed',
        type: 'Walk-in Sale',
        typeClass: 'text-slate-500 bg-slate-100 border-slate-200',
        typeIcon: 'ph-shopping-bag',
        customer: 'Walk-in Customer',
        details: 'Purchased: Front Brake Pads (x1)',
        amount: 450.00,
        amountSuffix: '',
        status: 'Fully Paid',
        statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        statusDot: 'bg-emerald-500',
        btnText: 'View Receipt',
        btnClass: 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300',
        btnIcon: 'ph-receipt',
        btnAction: 'openReceiptModal()'
    }
];

function renderTransactions() {
    const tbody = document.getElementById('transactions-tbody');
    if (!tbody) return;

    const query = (document.getElementById('txn-search')?.value || '').toLowerCase();
    
    // Filter the Data
    const filtered = mockTxnData.filter(txn => {
        const matchesSearch = txn.customer.toLowerCase().includes(query) || txn.id.toLowerCase().includes(query) || txn.details.toLowerCase().includes(query);
        const matchesCategory = currentTxnFilter === 'all' || txn.category === currentTxnFilter;
        // Don't show completed in "All Active" view
        const matchesActive = currentTxnFilter !== 'all' || txn.category !== 'completed';
        
        return matchesSearch && matchesCategory && matchesActive;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-500 font-medium">No transactions found.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(txn => {
        const isCompleted = txn.category === 'completed';
        const rowClass = isCompleted ? 'hover:bg-blue-50/30 transition-colors opacity-75' : 'hover:bg-blue-50/30 transition-colors';
        const statusIndicator = isCompleted ? 
            `<i class="ph-bold ph-check"></i> ${txn.status}` : 
            `<span class="w-1.5 h-1.5 rounded-full ${txn.statusDot}"></span> ${txn.status}`;
            
        return `
            <tr class="${rowClass}">
                <td class="p-4">
                    <div class="font-bold text-slate-800">${txn.id}</div>
                    <div class="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider ${txn.typeClass} px-2 py-0.5 rounded">
                        <i class="ph-fill ${txn.typeIcon}"></i> ${txn.type}
                    </div>
                </td>
                <td class="p-4">
                    <div class="font-semibold text-slate-700">${txn.customer}</div>
                    <div class="text-xs text-slate-500 mt-0.5">${txn.details}</div>
                </td>
                <td class="p-4 font-bold text-slate-800">₱${txn.amount.toFixed(2)} ${txn.amountSuffix}</td>
                <td class="p-4">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${txn.statusClass}">
                        ${statusIndicator}
                    </span>
                </td>
                <td class="p-4 text-right">
                    <button onclick="${txn.btnAction}" class="border px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ml-auto shadow-sm ${txn.btnClass}">
                        <i class="ph-bold ${txn.btnIcon}"></i> ${txn.btnText}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Attach Event Listeners for Transactions
document.addEventListener('input', function(e) {
    if (e.target.id === 'txn-search') renderTransactions();
});

document.addEventListener('click', function(e) {
    const filterBtn = e.target.closest('.txn-filter-btn');
    if (filterBtn) {
        // Reset all buttons to default classes
        document.querySelectorAll('.txn-filter-btn').forEach(btn => {
            btn.className = `txn-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors ${btn.getAttribute('data-default')}`;
        });
        
        // Set Active State
        filterBtn.className = 'txn-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors bg-slate-800 text-white border border-transparent';
        
        currentTxnFilter = filterBtn.getAttribute('data-filter');
        renderTransactions();
    }
});

// --- Interactive Service History Logic ---
const mockHistoryData = [
    {
        date: 'Oct 24, 2023',
        time: '14:30 PM',
        plate: 'XYZ-9876',
        vehicle: 'Yamaha NMAX',
        customer: 'Maria Clara',
        mechanic: 'Leo (Sub-Mechanic)',
        mechanicId: 'leo',
        issueTitle: 'Throttle & Oil Maintenance',
        issueDesc: 'Throttle body cleaning and standard engine oil replacement.',
        cost: 2500.00
    },
    {
        date: 'Oct 20, 2023',
        time: '09:15 AM',
        plate: 'ABC-1234',
        vehicle: 'Honda Click 125i',
        customer: 'Juan Dela Cruz',
        mechanic: 'Mike (Chief Mechanic)',
        mechanicId: 'mike',
        issueTitle: 'Engine Overheating (P0118)',
        issueDesc: 'Replaced faulty Coolant Temp Sensor and front brake pads.',
        cost: 1800.00
    }
];

function renderHistory() {
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;

    const query = (document.getElementById('history-search')?.value || '').toLowerCase();
    const mechFilter = document.getElementById('history-mech-filter')?.value || 'all';

    // Filter the Data
    const filtered = mockHistoryData.filter(record => {
        const matchesSearch = record.plate.toLowerCase().includes(query) || 
                              record.customer.toLowerCase().includes(query) ||
                              record.date.toLowerCase().includes(query);
                              
        const matchesMech = mechFilter === 'all' || record.mechanicId === mechFilter;

        return matchesSearch && matchesMech;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500 font-medium">No service records found.</td></tr>`;
        return;
    }

    // Render HTML
    tbody.innerHTML = filtered.map(record => `
        <tr class="hover:bg-blue-50/30 transition-colors">
            <td class="p-4 text-slate-600 font-medium">${record.date} <br><span class="text-xs text-slate-400">${record.time}</span></td>
            <td class="p-4">
                <button onclick="openTimelineModal('${record.plate}', '${record.vehicle}')" class="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 transition-colors">
                    ${record.plate} <i class="ph-bold ph-clock-counter-clockwise text-xs"></i>
                </button>
                <div class="text-xs text-slate-500 mt-0.5">${record.vehicle}</div>
                <div class="text-xs font-semibold text-slate-700 mt-1">${record.customer}</div>
            </td>
            <td class="p-4 text-slate-700 font-medium">${record.mechanic}</td>
            <td class="p-4 text-slate-600 text-xs leading-relaxed">
                <span class="font-bold text-slate-700 block mb-0.5">${record.issueTitle}</span>
                ${record.issueDesc}
            </td>
            <td class="p-4 font-bold text-slate-800">₱${record.cost.toFixed(2)}</td>
            <td class="p-4 text-center">
                <button onclick="openHistoryDetailModal()" class="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm whitespace-nowrap">
                    View Full Record
                </button>
            </td>
        </tr>
    `).join('');
}

// Attach Event Listeners for History View
document.addEventListener('input', function(e) {
    if (e.target.id === 'history-search') renderHistory();
});

document.addEventListener('change', function(e) {
    if (e.target.id === 'history-mech-filter') renderHistory();
});

// --- Interactive Reports & Monitoring Logic ---

const mockReportData = {
    today: {
        revTotal: '14,850.00', revParts: '8,200', revLabor: '6,650',
        repTotal: '12', repComp: '9', repProg: '3',
        alertTotal: '8', alertLow: '5', alertOut: '3',
        scanTotal: '15', scanIssue: '8', scanClear: '7',
        chartParts: '5,940', chartRepair: '8,910',
        sumAdv: '3,500.00', sumOut: '4,200.00', sumSet: '11,350.00'
    },
    week: {
        revTotal: '84,200.00', revParts: '45,100', revLabor: '39,100',
        repTotal: '68', repComp: '62', repProg: '6',
        alertTotal: '12', alertLow: '8', alertOut: '4',
        scanTotal: '75', scanIssue: '42', scanClear: '33',
        chartParts: '33,680', chartRepair: '50,520',
        sumAdv: '12,500.00', sumOut: '8,400.00', sumSet: '63,300.00'
    },
    month: {
        revTotal: '342,500.00', revParts: '185,000', revLabor: '157,500',
        repTotal: '285', repComp: '270', repProg: '15',
        alertTotal: '18', alertLow: '11', alertOut: '7',
        scanTotal: '310', scanIssue: '180', scanClear: '130',
        chartParts: '137,000', chartRepair: '205,500',
        sumAdv: '45,000.00', sumOut: '22,500.00', sumSet: '275,000.00'
    }
};

function renderReports(range = 'today') {
    const data = mockReportData[range];
    if (!data) return;

    // Simulate network fetch indicator
    const syncText = document.getElementById('report-sync-time');
    if (syncText) {
        syncText.textContent = "Syncing...";
        setTimeout(() => syncText.textContent = "Synced: Just now", 500);
    }

    // Update KPI Cards
    const safeSet = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    
    safeSet('kpi-rev-total', data.revTotal);
    safeSet('kpi-rev-parts', data.revParts);
    safeSet('kpi-rev-labor', data.revLabor);
    
    safeSet('kpi-rep-total', data.repTotal);
    safeSet('kpi-rep-comp', data.repComp);
    safeSet('kpi-rep-prog', data.repProg);
    
    safeSet('kpi-alert-total', data.alertTotal);
    safeSet('kpi-alert-low', data.alertLow);
    safeSet('kpi-alert-out', data.alertOut);
    
    safeSet('kpi-scan-total', data.scanTotal);
    safeSet('kpi-scan-issue', data.scanIssue);
    safeSet('kpi-scan-clear', data.scanClear);

    // Update Breakdown Charts & Tables
    safeSet('chart-rev-parts', `₱${data.chartParts}`);
    safeSet('chart-rev-repair', `₱${data.chartRepair}`);
    
    safeSet('summary-adv', `₱${data.sumAdv}`);
    safeSet('summary-out', `₱${data.sumOut}`);
    safeSet('summary-set', `₱${data.sumSet}`);
}

// Attach Event Listener for Date Range Filters
document.addEventListener('click', function(e) {
    const filterBtn = e.target.closest('.report-date-btn');
    if (filterBtn) {
        // Reset all buttons to default styling
        document.querySelectorAll('.report-date-btn').forEach(btn => {
            btn.className = 'report-date-btn px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap transition-colors';
        });
        
        // Set Active State
        filterBtn.className = 'report-date-btn px-3 py-1.5 text-xs font-bold bg-white text-blue-600 shadow-sm rounded-md whitespace-nowrap transition-colors';
        
        const range = filterBtn.getAttribute('data-range');
        renderReports(range);
    }
});
// --- Interactive Audit Logs Logic ---

const mockAuditData = [
    {
        id: '1',
        date: 'Oct 24, 2026',
        time: '08:00:12 AM',
        dateGroup: 'today',
        userName: 'Sarah Lee',
        userRole: 'Cashier',
        roleFilter: 'cashier',
        module: 'Authentication',
        moduleFilter: 'authentication',
        action: 'Successful user login.',
        severity: 'Routine',
        severityClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotClass: 'bg-emerald-500',
        hasDetails: false
    },
    {
        id: '2',
        date: 'Oct 24, 2026',
        time: '10:15:33 AM',
        dateGroup: 'today',
        userName: 'Mike Cruz',
        userRole: 'Chief Mechanic',
        roleFilter: 'chief mechanic',
        module: 'Inventory',
        moduleFilter: 'inventory',
        action: "Manual stock override for 'Front Disc Brake Pads'.",
        severity: 'Modification',
        severityClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        dotClass: 'bg-yellow-500',
        hasDetails: true,
        targetId: 'INV-SKU-06455',
        beforeValue: '3 units',
        afterValue: '10 units',
        afterTheme: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        afterLabelTheme: 'text-yellow-600',
        reason: 'Reason: Inventory Correction'
    },
    {
        id: '3',
        date: 'Oct 24, 2026',
        time: '14:32:05 PM',
        dateGroup: 'today',
        userName: 'Sarah Lee',
        userRole: 'Cashier',
        roleFilter: 'cashier',
        module: 'Billing',
        moduleFilter: 'billing',
        action: "Settled final balance for Repair Transaction.",
        severity: 'Modification',
        severityClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        dotClass: 'bg-yellow-500',
        hasDetails: true,
        targetId: 'TXN-103',
        beforeValue: 'Status: Pending Final Settlement',
        afterValue: 'Status: Fully Paid (₱2,000.00 Rcvd)',
        afterTheme: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        afterLabelTheme: 'text-emerald-600',
        reason: ''
    },
    {
        id: '4',
        date: 'Oct 23, 2026',
        time: '22:00:00 PM',
        dateGroup: 'yesterday',
        userName: 'System',
        userRole: 'Automated',
        roleFilter: 'automated',
        module: 'System Maintenance',
        moduleFilter: 'system maintenance',
        action: "Execution of the manual database backup procedure.",
        severity: 'Critical / Security',
        severityClass: 'bg-red-50 text-red-700 border-red-200',
        dotClass: 'bg-red-500',
        hasDetails: false
    }
];

function renderAudit() {
    const tbody = document.getElementById('audit-tbody');
    if (!tbody) return;

    // Get Active Filters
    const query = (document.getElementById('audit-search')?.value || '').toLowerCase();
    const dateFilter = document.getElementById('audit-filter-date')?.value || 'all';
    const roleFilter = document.getElementById('audit-filter-role')?.value || 'all';
    const moduleFilter = document.getElementById('audit-filter-module')?.value || 'all';

    // Apply Filters
    const filtered = mockAuditData.filter(log => {
        const searchString = `${log.userName} ${log.action} ${log.targetId || ''}`.toLowerCase();
        const matchesSearch = searchString.includes(query);
        const matchesDate = dateFilter === 'all' || log.dateGroup === dateFilter;
        const matchesRole = roleFilter === 'all' || log.roleFilter === roleFilter;
        const matchesModule = moduleFilter === 'all' || log.moduleFilter === moduleFilter;

        return matchesSearch && matchesDate && matchesRole && matchesModule;
    });

    // Render HTML
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500 font-medium">No audit logs match the current filters.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(log => {
        // Build the primary row
        let rowHtml = `
            <tr class="hover:bg-slate-50 transition-colors ${log.hasDetails ? 'cursor-pointer' : ''}" ${log.hasDetails ? `onclick="toggleAuditDetail('audit-detail-${log.id}')"` : ''}>
                <td class="p-4 text-center">
                    ${log.hasDetails ? `<i class="ph-bold ph-caret-down text-slate-400 transition-transform" id="audit-icon-${log.id}"></i>` : ''}
                </td>
                <td class="p-4 text-slate-600 font-medium">${log.date}<br><span class="text-xs text-slate-400">${log.time}</span></td>
                <td class="p-4">
                    <div class="font-semibold text-slate-700">${log.userName}</div>
                    <div class="text-[10px] uppercase font-bold text-slate-400 mt-0.5">${log.userRole}</div>
                </td>
                <td class="p-4 text-slate-600">${log.module}</td>
                <td class="p-4 text-slate-700">${log.action}</td>
                <td class="p-4 text-center">
                    <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${log.severityClass}">
                        <span class="w-1.5 h-1.5 rounded-full ${log.dotClass}"></span> ${log.severity}
                    </span>
                </td>
            </tr>
        `;

        // Append the hidden details row if applicable
        if (log.hasDetails) {
            rowHtml += `
                <tr id="audit-detail-${log.id}" class="hidden bg-slate-50/50">
                    <td colspan="6" class="p-0">
                        <div class="px-16 py-4 border-b border-slate-100 flex flex-col gap-2">
                            <div class="text-xs">
                                <span class="font-bold text-slate-500 uppercase tracking-wider">Target Record ID:</span> 
                                <span class="font-mono text-slate-700 bg-white px-1 border border-slate-200 rounded">${log.targetId}</span>
                            </div>
                            <div class="flex items-center gap-4 text-xs mt-1">
                                <div class="bg-white p-2 border border-slate-200 rounded shadow-sm flex items-center gap-2">
                                    <span class="text-slate-400 font-bold uppercase text-[10px]">Before:</span>
                                    <span class="font-bold text-slate-700">${log.beforeValue}</span>
                                </div>
                                <i class="ph-bold ph-arrow-right text-slate-400"></i>
                                <div class="p-2 border rounded shadow-sm flex items-center gap-2 ${log.afterTheme}">
                                    <span class="font-bold uppercase text-[10px] ${log.afterLabelTheme}">After:</span>
                                    <span class="font-bold">${log.afterValue}</span>
                                </div>
                            </div>
                            ${log.reason ? `<div class="text-xs text-slate-500 italic mt-1">${log.reason}</div>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }
        
        return rowHtml;
    }).join('');
}

// Global Event Listeners for Audit Logs Filtering
document.addEventListener('input', function(e) {
    if (e.target.id === 'audit-search') renderAudit();
});

document.addEventListener('change', function(e) {
    if (e.target.id === 'audit-filter-date' || e.target.id === 'audit-filter-role' || e.target.id === 'audit-filter-module') {
        renderAudit();
    }
});
// --- Interactive User Management Logic ---

const mockUserData = [
    {
        id: 'u1', initials: 'IG', name: 'User', username: '@User.owner',
        roleName: 'Shop Owner', roleValue: 'owner', roleIcon: 'ph-crown', roleClass: 'bg-slate-800 text-white',
        status: 'Active', statusValue: 'active', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', statusDot: 'bg-emerald-500',
        lastLoginDate: 'Oct 24, 2026', lastLoginTime: '08:00 AM', avatarClass: 'bg-slate-800 text-white'
    },
    {
        id: 'u2', initials: 'JB', name: 'Larpus', username: '@Larpus.chief',
        roleName: 'Chief Mechanic', roleValue: 'chief', roleIcon: 'ph-wrench', roleClass: 'bg-blue-50 text-blue-700 border border-blue-200',
        status: 'Active', statusValue: 'active', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', statusDot: 'bg-emerald-500',
        lastLoginDate: 'Oct 24, 2026', lastLoginTime: '07:45 AM', avatarClass: 'bg-blue-100 text-blue-700'
    },
    {
        id: 'u3', initials: 'F', name: 'Hiyo', username: '@Hiyo.sub',
        roleName: 'Sub-Mechanic', roleValue: 'sub', roleIcon: 'ph-wrench', roleClass: 'bg-slate-100 text-slate-600 border border-slate-200',
        status: 'Active', statusValue: 'active', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', statusDot: 'bg-emerald-500',
        lastLoginDate: 'Oct 24, 2026', lastLoginTime: '07:50 AM', avatarClass: 'bg-slate-100 text-slate-600 border border-slate-200'
    },
    {
        id: 'u4', initials: 'SL', name: 'Sarah Lee', username: '@sarah.cashier',
        roleName: 'Cashier', roleValue: 'cashier', roleIcon: 'ph-shopping-cart', roleClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200 opacity-60',
        status: 'Suspended', statusValue: 'suspended', statusClass: 'bg-slate-100 text-slate-500 border border-slate-200', statusDot: 'bg-slate-400',
        lastLoginDate: 'Sep 30, 2026', lastLoginTime: '17:00 PM', avatarClass: 'bg-slate-200 text-slate-400',
        rowClass: 'opacity-75 bg-slate-50/50'
    }
];

function renderUsers() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    // Get Active Filters
    const query = (document.getElementById('user-search')?.value || '').toLowerCase();
    const roleFilter = document.getElementById('user-filter-role')?.value || 'all';
    const statusFilter = document.getElementById('user-filter-status')?.value || 'all';

    // Apply Filters
    const filtered = mockUserData.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(query) || u.username.toLowerCase().includes(query);
        const matchesRole = roleFilter === 'all' || u.roleValue === roleFilter;
        const matchesStatus = statusFilter === 'all' || u.statusValue === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Render HTML
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-500 font-medium">No users match the current filters.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(u => {
        // Toggle the visible action buttons depending on the user's active/suspended status
        const actionBtns = u.statusValue === 'active' 
            ? `
                <button class="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors" title="Edit Role/Details"><i class="ph-bold ph-pencil-simple text-lg"></i></button>
                <button class="text-slate-500 hover:text-orange-600 hover:bg-orange-50 p-2 rounded transition-colors" title="Reset Password"><i class="ph-bold ph-key text-lg"></i></button>
                <button class="text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors" title="Deactivate Account"><i class="ph-bold ph-user-minus text-lg"></i></button>
              `
            : `
                <button class="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors" title="Edit Role/Details"><i class="ph-bold ph-pencil-simple text-lg"></i></button>
                <button class="text-emerald-600 hover:bg-emerald-50 p-2 rounded transition-colors font-bold text-xs flex items-center gap-1"><i class="ph-bold ph-user-plus text-lg"></i> Reactivate</button>
              `;

        return `
            <tr class="hover:bg-slate-50 transition-colors ${u.rowClass || ''}">
                <td class="p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold ${u.avatarClass}">${u.initials}</div>
                        <div>
                            <div class="font-bold text-slate-800">${u.name}</div>
                            <div class="text-xs text-slate-500 font-mono mt-0.5">${u.username}</div>
                        </div>
                    </div>
                </td>
                <td class="p-4">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.roleClass}">
                        <i class="ph-fill ${u.roleIcon}"></i> ${u.roleName}
                    </span>
                </td>
                <td class="p-4">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${u.statusClass}">
                        <span class="w-1.5 h-1.5 rounded-full ${u.statusDot}"></span> ${u.status}
                    </span>
                </td>
                <td class="p-4 text-slate-600 text-xs font-medium">${u.lastLoginDate}<br><span class="text-slate-400">${u.lastLoginTime}</span></td>
                <td class="p-4 text-right">
                    <div class="flex justify-end gap-2">
                        ${actionBtns}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Global Event Listeners for User Directory Filtering
document.addEventListener('input', function(e) {
    if (e.target.id === 'user-search') renderUsers();
});

document.addEventListener('change', function(e) {
    if (e.target.id === 'user-filter-role' || e.target.id === 'user-filter-status') {
        renderUsers();
    }
});
// --- Interactive Backup & Restore Logic ---

const mockBackupHistory = [
    { id: 1, datetime: 'Oct 12, 2026 - 04:30 PM', action: 'Backup Created (motocare_backup_20261012.sql)', type: 'backup', user: 'User (Shop Owner)' },
    { id: 2, datetime: 'Oct 05, 2026 - 10:15 AM', action: 'Backup Created (motocare_backup_20261005.sql)', type: 'backup', user: 'User (Shop Owner)' },
    { id: 3, datetime: 'Sep 28, 2026 - 05:00 PM', action: 'Backup Created (motocare_backup_20260928.sql)', type: 'backup', user: 'User (Shop Owner)' },
    { id: 4, datetime: 'Sep 15, 2026 - 09:00 AM', action: 'System Restored from Archive', type: 'restore', user: 'User (Shop Owner)' },
    { id: 5, datetime: 'Sep 14, 2026 - 04:00 PM', action: 'Backup Created (motocare_backup_20260914.sql)', type: 'backup', user: 'User (Shop Owner)' }
];

function renderBackupHistory() {
    const tbody = document.getElementById('backup-history-tbody');
    if (!tbody) return;

    // Render Table Rows
    tbody.innerHTML = mockBackupHistory.map(entry => {
        const textClass = entry.type === 'backup' ? 'text-blue-600' : 'text-red-600';
        return `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-3.5 text-slate-600 font-medium">${entry.datetime}</td>
                <td class="p-3.5 font-semibold ${textClass}">${entry.action}</td>
                <td class="p-3.5 text-slate-700 font-medium">${entry.user}</td>
            </tr>
        `;
    }).join('');

    // Update Top Status Information dynamically based on newest backup record
    const lastBackup = mockBackupHistory.find(e => e.type === 'backup');
    if (lastBackup) {
        const dateText = document.getElementById('last-backup-date-text');
        if (dateText) dateText.textContent = `Last Manual Backup: ${lastBackup.datetime}`;
    }

    const statusContainer = document.getElementById('backup-status-container');
    if (statusContainer) {
        // Simple logic for the prototype: if the first history item is from today/Oct 24, show as Up to Date
        const isUpToDate = mockBackupHistory[0].datetime.includes('Oct 24');
        
        if (isUpToDate) {
            statusContainer.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Backup Up to Date
                </span>
            `;
        } else {
            statusContainer.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Backup Older Than 7 Days (Action Recommended)
                </span>
            `;
        }
    }
}

// Global functions for Backup & Restore UI triggers
window.updateRestoreFileName = function(input) {
    const fileNameSpan = document.getElementById('restore-file-name');
    if (!fileNameSpan) return;
    
    if (input.files && input.files.length > 0) {
        fileNameSpan.textContent = input.files[0].name;
        fileNameSpan.classList.replace('text-slate-700', 'text-blue-600');
    } else {
        fileNameSpan.textContent = 'Choose database file (.sql or .json)';
        fileNameSpan.classList.replace('text-blue-600', 'text-slate-700');
    }
};

window.createManualBackup = function(e) {
    const btn = e.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin"></i> Generating Backup...`;
    btn.disabled = true;

    // Simulate backend delay, update history table dynamically
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        
        const now = new Date();
        const formattedDate = "Oct 24, 2026 - " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        mockBackupHistory.unshift({
            id: Date.now(),
            datetime: formattedDate,
            action: 'Backup Created (motocare_backup_20261024.sql)',
            type: 'backup',
            user: 'User (Shop Owner)'
        });
        
        renderBackupHistory();
        alert('Backup file downloaded successfully!');
    }, 1200);
};

window.openRestorePasswordModal = function() {
    const fileInput = document.getElementById('restore-file-input');
    if (!fileInput || fileInput.files.length === 0) {
        alert("Please select a backup file to restore first.");
        return;
    }
    toggleModal('modal-restore-password', 'restore-password-backdrop', 'restore-password-content', true);
};

window.closeRestorePasswordModal = function() {
    toggleModal('modal-restore-password', 'restore-password-backdrop', 'restore-password-content', false);
};

window.confirmSystemRestore = function(e) {
    const pass = document.getElementById('restore-admin-pass').value;
    if (!pass) {
        alert('Please enter your password to proceed.');
        return;
    }
    const btn = e.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin"></i> Restoring Database...`;
    btn.disabled = true;
             
    // Simulate backend delay, update history table dynamically
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        document.getElementById('restore-admin-pass').value = '';
        
        const now = new Date();
        const formattedDate = "Oct 24, 2026 - " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        mockBackupHistory.unshift({
            id: Date.now(),
            datetime: formattedDate,
            action: 'System Restored from Archive',
            type: 'restore',
            user: 'User (Shop Owner)'
        });
        
        closeRestorePasswordModal();
        
        // Reset file input UI
        const fileInput = document.getElementById('restore-file-input');
        if(fileInput) fileInput.value = '';
        updateRestoreFileName({ files: [] });

        renderBackupHistory();
        alert('System successfully restored from archive! Audit log updated.');
    }, 1200);
};
// --- Interactive Login & Logout Logic ---

window.handleLogout = function() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.classList.remove('hidden');
        loginScreen.classList.add('flex');
    }
};

window.handleLogin = function(roleId, btn) {
    const originalContent = btn.innerHTML;
    
    // Show loading state on the clicked button
    btn.innerHTML = `
        <div class="flex items-center justify-center w-full py-2 gap-3">
            <i class="ph-bold ph-spinner animate-spin text-2xl text-slate-500"></i>
            <span class="font-bold text-slate-700">Authenticating...</span>
        </div>
    `;
    
    // Simulate network validation delay
    setTimeout(() => {
        btn.innerHTML = originalContent; // Restore original button HTML
        
        // Hide the login screen overlay
        const loginScreen = document.getElementById('login-screen');
        loginScreen.classList.add('hidden');
        loginScreen.classList.remove('flex');
        
        // Sync the bottom-left dropdown to match the selected role
        const switcher = document.getElementById('role-switcher');
        if (switcher) switcher.value = roleId;
        
        // Run your existing role-switching permissions logic
        switchRole(roleId);
        
        // Force navigate the user back to the Dashboard upon successful login
        const dashLink = document.querySelector('.nav-link[data-target="dashboard"]');
        if (dashLink) dashLink.click();
        
    }, 800);
};
// --- Interactive Login, PIN Pad & Logout Logic ---

let currentLoginRole = null;
let enteredPin = "";

window.handleLogout = function() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.classList.remove('hidden');
        loginScreen.classList.add('flex');
        backToProfiles(); // Reset to profile selection
    }
};
window.closeLoginScreen = function() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.classList.add('hidden');
        loginScreen.classList.remove('flex');
    }
};

window.promptPin = function(roleId, name, initials, colorClass) {
    currentLoginRole = roleId;
    enteredPin = "";
    updatePinDisplay();

    // Update PIN screen UI with the selected user's details
    document.getElementById('pin-name').textContent = name;
    const avatar = document.getElementById('pin-avatar');
    avatar.textContent = initials;
    avatar.className = `w-16 h-16 rounded-full text-white flex items-center justify-center font-bold text-2xl shadow-inner ${colorClass}`;

    // Switch Views inside the modal
    document.getElementById('login-profile-view').classList.add('hidden');
    document.getElementById('login-pin-view').classList.remove('hidden');
};

window.backToProfiles = function() {
    currentLoginRole = null;
    enteredPin = "";
    updatePinDisplay();
    
    document.getElementById('login-pin-view').classList.add('hidden');
    document.getElementById('login-profile-view').classList.remove('hidden');
};

// Numpad Functions
window.addPin = function(num) {
    if (enteredPin.length < 4) {
        enteredPin += num;
        updatePinDisplay();
    }
};

window.removePin = function() {
    if (enteredPin.length > 0) {
        enteredPin = enteredPin.slice(0, -1);
        updatePinDisplay();
    }
};

window.clearPin = function() {
    enteredPin = "";
    updatePinDisplay();
};

function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, index) => {
        if (index < enteredPin.length) {
            dot.classList.add('bg-blue-600', 'border-blue-600');
            dot.classList.remove('border-slate-300', 'bg-transparent');
        } else {
            dot.classList.remove('bg-blue-600', 'border-blue-600');
            dot.classList.add('border-slate-300', 'bg-transparent');
        }
    });

    const submitBtn = document.getElementById('btn-login-submit');
    if (enteredPin.length === 4) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

window.submitLogin = function() {
    if (enteredPin.length !== 4) return;
    
    const btn = document.getElementById('btn-login-submit');
    const originalContent = btn.innerHTML;
    
    btn.innerHTML = `
        <i class="ph-bold ph-spinner animate-spin text-xl"></i>
        Authenticating...
    `;
    
    // Simulate network validation delay
    setTimeout(() => {
        btn.innerHTML = originalContent; 
        
        // Hide the login screen overlay
        const loginScreen = document.getElementById('login-screen');
        loginScreen.classList.add('hidden');
        loginScreen.classList.remove('flex');
        
        // Sync the bottom-left dropdown to match the selected role
        const switcher = document.getElementById('role-switcher');
        if (switcher) switcher.value = currentLoginRole;
        
        // Run existing role-switching permissions logic
        switchRole(currentLoginRole);
        
        // Navigate back to Dashboard
        const dashLink = document.querySelector('.nav-link[data-target="dashboard"]');
        if (dashLink) dashLink.click();
        
    }, 800);
};
// --- Interactive Active Repairs Logic ---

let currentRepairFilter = 'all';

const mockRepairsData = [
    {
        id: 'JOB #1042',
        plate: 'ABC-1234',
        model: 'Honda Click 125i',
        customer: 'Juan Dela Cruz',
        mechanicOptions: ['Mike (Chief Mechanic)', 'Leo (Sub-Mechanic)'],
        selectedMechIndex: 0,
        diagnosis: 'Coolant temp sensor high (P0118). Brake pads heavily worn. Requires part replacement.',
        statusId: 'progress',
        statusName: 'In Progress',
        statusClass: 'bg-blue-100 text-blue-700 border-blue-200',
        dotClass: 'bg-blue-500 animate-pulse',
        btnText: 'Manage Repair <i class="ph-bold ph-caret-right"></i>',
        btnClass: 'bg-slate-800 hover:bg-slate-900 text-white',
        btnAction: 'openRepairModal()'
    },
    {
        id: 'JOB #1041',
        plate: 'XYZ-9876',
        model: 'Yamaha NMAX',
        customer: 'Maria Clara',
        mechanicOptions: ['Mike (Chief Mechanic)', 'Leo (Sub-Mechanic)'],
        selectedMechIndex: 1,
        diagnosis: 'Throttle body cleaning and standard change oil.',
        statusId: 'pending',
        statusName: 'Pending Post-Scan',
        statusClass: 'bg-purple-100 text-purple-700 border-purple-200',
        dotClass: 'bg-purple-500',
        btnText: 'View Details',
        btnClass: 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700',
        btnAction: ''
    }
];

function renderRepairs() {
    const grid = document.getElementById('repairs-grid');
    if (!grid) return;

    const query = (document.getElementById('repair-search')?.value || '').toLowerCase();

    // Filter Data
    const filtered = mockRepairsData.filter(job => {
        const matchesSearch = job.plate.toLowerCase().includes(query) || 
                              job.customer.toLowerCase().includes(query) || 
                              job.id.toLowerCase().includes(query);
                              
        const matchesStatus = currentRepairFilter === 'all' || job.statusId === currentRepairFilter;

        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-slate-500 font-medium bg-white rounded-xl border border-slate-200">No active repairs found matching your criteria.</div>`;
        return;
    }

    // Render HTML Cards
    grid.innerHTML = filtered.map(job => {
        const opacityClass = job.statusId !== 'progress' ? 'opacity-80' : '';
        
        // Build mechanic select options
        const mechOptions = job.mechanicOptions.map((mech, idx) => 
            `<option ${idx === job.selectedMechIndex ? 'selected' : ''}>${mech}</option>`
        ).join('');

        return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow ${opacityClass}">
                <div class="bg-slate-50 border-b border-slate-200 p-3.5 flex justify-between items-center">
                    <div>
                        <span class="font-bold text-slate-800 text-sm">${job.plate}</span>
                        <span class="text-[11px] text-slate-500 ml-1.5">${job.model}</span>
                    </div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${job.id}</span>
                </div>
                <div class="p-4 flex-1 flex flex-col gap-3">
                    <div class="flex justify-between items-start">
                        <span class="text-xs font-bold text-slate-400 uppercase">Customer</span>
                        <span class="text-sm font-semibold text-slate-700">${job.customer}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-slate-400 uppercase">Mechanic</span>
                        <select class="text-xs font-medium text-slate-700 border border-slate-200 rounded p-1 bg-slate-50 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                            ${mechOptions}
                        </select>
                    </div>
                    <div class="mt-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Initial Diagnosis</span>
                        <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed">
                            ${job.diagnosis}
                        </p>
                    </div>
                </div>
                <div class="p-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span class="px-2.5 py-1 rounded text-[10px] font-bold border flex items-center gap-1.5 ${job.statusClass}">
                        <span class="w-1.5 h-1.5 rounded-full ${job.dotClass}"></span> ${job.statusName}
                    </span>
                    <button onclick="${job.btnAction}" class="text-xs font-semibold px-3.5 py-1.5 rounded transition-colors shadow-sm flex items-center gap-1.5 ${job.btnClass}">
                        ${job.btnText}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Attach Event Listeners
document.addEventListener('input', function(e) {
    if (e.target.id === 'repair-search') renderRepairs();
});

document.addEventListener('click', function(e) {
    const filterBtn = e.target.closest('.repair-filter-btn');
    if (filterBtn) {
        // Reset all buttons to default classes
        document.querySelectorAll('.repair-filter-btn').forEach(btn => {
            btn.className = `repair-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors ${btn.getAttribute('data-default')}`;
        });
        
        // Set Active State
        filterBtn.className = 'repair-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors bg-slate-800 text-white border border-transparent';
        
        currentRepairFilter = filterBtn.getAttribute('data-filter');
        renderRepairs();
    }
});
// --- Interactive Customers & Motorcycles Logic ---

const mockCustomersData = [
    {
        id: '1',
        name: 'Juan Dela Cruz',
        joined: 'Jan 15, 2026',
        phone: '0917-123-4567',
        status: 'in-shop',
        statusHtml: '<span class="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-200 uppercase tracking-wider"><span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> 1 In-Shop</span>',
        vehicles: [
            { make: 'Honda Click 125i (2023)', plate: 'ABC-1234', engine: 'K59A-1234567', status: 'In-Repair', statusClass: 'bg-orange-50 text-orange-700 border-orange-200' },
            { make: 'Yamaha NMAX V2 (2021)', plate: 'XYZ-9876', engine: 'B6H-9876543', status: 'Cleared', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
        ]
    },
    {
        id: '2',
        name: 'Maria Clara',
        joined: 'Mar 02, 2026',
        phone: '0918-987-6543',
        status: 'cleared',
        statusHtml: '<span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 uppercase tracking-wider"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Cleared</span>',
        vehicles: [
            { make: 'Honda ADV 160 (2024)', plate: 'DEF-5678', engine: 'ADV160-55555', status: 'Cleared', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
        ]
    }
];

function renderCustomers() {
    const tbody = document.getElementById('customers-tbody');
    if (!tbody) return;

    const query = (document.getElementById('cust-search')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('cust-filter-status')?.value || 'all';

    const filtered = mockCustomersData.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(query) || 
                              customer.vehicles.some(v => v.plate.toLowerCase().includes(query));
        const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-500 font-medium">No customers or vehicles match the current filters.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(customer => {
        const vehicleRows = customer.vehicles.map(vehicle => `
            <div class="flex items-center justify-between ml-2 py-3 px-3 hover:bg-white transition-colors">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <i class="ph-fill ph-motorcycle text-xl"></i>
                    </div>
                    <div>
                        <div class="font-bold text-slate-800 flex items-center gap-2">
                            ${vehicle.make}
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${vehicle.statusClass}">${vehicle.status}</span>
                        </div>
                        <div class="text-xs text-slate-500 font-mono mt-0.5 flex gap-3">
                            <span>Plate: ${vehicle.plate}</span>
                            <span class="text-slate-300">|</span>
                            <span>Engine/Chassis: ${vehicle.engine}</span>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 pr-2">
                    <!-- NEW: View History Button Action -->
                    <button onclick="viewVehicleHistory('${vehicle.plate}')" class="text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium text-xs border border-slate-200 bg-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
                        <i class="ph-bold ph-eye"></i> View History
                    </button>
                    <!-- NEW: Create Ticket Button Action -->
                    <button onclick="createRepairTicket('${vehicle.make}', '${vehicle.plate}')" class="text-white bg-blue-600 hover:bg-blue-700 font-bold text-xs px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 shadow-sm">
                        <i class="ph-bold ph-wrench"></i> Create Ticket
                    </button>
                </div>
            </div>
        `).join('');

        return `
            <tr class="hover:bg-slate-50 transition-colors cursor-pointer group" onclick="toggleCustomerRow('cust-row-${customer.id}')">
                <td class="p-4 text-center">
                    <i class="ph-bold ph-caret-down text-slate-400 transition-transform group-hover:text-blue-500" id="cust-icon-${customer.id}"></i>
                </td>
                <td class="p-4">
                    <div class="font-bold text-slate-800 text-base">${customer.name}</div>
                    <div class="text-xs text-slate-500 mt-0.5">Joined: ${customer.joined}</div>
                </td>
                <td class="p-4">
                    <div class="flex items-center gap-2">
                        <span class="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-xs border border-slate-200">${customer.vehicles.length} Vehicle${customer.vehicles.length > 1 ? 's' : ''}</span>
                        ${customer.statusHtml}
                    </div>
                </td>
                <td class="p-4 text-center text-slate-600 font-mono">${customer.phone}</td>
                <td class="p-4 text-right">
                    <!-- NEW: Edit Profile Button Action -->
                    <button class="text-blue-600 hover:bg-blue-50 font-medium text-xs border border-blue-200 bg-white px-3 py-1.5 rounded-md transition-colors" onclick="editCustomerProfile('${customer.name}', '${customer.phone}', event)">Edit Profile</button>
                </td>
            </tr>
            <tr id="cust-row-${customer.id}" class="hidden bg-slate-50/50 border-b border-slate-200">
                <td class="p-0 border-r border-slate-100"></td>
                <td colspan="4" class="p-0">
                    <div class="divide-y divide-slate-100/50">
                        ${vehicleRows}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 1. Edit Profile Logic (Pre-fills existing modal)
window.editCustomerProfile = function(name, phone, event) {
    event.stopPropagation(); // Prevents the row from expanding/collapsing when clicking the button
    
    // Open existing modal
    toggleModal('modal-customer', 'customer-backdrop', 'customer-content', true);
    
    // Change Title to 'Edit'
    const title = document.querySelector('#modal-customer h2');
    if (title) title.innerHTML = `<i class="ph-fill ph-pencil-simple text-blue-600"></i> Edit Customer Profile`;

    // Split name into First and Last and pre-fill inputs
    const inputs = document.querySelectorAll('#modal-customer input[type="text"], #modal-customer input[type="tel"]');
    if (inputs.length >= 3) {
        const nameParts = name.split(' ');
        inputs[0].value = nameParts[0] || ''; 
        inputs[1].value = nameParts.slice(1).join(' ') || '';
        inputs[2].value = phone || '';
    }
};

// 2. View History Logic (Auto-navigates and filters)
window.viewVehicleHistory = function(plate) {
    // Click the Service History navigation link programmatically
    const historyLink = document.querySelector('.nav-link[data-target="history"]');
    if (historyLink) {
        historyLink.click();
        
        // Wait a tiny bit for the HTML to fetch, then populate the search bar
        setTimeout(() => {
            const searchInput = document.getElementById('history-search');
            if (searchInput) {
                searchInput.value = plate;
                searchInput.dispatchEvent(new Event('input')); // Triggers the render function
            }
        }, 150);
    }
};

// 3. Create Ticket Logic (Auto-navigates to Diagnostics)
window.createRepairTicket = function(make, plate) {
    if(confirm(`Do you want to create a new active repair ticket and run a diagnostic scan for:\n\n${make} (${plate})?`)) {
        const diagLink = document.querySelector('.nav-link[data-target="diagnostics"]');
        if (diagLink) {
            diagLink.click();
        }
    }
};

window.toggleCustomerRow = function(rowId) {
    const detailRow = document.getElementById(rowId);
    const iconId = rowId.replace('cust-row-', 'cust-icon-');
    const icon = document.getElementById(iconId);
    
    if (detailRow.classList.contains('hidden')) {
        detailRow.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180', 'text-blue-500');
    } else {
        detailRow.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180', 'text-blue-500');
    }
};

// Attach Listeners
document.addEventListener('input', function(e) {
    if (e.target.id === 'cust-search') renderCustomers();
});

document.addEventListener('change', function(e) {
    if (e.target.id === 'cust-filter-status') renderCustomers();
});


// =====================================================================
// --- Mobile App Mode (Chief Mechanic & Sub-Mechanic) ---
// Only these roles get the mobile UI. Screens are converted one at a time:
// add the screen name to `mobileViews` once views/mobile/<name>.html exists.
// =====================================================================

const MOBILE_ROLES = ['chief', 'sub'];

// Screens that already have a mobile version (views/mobile/<name>.html)
const mobileViews = ['dashboard'];

// Short app-bar titles (the sidebar labels are too long for a phone)
const mobileTitles = {
    dashboard: 'Home',
    repairs: 'Active Repairs',
    diagnostics: 'Diagnostics',
    inventory: 'Parts & Inventory',
    customers: 'Customers',
    history: 'Service History'
};

// Mock jobs for the mobile Home screen (mechanic names match systemUsers)
const mockMobileJobs = [
    { id: 'JOB #1042', plate: 'ABC-1234', model: 'Honda Click 125i', task: 'Coolant sensor & brake pads', status: 'Waiting Parts', tone: 'orange', mechanic: 'Larpus', progress: 45 },
    { id: 'JOB #1041', plate: 'XYZ-9876', model: 'Yamaha NMAX', task: 'Throttle body cleaning & oil change', status: 'Pending Post-Scan', tone: 'purple', mechanic: 'Hiyo', progress: 90 },
    { id: 'JOB #1043', plate: 'DEF-5678', model: 'Honda ADV 160', task: 'Chain & sprocket set', status: 'In Progress', tone: 'blue', mechanic: 'Hiyo', progress: 60 },
    { id: 'JOB #1044', plate: 'QRS-4455', model: 'Suzuki Raider R150', task: 'Clutch lining replacement', status: 'In Progress', tone: 'blue', mechanic: 'Larpus', progress: 30 }
];

const mobileTones = {
    orange: { chip: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500' },
    purple: { chip: 'bg-purple-100 text-purple-700', bar: 'bg-purple-500' },
    blue:   { chip: 'bg-blue-100 text-blue-700',     bar: 'bg-blue-500' }
};

// Jobs visible to a role: Chief sees the whole shop, Sub only their own
function getMobileJobs(roleId) {
    if (roleId === 'chief') return mockMobileJobs;
    return mockMobileJobs.filter(job => job.mechanic === systemUsers[roleId].name);
}

// Toggles mobile mode + fills the shell (app bar avatar, More sheet, tab badge). Returns true if mobile.
function applyMobileMode(roleId) {
    const isMobile = MOBILE_ROLES.includes(roleId);
    document.body.classList.toggle('mobile-app', isMobile);

    if (!isMobile) {
        mToggleMore(false);
        mainContentArea.classList.remove('m-screen');
        return false;
    }

    const user = systemUsers[roleId];
    ['m-header-avatar', 'm-sheet-avatar'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = user.initials;
        el.classList.remove('bg-blue-600', 'bg-purple-600', 'bg-slate-600', 'bg-slate-800', 'bg-emerald-600');
        el.classList.add(user.color);
    });
    document.getElementById('m-sheet-name').textContent = user.name;
    document.getElementById('m-sheet-role').textContent = user.role;
    document.getElementById('m-jobs-badge').textContent = getMobileJobs(roleId).length;

    // Role-gated pieces of the mobile shell (e.g. Chief-only sheet rows)
    document.querySelectorAll('#m-more-sheet [data-mroles]').forEach(el => {
        el.style.display = el.dataset.mroles.split(',').includes(roleId) ? '' : 'none';
    });
    return true;
}

// Bottom tab bar -> reuses the (hidden) sidebar links so all routing stays in one place
function mNav(target) {
    mToggleMore(false);
    document.querySelector(`.nav-link[data-target="${target}"]`)?.click();
}

// Highlight the active tab; "More" owns the screens that have no tab of their own
function syncMobileNav(target) {
    const tabIds = ['dashboard', 'repairs', 'diagnostics', 'inventory'];
    const activeTab = tabIds.includes(target) ? target : 'more';
    document.querySelectorAll('.m-tab[data-mtab]').forEach(tab => {
        tab.classList.toggle('is-active', tab.dataset.mtab === activeTab);
    });
}

function mToggleMore(show) {
    document.getElementById('m-more-backdrop')?.classList.toggle('is-open', show);
    document.getElementById('m-more-sheet')?.classList.toggle('is-open', show);
}

let mToastTimer = null;
function mToast(message) {
    const toast = document.getElementById('m-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-show');
    clearTimeout(mToastTimer);
    mToastTimer = setTimeout(() => toast.classList.remove('is-show'), 2000);
}

function mApprove(plate, btn) {
    btn.closest('.m-review-card')?.remove();
    mToast(`Post-scan approved for ${plate}`);
    if (!document.querySelector('#m-review-list .m-review-card')) {
        document.getElementById('m-review-list').innerHTML = `
            <div class="bg-white rounded-2xl border border-slate-100 p-4 text-center text-xs font-semibold text-slate-400">
                <i class="ph-fill ph-check-circle text-emerald-400 text-2xl block mb-1"></i> All caught up
            </div>`;
    }
}

// Fills views/mobile/dashboard.html for the current role (Chief vs Sub)
function renderMobileHome() {
    const roleId = currentRole;
    const user = systemUsers[roleId];
    const isChief = roleId === 'chief';
    const jobs = getMobileJobs(roleId);
    const hour = new Date().getHours();

    // Hero (role-coloured) + greeting
    const hero = document.getElementById('m-hero');
    hero.classList.remove('from-purple-600', 'to-indigo-700', 'from-sky-600', 'to-blue-700');
    hero.classList.add(...(isChief ? ['from-purple-600', 'to-indigo-700'] : ['from-sky-600', 'to-blue-700']));
    document.getElementById('m-greeting').textContent = hour < 12 ? 'Good morning,' : hour < 18 ? 'Good afternoon,' : 'Good evening,';
    document.getElementById('m-name').textContent = user.name;
    document.getElementById('m-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    document.getElementById('m-role-chip').innerHTML = `<i class="ph-fill ${isChief ? 'ph-crown-simple' : 'ph-wrench'}"></i> ${user.role}`;

    // Role-gated blocks inside the view
    document.querySelectorAll('#m-home [data-mroles]').forEach(el => {
        el.style.display = el.dataset.mroles.split(',').includes(roleId) ? '' : 'none';
    });

    // Stats
    document.getElementById('m-stat-active').textContent = jobs.length;
    document.getElementById('m-stat-waiting').textContent = jobs.filter(j => j.status === 'Waiting Parts').length;

    // Job cards
    document.getElementById('m-jobs-title').textContent = isChief ? 'Shop Jobs' : 'My Jobs';
    const jobsList = document.getElementById('m-jobs-list');
    jobsList.innerHTML = jobs.length ? jobs.map(job => {
        const tone = mobileTones[job.tone];
        return `
            <button onclick="mNav('repairs')" class="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <div class="flex items-center gap-2">
                            <span class="font-extrabold text-slate-800">${job.plate}</span>
                            <span class="text-[10px] font-bold text-slate-400">${job.id}</span>
                        </div>
                        <p class="text-xs text-slate-500 mt-0.5 truncate">${job.model}</p>
                    </div>
                    <span class="px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap ${tone.chip}">${job.status}</span>
                </div>
                <p class="text-xs text-slate-600 mt-2">${job.task}</p>
                <div class="mt-3 flex items-center gap-3">
                    <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full rounded-full ${tone.bar}" style="width:${job.progress}%"></div></div>
                    <span class="text-[10px] font-bold text-slate-500">${job.progress}%</span>
                </div>
                ${isChief ? `<div class="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500"><i class="ph-fill ph-user-circle text-base"></i> ${job.mechanic}</div>` : ''}
            </button>`;
    }).join('') : `
        <div class="bg-white rounded-2xl border border-slate-100 p-6 text-center text-xs font-semibold text-slate-400">
            <i class="ph-fill ph-coffee text-3xl block mb-1 text-slate-300"></i> No jobs assigned to you
        </div>`;

    // Chief-only: post-scan approvals + team workload
    if (isChief) {
        const reviews = mockMobileJobs.filter(j => j.status === 'Pending Post-Scan');
        document.getElementById('m-review-list').innerHTML = reviews.length ? reviews.map(job => `
            <div class="m-review-card bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl shrink-0"><i class="ph-fill ph-cpu"></i></span>
                <div class="min-w-0 flex-1">
                    <p class="text-sm font-extrabold text-slate-800">${job.plate} <span class="text-[11px] font-semibold text-slate-400">· ${job.mechanic}</span></p>
                    <p class="text-xs text-slate-500 truncate">Post-repair scan ready for approval</p>
                </div>
                <button onclick="mApprove('${job.plate}', this)" class="px-3 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold active:scale-95 transition-transform">Approve</button>
            </div>`).join('') : `
            <div class="bg-white rounded-2xl border border-slate-100 p-4 text-center text-xs font-semibold text-slate-400">All caught up</div>`;

        const team = [
            { name: 'Larpus', initials: 'JB', color: 'bg-purple-600', role: 'Chief' },
            { name: 'Hiyo', initials: 'F', color: 'bg-slate-600', role: 'Sub' }
        ];
        document.getElementById('m-team-list').innerHTML = team.map(member => {
            const count = mockMobileJobs.filter(j => j.mechanic === member.name).length;
            const pct = Math.min(100, Math.round((count / mockMobileJobs.length) * 100));
            return `
                <div class="flex items-center gap-3 p-3.5">
                    <span class="w-9 h-9 rounded-full ${member.color} text-white flex items-center justify-center text-xs font-bold shrink-0">${member.initials}</span>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <p class="text-sm font-bold text-slate-800">${member.name} <span class="text-[10px] font-semibold text-slate-400">${member.role}</span></p>
                            <span class="text-xs font-bold text-slate-500">${count} job${count === 1 ? '' : 's'}</span>
                        </div>
                        <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5"><div class="h-full bg-blue-500 rounded-full" style="width:${pct}%"></div></div>
                    </div>
                </div>`;
        }).join('');
    }
}


// =====================================================================
// --- Physical Inspection Log (Diagnostics) ---
// Grouped checklist with big OK / Watch / Fix buttons, measurement
// steppers that auto-grade, defect tags, notes, photos, parts suggestions
// and a one-tap "Add to Final Findings". Draft is auto-saved on the device.
// =====================================================================

const INSPECTION_STORAGE_KEY = 'motocare_physical_inspection_draft';

const inspectionStatuses = [
    { key: 'ok',    label: 'OK',    icon: 'ph-check-circle' },
    { key: 'watch', label: 'Watch', icon: 'ph-warning' },
    { key: 'fix',   label: 'Fix',   icon: 'ph-wrench' },
    { key: 'na',    label: 'N/A',   icon: 'ph-minus-circle' }
];
const inspectionStatusLabels = { ok: 'OK', watch: 'Watch', fix: 'Fix', na: 'N/A' };

// measure.type 'below': Watch when under `soon`, Fix when at/under `fix`
// measure.type 'range': OK inside [min, max], Watch just outside, Fix far outside
// part: id from mockInventory to suggest when the item is flagged
const inspectionSections = [
    {
        id: 'tires', title: 'Tires & Wheels', short: 'Tires', icon: 'ph-circle-notch',
        items: [
            { id: 'tire_f', label: 'Front Tire', hint: 'Tread depth, cracks, sidewall bulges',
              measure: { type: 'below', unit: 'mm', start: 3, step: 0.5, soon: 3, fix: 1.6, help: 'OK ≥ 3 mm · Fix ≤ 1.6 mm' },
              tags: ['Worn tread', 'Cracked sidewall', 'Puncture / nail', 'Uneven wear', 'Bulge'] },
            { id: 'tire_r', label: 'Rear Tire', hint: 'Tread depth, cracks, sidewall bulges',
              measure: { type: 'below', unit: 'mm', start: 3, step: 0.5, soon: 3, fix: 1.6, help: 'OK ≥ 3 mm · Fix ≤ 1.6 mm' },
              tags: ['Worn tread', 'Cracked sidewall', 'Puncture / nail', 'Uneven wear', 'Bulge'] },
            { id: 'psi_f', label: 'Front Tire Pressure', hint: 'Check cold, set to spec',
              measure: { type: 'range', unit: 'PSI', start: 30, step: 1, min: 28, max: 33, help: 'OK 28–33 PSI' },
              tags: ['Too low', 'Too high', 'Slow leak'] },
            { id: 'psi_r', label: 'Rear Tire Pressure', hint: 'Check cold, set to spec',
              measure: { type: 'range', unit: 'PSI', start: 32, step: 1, min: 30, max: 36, help: 'OK 30–36 PSI' },
              tags: ['Too low', 'Too high', 'Slow leak'] },
            { id: 'wheels', label: 'Wheels / Rims', hint: 'Bends, cracks, loose spokes, bearing play',
              tags: ['Bent rim', 'Loose spokes', 'Bearing play', 'Cracked'] }
        ]
    },
    {
        id: 'brakes', title: 'Brakes', short: 'Brakes', icon: 'ph-stop-circle',
        items: [
            { id: 'pad_f', label: 'Front Brake Pads', hint: 'Pad thickness and even wear',
              measure: { type: 'below', unit: 'mm', start: 4, step: 0.5, soon: 4, fix: 2, help: 'OK ≥ 4 mm · Fix ≤ 2 mm' },
              tags: ['Below minimum', 'Uneven wear', 'Glazed', 'Squealing'], part: 'p2' },
            { id: 'pad_r', label: 'Rear Pads / Shoes', hint: 'Lining thickness and even wear',
              measure: { type: 'below', unit: 'mm', start: 3, step: 0.5, soon: 3, fix: 1.5, help: 'OK ≥ 3 mm · Fix ≤ 1.5 mm' },
              tags: ['Below minimum', 'Uneven wear', 'Glazed', 'Squealing'] },
            { id: 'brake_fluid', label: 'Brake Fluid', hint: 'Level and colour (change every 1–2 years)',
              tags: ['Low level', 'Dark / dirty', 'Contaminated', 'Leak'] },
            { id: 'brake_feel', label: 'Lever / Pedal Feel', hint: 'Firm, no sponginess or drag',
              tags: ['Spongy', 'Too soft', 'Dragging', 'Needs adjustment'] },
            { id: 'brake_disc', label: 'Discs / Drums', hint: 'Scoring, warp, rust',
              tags: ['Warped', 'Scored', 'Rusted', 'Below min thickness'] }
        ]
    },
    {
        id: 'engine', title: 'Engine & Fluids', short: 'Engine', icon: 'ph-engine',
        items: [
            { id: 'oil', label: 'Engine Oil', hint: 'Level and colour on the dipstick / sight glass',
              tags: ['Low level', 'Black / dirty', 'Milky', 'Overdue change'], part: 'p4' },
            { id: 'coolant', label: 'Coolant', hint: 'Liquid-cooled only. Use N/A for air-cooled engines',
              tags: ['Low level', 'Discoloured', 'Leak'] },
            { id: 'air_filter', label: 'Air Filter', hint: 'Clogged, oily or torn',
              tags: ['Clogged', 'Oily', 'Torn'] },
            { id: 'spark', label: 'Spark Plug', hint: 'Electrode wear and fouling',
              tags: ['Fouled', 'Worn electrode', 'Wet / oily', 'Wrong gap'], part: 'p5' },
            { id: 'leaks', label: 'Leaks (visual)', hint: 'Look under the unit and around gaskets',
              tags: ['Engine oil', 'Coolant', 'Fuel', 'Fork oil', 'Gasket'] }
        ]
    },
    {
        id: 'drive', title: 'Drivetrain', short: 'Drive', icon: 'ph-link',
        items: [
            { id: 'chain', label: 'Chain / CVT Belt', hint: 'Chain slack, rust, belt cracks',
              measure: { type: 'range', unit: 'mm', start: 25, step: 1, min: 20, max: 35, help: 'Chain slack OK 20–35 mm (skip for CVT belt)' },
              tags: ['Too loose', 'Too tight', 'Dry / rusty', 'Cracked belt', 'Stretched'], part: 'p3' },
            { id: 'sprocket', label: 'Sprockets / CVT Rollers', hint: 'Hooked teeth, flat-spotted rollers',
              tags: ['Hooked teeth', 'Worn rollers', 'Noise', 'Flat spots'] },
            { id: 'clutch', label: 'Clutch / Free Play', hint: 'Engagement and lever free play',
              tags: ['Slipping', 'Too stiff', 'Free play off', 'Cable frayed'] }
        ]
    },
    {
        id: 'electrical', title: 'Electrical', short: 'Electrical', icon: 'ph-lightning',
        items: [
            { id: 'battery', label: 'Battery Voltage', hint: 'Engine off, battery rested',
              measure: { type: 'below', unit: 'V', start: 12.6, step: 0.1, soon: 12.4, fix: 12, help: 'OK ≥ 12.4 V · Fix ≤ 12.0 V' },
              tags: ['Weak', 'Corroded terminals', 'Swollen', 'Old (2+ years)'] },
            { id: 'charging', label: 'Charging Voltage', hint: 'Engine running at ~3,000 rpm',
              measure: { type: 'range', unit: 'V', start: 14, step: 0.1, min: 13.5, max: 14.8, help: 'OK 13.5–14.8 V' },
              tags: ['Undercharging', 'Overcharging', 'Bad regulator', 'Stator issue'] },
            { id: 'lights', label: 'Lights & Signals', hint: 'Head, brake, tail, turn signals',
              tags: ['Headlight out', 'Brake light out', 'Signal out', 'Dim'] },
            { id: 'horn', label: 'Horn / Switches', hint: 'Horn, kill switch, handlebar controls',
              tags: ['Weak horn', 'No sound', 'Sticky switch'] },
            { id: 'starter', label: 'Starter / Wiring', hint: 'Cranking speed, burnt or loose wiring',
              tags: ['Slow crank', 'Clicking', 'Loose / burnt wiring'] }
        ]
    },
    {
        id: 'chassis', title: 'Suspension & Steering', short: 'Chassis', icon: 'ph-steering-wheel',
        items: [
            { id: 'fork', label: 'Front Fork', hint: 'Seal leaks, stiction, bottoming',
              tags: ['Leaking seals', 'Bottoming out', 'Stiff', 'Bent'] },
            { id: 'shock', label: 'Rear Shock(s)', hint: 'Leaks, weak damping, worn bushings',
              tags: ['Leaking', 'Weak / soft', 'Noisy', 'Worn bushings'] },
            { id: 'steering', label: 'Steering Bearings', hint: 'Free play and notchiness',
              tags: ['Loose', 'Notchy', 'Too tight'] },
            { id: 'frame', label: 'Frame / Swingarm', hint: 'Cracks, bends, rust, loose bolts',
              tags: ['Crack', 'Bent', 'Rust', 'Loose bolts'] }
        ]
    }
];

const inspectionItems = inspectionSections.flatMap(sec => sec.items.map(item => ({ ...item, section: sec.id })));
const inspectionItemMap = Object.fromEntries(inspectionItems.map(item => [item.id, item]));

// --- State (auto-saved to this device so a refresh / lost signal never wipes the checklist) ---
function emptyInspectionState() {
    return { intake: { odo: '', fuel: '', complaints: [] }, items: {} };
}

function loadInspectionState() {
    try {
        const raw = localStorage.getItem(INSPECTION_STORAGE_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            return {
                intake: { ...emptyInspectionState().intake, ...(saved.intake || {}) },
                items: saved.items || {}
            };
        }
    } catch (err) { /* storage unavailable or corrupt: start fresh */ }
    return emptyInspectionState();
}

function saveInspectionState() {
    try { localStorage.setItem(INSPECTION_STORAGE_KEY, JSON.stringify(inspectionState)); } catch (err) { /* ignore quota errors */ }
}

let inspectionState = loadInspectionState();
let inspectionPhotos = {};           // item id -> [dataURL] (memory only, photos are too large for localStorage)
const inspectionCollapsed = {};      // section id -> true when collapsed (sections start collapsed until opened)
const isInspectionCollapsed = id => inspectionCollapsed[id] !== false;

function getInspItem(id) {
    if (!inspectionState.items[id]) {
        inspectionState.items[id] = { status: null, manual: false, value: '', tags: [], note: '' };
    }
    return inspectionState.items[id];
}

function inspEsc(text) {
    return String(text ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Grades a measurement against the item's thresholds
function evaluateInspectionMeasure(measure, raw) {
    const value = parseFloat(raw);
    if (isNaN(value)) return null;
    if (measure.type === 'below') {
        return value <= measure.fix ? 'fix' : value < measure.soon ? 'watch' : 'ok';
    }
    if (value >= measure.min && value <= measure.max) return 'ok';
    const gap = value < measure.min ? measure.min - value : value - measure.max;
    return gap > (measure.max - measure.min) * 0.5 ? 'fix' : 'watch';
}

function inspectionAutoText(item, st) {
    if (!item.measure) return '';
    const graded = st.value !== '' && !st.manual && st.status;
    return item.measure.help + (graded ? ` · Auto: ${inspectionStatusLabels[st.status]}` : '');
}

// --- Rendering ---
function renderInspectionItem(item) {
    const st = getInspItem(item.id);
    const m = item.measure;
    const showDetail = st.status === 'watch' || st.status === 'fix';
    const part = item.part ? mockInventory.find(p => p.id === item.part) : null;

    const measureHtml = m ? `
        <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-1.5">
                <button type="button" data-insp="step" data-item="${item.id}" data-dir="-1" class="insp-step" aria-label="Decrease"><i class="ph-bold ph-minus"></i></button>
                <div class="relative">
                    <input type="number" inputmode="decimal" step="${m.step}" value="${inspEsc(st.value)}" placeholder="${m.start}" data-insp-input="measure" data-item="${item.id}" class="insp-num">
                    <span class="insp-unit">${m.unit}</span>
                </div>
                <button type="button" data-insp="step" data-item="${item.id}" data-dir="1" class="insp-step" aria-label="Increase"><i class="ph-bold ph-plus"></i></button>
            </div>
            <p class="text-[10px] font-semibold text-slate-400 flex-1 min-w-[120px] text-right leading-snug" data-auto="${item.id}">${inspectionAutoText(item, st)}</p>
        </div>` : '';

    const partHtml = !part ? '' : (part.stock > 0
        ? `<button type="button" data-insp="addpart" data-part="${part.id}" class="insp-part-btn"><i class="ph-bold ph-plus"></i> ${part.name} <span class="font-semibold opacity-70">· ${part.stock} in stock</span></button>`
        : `<button type="button" disabled class="insp-part-btn"><i class="ph-bold ph-prohibit"></i> ${part.name} · Out of stock</button>`);

    return `
        <div class="insp-item rounded-xl border border-slate-200" data-item="${item.id}" data-status="${st.status || 'none'}">
            <div class="p-3 flex flex-col gap-3">
                <div class="min-w-0">
                    <p class="text-sm font-extrabold text-slate-800 leading-tight">${item.label}</p>
                    <p class="text-[11px] text-slate-500 mt-0.5 leading-snug">${item.hint}</p>
                </div>
                ${measureHtml}
                <div class="grid grid-cols-4 gap-1.5">
                    ${inspectionStatuses.map(s => `
                        <button type="button" data-insp="status" data-item="${item.id}" data-status="${s.key}" class="insp-btn ${s.key} ${st.status === s.key ? 'is-active' : ''}">
                            <i class="ph-bold ${s.icon} text-base"></i> ${s.label}
                        </button>`).join('')}
                </div>
                <div class="insp-detail ${showDetail ? '' : 'hidden'} flex flex-col gap-2.5 pt-3 border-t border-slate-200/70" data-detail="${item.id}">
                    <div class="flex flex-wrap gap-1.5">
                        ${item.tags.map(tag => `<button type="button" data-insp="tag" data-item="${item.id}" data-tag="${inspEsc(tag)}" class="insp-chip ${st.tags.includes(tag) ? 'is-active' : ''}">${tag}</button>`).join('')}
                    </div>
                    <input type="text" placeholder="Add a note (optional)" value="${inspEsc(st.note)}" data-insp-input="note" data-item="${item.id}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <div class="flex flex-wrap items-center gap-2">
                        <label class="insp-photo-btn"><i class="ph-bold ph-camera text-base"></i> Photo
                            <input type="file" accept="image/*" capture="environment" class="hidden" data-insp-file data-item="${item.id}">
                        </label>
                        <div class="flex gap-1.5" data-photos="${item.id}"></div>
                        ${partHtml}
                    </div>
                </div>
            </div>
        </div>`;
}

function renderInspectionSection(sec) {
    return `
        <div class="insp-section ${isInspectionCollapsed(sec.id) ? 'is-collapsed' : ''} bg-white border border-slate-200 rounded-xl overflow-hidden" id="insp-sec-${sec.id}" data-section="${sec.id}">
            <div class="flex items-center gap-2 px-3.5 py-3 bg-slate-50 border-b border-slate-200">
                <button type="button" data-insp="toggle-section" data-section="${sec.id}" class="flex items-center gap-2.5 flex-1 min-w-0 text-left">
                    <span class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg shrink-0"><i class="ph-fill ${sec.icon}"></i></span>
                    <span class="min-w-0">
                        <span class="block text-sm font-extrabold text-slate-800">${sec.title}</span>
                        <span class="block text-[11px] font-semibold text-slate-400" data-sec-count="${sec.id}"></span>
                    </span>
                    <i class="ph-bold ph-caret-down insp-caret text-slate-400 ml-auto"></i>
                </button>
                <button type="button" data-insp="section-ok" data-section="${sec.id}" class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2.5 rounded-lg active:scale-95 transition-transform whitespace-nowrap">Rest OK</button>
            </div>
            <div class="insp-section-body p-2.5 flex flex-col gap-2.5">
                ${sec.items.map(renderInspectionItem).join('')}
            </div>
        </div>`;
}

function renderInspection() {
    const host = document.getElementById('insp-sections');
    if (!host) return;
    host.innerHTML = `<div class="insp-grid-inner" style="align-items:start">${inspectionSections.map(renderInspectionSection).join('')}</div>`;
    restoreInspectionIntake();
    inspectionItems.forEach(item => renderInspectionThumbs(item.id));
    refreshInspectionSummary();
}

function restoreInspectionIntake() {
    const { odo, fuel, complaints } = inspectionState.intake;
    const odoInput = document.getElementById('insp-odo');
    if (odoInput) odoInput.value = odo;
    document.querySelectorAll('[data-insp="fuel"]').forEach(btn => btn.classList.toggle('is-active', btn.dataset.fuel === fuel));
    document.querySelectorAll('[data-insp="complaint"]').forEach(btn => btn.classList.toggle('is-active', complaints.includes(btn.dataset.complaint)));
}

function renderInspectionThumbs(id) {
    const box = document.querySelector(`[data-photos="${id}"]`);
    if (!box) return;
    box.innerHTML = (inspectionPhotos[id] || []).map((src, index) => `
        <div class="insp-thumb"><img src="${src}" alt="Inspection photo">
            <button type="button" data-insp="remove-photo" data-item="${id}" data-index="${index}" aria-label="Remove photo"><i class="ph-bold ph-x"></i></button>
        </div>`).join('');
}

// Patches one row in place (keeps keyboard focus while typing a measurement)
function refreshInspectionRow(id) {
    const row = document.querySelector(`.insp-item[data-item="${id}"]`);
    if (!row) return;
    const st = getInspItem(id);
    const item = inspectionItemMap[id];

    row.dataset.status = st.status || 'none';
    row.querySelectorAll('.insp-btn').forEach(btn => btn.classList.toggle('is-active', btn.dataset.status === st.status));
    row.querySelector('.insp-detail').classList.toggle('hidden', !(st.status === 'watch' || st.status === 'fix'));
    row.querySelectorAll('.insp-chip[data-tag]').forEach(chip => chip.classList.toggle('is-active', st.tags.includes(chip.dataset.tag)));
    const auto = row.querySelector(`[data-auto="${id}"]`);
    if (auto) auto.textContent = inspectionAutoText(item, st);

    refreshInspectionSummary();
}

function inspectionFormatEntry(item) {
    const st = getInspItem(item.id);
    const value = item.measure && st.value !== '' ? `${st.value} ${item.measure.unit}` : '';
    return `• ${item.label}${value ? ` (${value})` : ''}${st.tags.length ? ` — ${st.tags.join(', ')}` : ''}${st.note ? ` [${st.note}]` : ''}`;
}

function buildInspectionFindings() {
    const { odo, fuel, complaints } = inspectionState.intake;
    const fix = inspectionItems.filter(i => getInspItem(i.id).status === 'fix');
    const watch = inspectionItems.filter(i => getInspItem(i.id).status === 'watch');
    const checked = inspectionItems.filter(i => getInspItem(i.id).status).length;
    const unchecked = inspectionItems.length - checked;

    const lines = ['— PHYSICAL INSPECTION —'];
    const meta = [];
    if (odo) meta.push(`Odometer: ${Number(odo).toLocaleString()} km`);
    if (fuel) meta.push(`Fuel: ${fuel}`);
    if (meta.length) lines.push(meta.join(' | '));
    if (complaints.length) lines.push(`Complaint: ${complaints.join(', ')}`);
    if (fix.length) lines.push('', 'NEEDS REPAIR / REPLACEMENT:', ...fix.map(inspectionFormatEntry));
    if (watch.length) lines.push('', 'MONITOR / ADVISE CUSTOMER:', ...watch.map(inspectionFormatEntry));
    if (!fix.length && !watch.length && checked) lines.push('', 'No issues found on the checked items.');
    if (unchecked > 0) lines.push('', `(${unchecked} item${unchecked === 1 ? '' : 's'} not inspected)`);
    lines.push('— END INSPECTION —');
    return lines.join('\n');
}

function refreshInspectionSummary() {
    const total = inspectionItems.length;
    const counts = { ok: 0, watch: 0, fix: 0, na: 0 };
    inspectionItems.forEach(item => { const s = getInspItem(item.id).status; if (s) counts[s]++; });
    const checked = counts.ok + counts.watch + counts.fix + counts.na;

    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    setText('insp-progress-text', `${checked} / ${total} checked`);
    setText('insp-count-ok', counts.ok);
    setText('insp-count-watch', counts.watch);
    setText('insp-count-fix', counts.fix);
    const fill = document.getElementById('insp-progress-fill');
    if (fill) {
        fill.style.width = `${Math.round((checked / total) * 100)}%`;
        fill.classList.toggle('bg-emerald-500', checked === total);
        fill.classList.toggle('bg-blue-500', checked !== total);
    }

    // Section jump pills + per-section counters
    const pills = document.getElementById('insp-pills');
    if (pills) {
        pills.innerHTML = inspectionSections.map(sec => {
            const done = sec.items.filter(i => getInspItem(i.id).status).length;
            const hasFix = sec.items.some(i => getInspItem(i.id).status === 'fix');
            return `<button type="button" data-insp="jump" data-section="${sec.id}" class="insp-pill ${done === sec.items.length ? 'is-done' : ''} ${hasFix ? 'has-fix' : ''}">
                <i class="ph-fill ${sec.icon}"></i> ${sec.short} ${done}/${sec.items.length}</button>`;
        }).join('');
    }
    inspectionSections.forEach(sec => {
        const done = sec.items.filter(i => getInspItem(i.id).status).length;
        const label = document.querySelector(`[data-sec-count="${sec.id}"]`);
        if (label) label.textContent = done === sec.items.length ? `All ${done} checked ✓` : `${done}/${sec.items.length} checked`;
    });

    // Summary panel
    const summary = document.getElementById('insp-summary');
    if (!summary) return;

    if (checked === 0) {
        summary.innerHTML = `
            <div class="border border-dashed border-slate-300 rounded-xl p-4 text-center text-xs font-semibold text-slate-400">
                <i class="ph-fill ph-clipboard-text text-2xl block mb-1 text-slate-300"></i>
                Tap OK / Watch / Fix on each item. Flagged items and suggested parts will be summarized here.
            </div>`;
        return;
    }

    const fix = inspectionItems.filter(i => getInspItem(i.id).status === 'fix');
    const watch = inspectionItems.filter(i => getInspItem(i.id).status === 'watch');
    const suggested = buildDiagnosisSuggestions();
    const partsOut = suggested.filter(s => s.level !== 'watch').map(s => mockInventory.find(p => p.id === s.id)).filter(p => p && p.stock === 0);

    const entry = (item, tone) => {
        const st = getInspItem(item.id);
        const value = item.measure && st.value !== '' ? `${st.value} ${item.measure.unit}` : '';
        return `
            <li class="flex items-start gap-2.5 p-2.5 rounded-lg ${tone === 'fix' ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'}">
                <i class="ph-fill ${tone === 'fix' ? 'ph-wrench text-red-500' : 'ph-warning text-amber-500'} text-lg mt-0.5 shrink-0"></i>
                <div class="min-w-0 flex-1">
                    <p class="text-sm font-bold text-slate-800">${item.label}${value ? ` <span class="text-xs font-semibold text-slate-500">· ${value}</span>` : ''}</p>
                    ${(st.tags.length || st.note) ? `<p class="text-xs text-slate-600 mt-0.5">${[...st.tags, st.note ? `“${inspEsc(st.note)}”` : ''].filter(Boolean).join(' · ')}</p>` : ''}
                </div>
                ${(inspectionPhotos[item.id] || []).length ? `<span class="text-[10px] font-bold text-slate-500 flex items-center gap-1 shrink-0"><i class="ph-bold ph-camera"></i>${inspectionPhotos[item.id].length}</span>` : ''}
            </li>`;
    };

    summary.innerHTML = `
        <div class="border border-slate-200 rounded-xl overflow-hidden">
            <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-2"><i class="ph-fill ph-list-checks text-blue-500 text-lg"></i> Inspection Summary</h3>
                <span class="text-[11px] font-bold text-slate-400">${total - checked} not checked</span>
            </div>
            <div class="p-3 flex flex-col gap-3">
                ${(!fix.length && !watch.length) ? `<p class="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-2"><i class="ph-fill ph-check-circle text-lg"></i> No issues found on the checked items.</p>` : ''}
                ${fix.length ? `<div><p class="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-1.5">Needs repair / replacement (${fix.length})</p><ul class="flex flex-col gap-1.5">${fix.map(i => entry(i, 'fix')).join('')}</ul></div>` : ''}
                ${watch.length ? `<div><p class="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">Monitor / advise customer (${watch.length})</p><ul class="flex flex-col gap-1.5">${watch.map(i => entry(i, 'watch')).join('')}</ul></div>` : ''}
                ${partsOut.length ? `<p class="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-start gap-2"><i class="ph-fill ph-package text-base shrink-0"></i> Out of stock, order needed: ${partsOut.map(p => p.name).join(', ')}</p>` : ''}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button type="button" data-insp="to-findings" class="min-h-[48px] rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                        <i class="ph-bold ph-note-pencil text-lg"></i> Add to Final Findings
                    </button>
                    <button type="button" data-insp="auto-assign" class="min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                        <i class="ph-bold ph-magic-wand text-lg"></i> Auto-Assign Parts${suggested.length ? ` (${suggested.length})` : ''}
                    </button>
                </div>
            </div>
        </div>`;
}

// --- Actions ---
function setInspectionStatus(id, status) {
    const st = getInspItem(id);
    if (st.status === status) {          // tap the active button again to clear it
        st.status = null;
        st.manual = false;
    } else {
        st.status = status;
        st.manual = true;
    }
    saveInspectionState();
    refreshInspectionRow(id);
    maybeAutoPopAssign();
}

function applyInspectionMeasure(id, raw) {
    const item = inspectionItemMap[id];
    const st = getInspItem(id);
    st.value = raw === '' ? '' : String(raw);
    if (!st.manual) st.status = evaluateInspectionMeasure(item.measure, st.value);   // auto-grade unless the mechanic overrode it
    saveInspectionState();
    refreshInspectionRow(id);
    maybeAutoPopAssign();
}

function stepInspectionMeasure(id, dir) {
    const m = inspectionItemMap[id].measure;
    const current = parseFloat(getInspItem(id).value);
    const next = isNaN(current) ? m.start : Math.max(0, Math.round((current + dir * m.step) * 10) / 10);
    const input = document.querySelector(`.insp-item[data-item="${id}"] [data-insp-input="measure"]`);
    if (input) input.value = next;
    applyInspectionMeasure(id, next);
}

function handleInspectionPhoto(input) {
    const id = input.dataset.item;
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, 900 / Math.max(img.width, img.height));   // downscale phone photos
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            if (!inspectionPhotos[id]) inspectionPhotos[id] = [];
            inspectionPhotos[id].push(canvas.toDataURL('image/jpeg', 0.7));
            renderInspectionThumbs(id);
            refreshInspectionSummary();
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
    input.value = '';
}

function resetInspection(skipConfirm) {
    if (!skipConfirm && !confirm('Clear all physical inspection results for this vehicle?')) return;
    inspectionState = emptyInspectionState();
    inspectionPhotos = {};
    autoAssignPrompted = false;
    saveInspectionState();
    renderInspection();
}

// Called after a vehicle is pushed to Active Repairs so the next inspection starts clean
function clearInspectionDraft() {
    inspectionState = emptyInspectionState();
    inspectionPhotos = {};
    autoAssignPrompted = false;
    saveInspectionState();
}

function flashInspectionButton(btn, html) {
    const original = btn.innerHTML;
    btn.innerHTML = html;
    setTimeout(() => { if (btn.isConnected) btn.innerHTML = original; }, 1600);
}

document.addEventListener('click', function(e) {
    const el = e.target.closest('[data-insp]');
    if (!el) return;
    const action = el.dataset.insp;

    if (action === 'status') {
        setInspectionStatus(el.dataset.item, el.dataset.status);

    } else if (action === 'tag') {
        const st = getInspItem(el.dataset.item);
        const tag = el.dataset.tag;
        st.tags = st.tags.includes(tag) ? st.tags.filter(t => t !== tag) : [...st.tags, tag];
        saveInspectionState();
        refreshInspectionRow(el.dataset.item);

    } else if (action === 'step') {
        stepInspectionMeasure(el.dataset.item, parseInt(el.dataset.dir, 10));

    } else if (action === 'section-ok') {
        const sec = inspectionSections.find(s => s.id === el.dataset.section);
        sec.items.forEach(item => {
            const st = getInspItem(item.id);
            if (!st.status) { st.status = 'ok'; st.manual = true; refreshInspectionRow(item.id); }
        });
        saveInspectionState();
        maybeAutoPopAssign();

    } else if (action === 'toggle-section') {
        const id = el.dataset.section;
        inspectionCollapsed[id] = !isInspectionCollapsed(id);
        document.getElementById(`insp-sec-${id}`)?.classList.toggle('is-collapsed', inspectionCollapsed[id]);

    } else if (action === 'jump') {
        const id = el.dataset.section;
        inspectionCollapsed[id] = false;
        const section = document.getElementById(`insp-sec-${id}`);
        if (section) {
            section.classList.remove('is-collapsed');
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

    } else if (action === 'fuel') {
        inspectionState.intake.fuel = inspectionState.intake.fuel === el.dataset.fuel ? '' : el.dataset.fuel;
        saveInspectionState();
        restoreInspectionIntake();

    } else if (action === 'complaint') {
        const list = inspectionState.intake.complaints;
        const value = el.dataset.complaint;
        inspectionState.intake.complaints = list.includes(value) ? list.filter(c => c !== value) : [...list, value];
        saveInspectionState();
        restoreInspectionIntake();

    } else if (action === 'remove-photo') {
        inspectionPhotos[el.dataset.item]?.splice(parseInt(el.dataset.index, 10), 1);
        renderInspectionThumbs(el.dataset.item);
        refreshInspectionSummary();

    } else if (action === 'addpart') {
        const part = mockInventory.find(p => p.id === el.dataset.part);
        if (addPartToPlan(part)) {
            document.querySelectorAll(`[data-insp="addpart"][data-part="${part.id}"]`).forEach(btn => {
                btn.classList.add('is-added');
                btn.innerHTML = '<i class="ph-bold ph-check"></i> Added to plan';
            });
        }

    } else if (action === 'add-all-parts') {
        const fixParts = [...new Set(inspectionItems.filter(i => getInspItem(i.id).status === 'fix').map(i => i.part).filter(Boolean))]
            .map(id => mockInventory.find(p => p.id === id))
            .filter(p => p && p.stock > 0);
        fixParts.forEach(part => addPartToPlan(part));
        flashInspectionButton(el, `<i class="ph-bold ph-check text-lg"></i> ${fixParts.length} added to plan`);

    } else if (action === 'to-findings') {
        const textarea = document.getElementById('final-findings');
        if (!textarea) return;
        const block = buildInspectionFindings();
        const existing = /— PHYSICAL INSPECTION —[\s\S]*?— END INSPECTION —/;
        textarea.value = existing.test(textarea.value)
            ? textarea.value.replace(existing, block)                      // refresh the earlier block instead of duplicating it
            : (textarea.value.trim() ? `${textarea.value.trim()}\n\n${block}` : block);
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.max(96, textarea.scrollHeight)}px`;
        flashInspectionButton(el, '<i class="ph-bold ph-check text-lg"></i> Added to findings');

    } else if (action === 'reset') {
        resetInspection();
    }
});

document.addEventListener('input', function(e) {
    const target = e.target;
    if (target.id === 'insp-odo') {
        inspectionState.intake.odo = target.value;
        saveInspectionState();
    } else if (target.dataset && target.dataset.inspInput === 'measure') {
        applyInspectionMeasure(target.dataset.item, target.value);
    } else if (target.dataset && target.dataset.inspInput === 'note') {
        getInspItem(target.dataset.item).note = target.value;
        saveInspectionState();
    }
});

document.addEventListener('change', function(e) {
    if (e.target.matches && e.target.matches('[data-insp-file]')) handleInspectionPhoto(e.target);
});
