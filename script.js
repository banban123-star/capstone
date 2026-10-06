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
    
    // Update plan totals when typing in Final Findings or Labor Cost
    if (e.target.id === 'final-findings' || e.target.id === 'labor-cost-input') {
        if (typeof updatePlanTotals === 'function') {
            updatePlanTotals();
        }
    }
});

document.addEventListener('click', function(e) {
    // 3. Select Item from Autocomplete
    const autocompleteItem = e.target.closest('.autocomplete-item');
    if (autocompleteItem) {
        const partId = autocompleteItem.getAttribute('data-id');
        const part = mockInventory.find(p => p.id === partId);
        
        if (part) {
            document.getElementById('part-search-input').value = '';
            document.getElementById('part-autocomplete-dropdown').classList.add('hidden');
            if (typeof openManualPartForm === 'function') {
                openManualPartForm(part);
            }
        }
    }

    // 4. Chip Controls (Minus, Plus, Remove)
    const btnMinus = e.target.closest('.btn-qty-minus');
    if (btnMinus) {
        const valSpan = btnMinus.nextElementSibling;
        let qty = parseInt(valSpan.textContent);
        if (qty > 1) {
            valSpan.textContent = qty - 1;
            if (typeof updatePlanTotals === 'function') updatePlanTotals();
        }
    }

    const btnPlus = e.target.closest('.btn-qty-plus');
    if (btnPlus) {
        const valSpan = btnPlus.previousElementSibling;
        let qty = parseInt(valSpan.textContent);
        let max = parseInt(btnPlus.getAttribute('data-max'));
        if (qty < max) {
            valSpan.textContent = qty + 1;
            if (typeof updatePlanTotals === 'function') updatePlanTotals();
        } else {
            alert(`Only ${max} units available in stock.`);
        }
    }

    const btnRemove = e.target.closest('.btn-remove-part');
    if (btnRemove) {
        btnRemove.closest('div[id^="selected-part-"]').remove();
        if (typeof updatePlanTotals === 'function') updatePlanTotals();
    }
    
    // 5. Hide Autocomplete Dropdown when clicking outside
    if (!e.target.closest('#part-autocomplete-dropdown') && !e.target.closest('#part-search-input')) {
        const dropdown = document.getElementById('part-autocomplete-dropdown');
        if (dropdown) dropdown.classList.add('hidden');
    }
});
let currentDiagStep = 1;

window.switchDiagStep = function(step, fromStepper = false) {
    if (fromStepper && step > currentDiagStep) return;

    const step1 = document.getElementById('step-1-diagnose');
    const step2 = document.getElementById('step-2-plan');
    const step3 = document.getElementById('step-3-register');
    if (!step1 || !step2 || !step3) return;

    const previousStep = currentDiagStep;
    currentDiagStep = step;

    if (step === 2 && previousStep === 1) {
        if (!planReviewed) {
            syncPlanFromDiagnosis(true);
        }
    }

    if (step === 3) {
        if (typeof renderStep3Summary === 'function') renderStep3Summary();
    }

    [step1, step2, step3].forEach((el, idx) => {
        if (idx + 1 === step) {
            el.classList.remove('hidden');
            el.classList.add('flex');
            el.classList.remove('animate-[fadeIn_0.2s_ease-out]');
            void el.offsetWidth; // trigger reflow
            el.classList.add('animate-[fadeIn_0.2s_ease-out]');
        } else {
            el.classList.add('hidden');
            el.classList.remove('flex');
        }
    });

    document.getElementById('main-content-area').scrollTo({ top: 0, behavior: 'smooth' });
    updateDiagStepper();
};
function updateSectionNumbering() {
    let count = 1;
    const setupTitle = document.getElementById('title-inspection-setup');
    if (setupTitle) setupTitle.textContent = `${count++}. Inspection Setup`;

    const ecuCard = document.getElementById('ecu-scan-card');
    const ecuTitle = document.getElementById('title-ecu-scan');
    if (ecuCard && !ecuCard.classList.contains('hidden') && ecuTitle) {
        ecuTitle.textContent = `${count++}. ECU / OBD Diagnostic`;
    }

    const physCard = document.getElementById('physical-inspection-card');
    const physTitle = document.getElementById('title-physical-inspection');
    if (physCard && !physCard.classList.contains('hidden') && physTitle) {
        physTitle.textContent = `${count++}. Physical Inspection Log`;
    }

    const intakeTitle = document.getElementById('title-vehicle-intake');
    if (intakeTitle) {
        intakeTitle.textContent = `${count++}. Vehicle Intake`;
    }
}

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
        
        updateSectionNumbering();
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
            updateSectionNumbering();
            renderInspection();
            planReviewed = false;
            currentDiagStep = 1;
            updatePlanTotals();
        }

        // Initialize Inventory view
        if (viewName === 'inventory') {
            if (window.expandedInvCards) window.expandedInvCards.clear();
            renderInventory();
        }

        if (viewName === 'users') { renderUsers(); }
        if (viewName === 'backup') { renderBackupHistory(); }
        if (viewName === 'repairs') { 
            if (window.expandedRepairCards) window.expandedRepairCards.clear();
            renderRepairs(); 
        }
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
    
};

let currentRole = 'owner';

const ROLE_PERMISSIONS = {
    sys: {
        'inventory.view': true,
        'inventory.search': true,
        'inventory.restock': true,
        'inventory.addPart': true,
        'inventory.editPart': true,
        'inventory.walkInSale': true
    },
    owner: {
        'inventory.view': true,
        'inventory.search': true,
        'inventory.restock': true,
        'inventory.addPart': true,
        'inventory.editPart': true,
        'inventory.walkInSale': true
    },
    chief: {
        'inventory.view': true,
        'inventory.search': true,
        'inventory.restock': false,
        'inventory.addPart': false,
        'inventory.editPart': false,
        'inventory.walkInSale': false
    },
    sub: {
        'inventory.view': true,
        'inventory.search': true,
        'inventory.restock': false,
        'inventory.addPart': false,
        'inventory.editPart': false,
        'inventory.walkInSale': false
    }
};

window.can = function(role, permission) {
    if (!permission) {
        permission = role;
        role = currentRole;
    }
    return !!(ROLE_PERMISSIONS[role] && ROLE_PERMISSIONS[role][permission]);
};

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
    } else if (wasMobile || isMobile || currentActiveTarget === 'inventory') {
        // Entering/leaving mobile mode, or viewing inventory: re-render the current screen
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

let planReviewed = false;
let repairPlanParts = [];      // true once the mechanic finalized the parts list

function escHTML(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// Adds a part chip to the Repair Plan (shared by the search dropdown, the inspection suggestions and the review modal)

// --- Manual Part Form Logic ---
window.openManualPartForm = function(part) {
    const form = document.getElementById('manual-part-add-form');
    if (!form) return;
    
    document.getElementById('manual-part-id').value = part.id;
    document.getElementById('manual-part-name').textContent = part.name;
    document.getElementById('manual-part-qty').value = 1;
    document.getElementById('manual-part-qty').max = part.stock;
    
    const select = document.getElementById('manual-part-target');
    select.innerHTML = '';
    
    // Populate options from flagged items
    if (inspectionState.flaggedItems && inspectionState.flaggedItems.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = "Diagnosis Items";
        inspectionState.flaggedItems.forEach(item => {
            const opt = document.createElement('option');
            opt.value = `${item.name}|${item.category}`;
            opt.textContent = `${item.name} (${item.category})`;
            optgroup.appendChild(opt);
        });
        select.appendChild(optgroup);
    }
    
    const optgroup2 = document.createElement('optgroup');
    optgroup2.label = "Other";
    optgroup2.innerHTML = `
        <option value="General / Shop supplies|Other / General">General / Shop supplies</option>
        <option value="other|Other / General">Other repair...</option>
    `;
    select.appendChild(optgroup2);
    
    toggleManualPartOther();
    form.classList.remove('hidden');
};

window.cancelManualPart = function() {
    const form = document.getElementById('manual-part-add-form');
    if (form) form.classList.add('hidden');
};

window.toggleManualPartOther = function() {
    const select = document.getElementById('manual-part-target');
    const otherWrapper = document.getElementById('manual-part-other-wrapper');
    if (select.value.startsWith('other|')) {
        otherWrapper.classList.remove('hidden');
    } else {
        otherWrapper.classList.add('hidden');
    }
};

window.confirmManualPart = function() {
    const partId = document.getElementById('manual-part-id').value;
    const part = mockInventory.find(p => p.id === partId);
    if (!part) return;
    
    let qty = parseInt(document.getElementById('manual-part-qty').value);
    if (isNaN(qty) || qty < 1) qty = 1;

    
    const selectValue = document.getElementById('manual-part-target').value;
    let target = '';
    let category = '';
    
    if (selectValue.startsWith('other|')) {
        target = document.getElementById('manual-part-other-input').value.trim() || 'Other Repair';
        category = 'Other / General';
    } else {
        const parts = selectValue.split('|');
        target = parts[0];
        category = parts[1] || 'Other / General';
    }
    
    addPartToPlan(part, { qty: qty, target: target, category: category });
    cancelManualPart();
};

window.changePartTarget = function(selectElement) {
    const row = selectElement.closest('[id^="selected-part-"]');
    if (!row) return;
    const partId = row.dataset.id;
    const oldTarget = row.dataset.target;
    const newVal = selectElement.value;
    let newTarget, newCategory;
    
    if (newVal === 'other') {
        const custom = prompt("Enter description for other repair:");
        if (custom && custom.trim()) {
            newTarget = custom.trim();
            newCategory = 'Other / General';
        } else {
            // Revert selection
            selectElement.value = oldTarget;
            return;
        }
    } else {
        const parts = newVal.split('|');
        newTarget = parts[0];
        newCategory = parts[1] || 'Other / General';
    }
    
    // Find the exact item. Note: if there are multiple parts with same ID but different targets, we need to match by ID AND target
    const idx = repairPlanParts.findIndex(p => p.id === partId && p.target === oldTarget);
    if (idx !== -1) {
        const item = repairPlanParts[idx];
        item.target = newTarget;
        item.category = newCategory;
        
        // Merge if identical part ID and new target already exists
        const existingIdx = repairPlanParts.findIndex((p, i) => i !== idx && p.id === partId && p.target === newTarget);
        if (existingIdx !== -1) {
            repairPlanParts[existingIdx].qty += item.qty;
            repairPlanParts.splice(idx, 1);
        }
        
        renderRepairPlan();
        updatePlanTotals();
    }
};

window.getDropdownOptionsHTML = function(currentValue) {
    let options = [];
    if (inspectionState.flaggedItems) {
        options = inspectionState.flaggedItems.map(item => `<option value="${escHTML(item.name)}|${escHTML(item.category)}" ${currentValue === item.name ? 'selected' : ''}>${escHTML(item.name)}</option>`);
    }
    
    const genValue = "General / Shop supplies|Other / General";
    const genSelected = currentValue === "General / Shop supplies" ? 'selected' : '';
    const otherSelected = (!inspectionState.flaggedItems || !inspectionState.flaggedItems.some(i => i.name === currentValue)) && currentValue !== "General / Shop supplies" ? 'selected' : '';
    
    return `
        <optgroup label="Diagnosis Items">
            ${options.join('')}
        </optgroup>
        <optgroup label="Other">
            <option value="General / Shop supplies|Other / General" ${genSelected}>General / Shop supplies</option>
            ${otherSelected ? `<option value="${escHTML(currentValue)}|Other / General" selected>${escHTML(currentValue)}</option>` : ''}
            <option value="other">Other repair...</option>
        </optgroup>
    `;
};

function addPartToPlan(part, opts = {}) {
    if (!part) return false;
    
    const qty = Math.max(1, Math.min(opts.qty || 1, part.stock));
    const target = opts.target || 'Other / General';
    const category = opts.category || 'Manual Addition';
    const isAuto = opts.sources && (opts.sources.includes('ecu') || opts.sources.includes('physical')) ? true : false;
    
    // Find existing part with EXACT SAME TARGET to increase quantity
    const existing = repairPlanParts.find(p => p.id === part.id && p.target === target);
    if (existing) {
        existing.qty = Math.min(existing.qty + qty, part.stock > 0 ? part.stock : existing.qty + qty);
    } else {
        repairPlanParts.push({
            id: part.id,
            part: part,
            qty: qty,
            target: target,
            category: category,
            isAuto: opts.target === undefined ? false : isAuto, // if opts.target is passed manually, isAuto is false
            stock: part.stock
        });
    }
    
    renderRepairPlan();
    updatePlanTotals();
    return true;
}

// Recalculates line totals, parts total, estimated total, empty state, badge and stepper

function renderRepairPlan() {
    const container = document.getElementById('selected-parts-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (repairPlanParts.length === 0) {
        document.getElementById('plan-empty')?.classList.remove('hidden');
        return;
    }
    
    document.getElementById('plan-empty')?.classList.add('hidden');
    
    // Group by target
    const groups = {};
    repairPlanParts.forEach(p => {
        if (!groups[p.target]) groups[p.target] = { category: p.category, items: [] };
        groups[p.target].items.push(p);
    });
    
    for (const [target, group] of Object.entries(groups)) {
        const groupHeader = document.createElement('div');
        groupHeader.className = 'col-span-full mt-4 first:mt-0 mb-2 border-b border-slate-200 pb-1';
        groupHeader.innerHTML = `<h4 class="text-xs font-bold text-slate-700 uppercase">${escHTML(target)} <span class="text-[10px] font-normal text-slate-400 ml-1">(${escHTML(group.category)})</span></h4>`;
        container.appendChild(groupHeader);
        
        group.items.forEach(p => {
            let stockStatus = 'in_stock';
            let stockBadge = '<span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border-emerald-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider"><i class="ph-bold ph-check"></i> In stock</span>';
            let outOfStock = false;
            
            if (p.stock === 0) {
                stockStatus = 'out_of_stock';
                outOfStock = true;
                stockBadge = '<span class="inline-flex items-center gap-1 bg-red-50 text-red-600 border-red-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider"><i class="ph-bold ph-warning"></i> Out of stock</span>';
            } else if (p.stock < p.qty) {
                stockStatus = 'low_stock';
                outOfStock = true;
                stockBadge = '<span class="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border-amber-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider"><i class="ph-bold ph-warning-circle"></i> Low stock</span>';
            }

            if (!p.handling) p.handling = 'order';
            
            const rowWrapper = document.createElement('div');
            rowWrapper.className = 'flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm mb-2 col-span-full overflow-hidden';
            
            const row = document.createElement('div');
            row.id = `selected-part-${p.id}`;
            row.dataset.id = p.id;
            row.dataset.price = p.part.price;
            row.dataset.target = p.target;
            row.dataset.category = p.category;
            row.dataset.isAuto = p.isAuto;
            row.className = 'flex items-center justify-between gap-2 p-2.5';
            
            row.innerHTML = `
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5">
                        <div class="text-sm font-bold ${stockStatus === 'out_of_stock' ? 'text-red-500' : (stockStatus === 'low_stock' ? 'text-amber-600' : 'text-slate-800')} truncate">${escHTML(p.part.name)}</div>
                        ${p.isAuto ? `<span class="inline-flex items-center gap-1 bg-purple-50 text-purple-600 border-purple-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider">Auto-assigned</span>` : `<span class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border-blue-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider">Added by mechanic</span>`}
                        ${stockBadge}
                    </div>
                    <div class="text-xs text-slate-500">
                        SKU: ${escHTML(p.part.sku)} · ₱${p.part.price.toFixed(2)} / unit · <span class="line-total font-bold text-slate-700">₱ ${(p.part.price * p.qty).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        For: 
                        <select class="bg-transparent border border-slate-200 rounded px-1 py-0.5 outline-none hover:border-blue-300 focus:border-blue-500" onchange="changePartTarget(this)">
                            ${getDropdownOptionsHTML(p.target)}
                        </select>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <div class="flex items-center bg-slate-50 rounded-md border border-slate-200">
                        <button class="px-2.5 py-1 text-slate-400 hover:text-blue-600 transition-colors" onclick="updatePlanQty(-1, this)"><i class="ph-bold ph-minus"></i></button>
                        <span class="w-6 text-center text-xs font-bold text-slate-700 qty-val">${p.qty}</span>
                        <button class="px-2.5 py-1 text-slate-400 hover:text-blue-600 transition-colors" onclick="updatePlanQty(1, this)"><i class="ph-bold ph-plus"></i></button>
                    </div>
                    <button class="text-slate-400 hover:bg-red-50 hover:text-red-500 rounded p-1.5 transition-colors" title="Remove part" onclick="removePlanPart(this)"><i class="ph-bold ph-x"></i></button>
                </div>
            `;
            
            rowWrapper.appendChild(row);
            
            if (outOfStock) {
                const handlingDiv = document.createElement('div');
                handlingDiv.className = 'bg-slate-50 p-2.5 border-t border-slate-200 flex flex-col gap-2';
                handlingDiv.innerHTML = `
                    <div class="flex flex-wrap items-center gap-2">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Handling:</label>
                        <select class="text-xs border border-slate-300 rounded p-1 flex-1 outline-none focus:border-amber-500" onchange="handlePartWaitAction(this)">
                            <option value="order" ${p.handling === 'order' ? 'selected' : ''}>Order / wait for part</option>
                            <option value="replace" ${p.handling === 'replace' ? 'selected' : ''}>Replace with another part</option>
                            <option value="customer" ${p.handling === 'customer' ? 'selected' : ''}>Customer will bring own part</option>
                            <option value="remove" ${p.handling === 'remove' ? 'selected' : ''}>Remove from plan</option>
                        </select>
                    </div>
                    ${p.handling === 'order' ? `
                    <div class="flex flex-wrap items-center gap-2">
                        <input type="date" class="text-xs border border-slate-300 rounded p-1 outline-none focus:border-amber-500" value="${p.expectedArrival || ''}" onchange="updatePartHandlingData(this, 'arrival')" title="Expected Arrival">
                        <input type="text" class="text-xs border border-slate-300 rounded p-1 flex-1 outline-none focus:border-amber-500" placeholder="Short note..." value="${p.note || ''}" onchange="updatePartHandlingData(this, 'note')">
                    </div>
                    ` : ''}
                `;
                rowWrapper.appendChild(handlingDiv);
            }
            
            container.appendChild(rowWrapper);
        });
    }
}

window.handlePartWaitAction = function(selectEl) {
    const row = selectEl.closest('.flex-col').querySelector('[id^="selected-part-"]');
    if (!row) return;
    const id = row.dataset.id;
    const target = row.dataset.target;
    const item = repairPlanParts.find(p => p.id === id && p.target === target);
    if (!item) return;
    
    item.handling = selectEl.value;
    
    if (item.handling === 'replace') {
        document.getElementById('part-search-input')?.focus();
        item.handling = 'order'; 
    } else if (item.handling === 'remove') {
        const idx = repairPlanParts.findIndex(p => p.id === id && p.target === target);
        if (idx !== -1) {
            repairPlanParts.splice(idx, 1);
        }
    }
    
    renderRepairPlan();
    updatePlanTotals();
};

window.updatePartHandlingData = function(inputEl, type) {
    const row = inputEl.closest('.flex-col').querySelector('[id^="selected-part-"]');
    if (!row) return;
    const id = row.dataset.id;
    const target = row.dataset.target;
    const item = repairPlanParts.find(p => p.id === id && p.target === target);
    if (!item) return;
    
    if (type === 'arrival') item.expectedArrival = inputEl.value;
    if (type === 'note') item.note = inputEl.value;
};


window.updatePlanQty = function(delta, btnElement) {
    const row = btnElement.closest('[id^="selected-part-"]');
    if (!row) return;
    const id = row.dataset.id;
    const target = row.dataset.target;
    
    const item = repairPlanParts.find(p => p.id === id && p.target === target);
    if (item) {

        if (item.qty + delta > 0) {
            item.qty += delta;
            renderRepairPlan();
            updatePlanTotals();
        }
    }
}

window.removePlanPart = function(btnElement) {
    const row = btnElement.closest('[id^="selected-part-"]');
    if (!row) return;
    const id = row.dataset.id;
    const target = row.dataset.target;
    
    const idx = repairPlanParts.findIndex(p => p.id === id && p.target === target);
    if (idx !== -1) {
        repairPlanParts.splice(idx, 1);
        renderRepairPlan();
        updatePlanTotals();
    }
}

function updatePlanTotals() {
    let total = 0, count = 0;
    let pendingCount = 0;
    
    repairPlanParts.forEach(p => {
        total += p.part.price * p.qty;
        count++;
        if ((p.stock === 0 || p.stock < p.qty) && p.handling === 'order') {
            pendingCount++;
        }
    });
    
    const labor = parseFloat(document.getElementById('labor-cost-input')?.value) || 0;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('plan-parts-count', count);
    set('plan-parts-total', fmtPeso(total));
    set('plan-grand-total', fmtPeso(total + labor));
    
    const banner = document.getElementById('pending-parts-banner');
    if (banner) {
        if (pendingCount > 0) {
            banner.classList.remove('hidden');
            document.getElementById('pending-parts-count').textContent = pendingCount;
        } else {
            banner.classList.add('hidden');
        }
    }
    
    inspectionState.hasPendingParts = pendingCount > 0;
    
    const badge = document.getElementById('plan-state-badge');
    if (badge) {
        const done = planReviewed && count > 0;
        badge.textContent = done ? (pendingCount > 0 ? 'Waiting for parts' : 'Parts finalized') : (count ? 'Needs review' : 'Draft');
        badge.className = 'text-[10px] font-bold px-2 py-1 rounded-full border ' + (done
            ? (pendingCount > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200')
            : count ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200');
    }

    const btnNext2 = document.getElementById('btn-next-step2');
    if (btnNext2) {
        const findings = document.getElementById('final-findings')?.value.trim() || '';
        btnNext2.disabled = findings.length === 0;
        
        if (pendingCount > 0) {
            btnNext2.innerHTML = `Next: Register &amp; Mark as Waiting <i class="ph-bold ph-arrow-right text-lg"></i>`;
            btnNext2.className = btnNext2.className.replace('bg-blue-600', 'bg-amber-600').replace('hover:bg-blue-700', 'hover:bg-amber-700');
        } else {
            btnNext2.innerHTML = `Next: Register &amp; Confirm <i class="ph-bold ph-arrow-right text-lg"></i>`;
            btnNext2.className = btnNext2.className.replace('bg-amber-600', 'bg-blue-600').replace('hover:bg-amber-700', 'hover:bg-blue-700');
        }
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
    
    steps.forEach((el, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentDiagStep;
        const isActive = stepNum === currentDiagStep;
        
        el.classList.toggle('is-done', isDone);
        el.classList.toggle('is-active', isActive);
        
        const dot = el.querySelector('.diag-step-dot');
        if (dot) dot.innerHTML = isDone ? '<i class="ph-bold ph-check"></i>' : stepNum;
        
        if (isDone) {
            el.classList.add('cursor-pointer', 'hover:text-blue-600');
            el.classList.remove('opacity-50', 'cursor-not-allowed');
            el.setAttribute('onclick', `switchDiagStep(${stepNum}, true)`);
        } else if (isActive) {
            el.classList.remove('cursor-pointer', 'hover:text-blue-600', 'opacity-50', 'cursor-not-allowed');
            el.removeAttribute('onclick');
        } else {
            el.classList.add('opacity-50', 'cursor-not-allowed');
            el.classList.remove('cursor-pointer', 'hover:text-blue-600');
            el.removeAttribute('onclick');
        }
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
function getSuggestedParts(diagnosis = inspectionState) {
    const list = [];

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
            }
        });

        // 3. Odometer service intervals + customer complaints (optional suggestions)
        const { odo, complaints } = inspectionState.intake;
        partsForServiceAndComplaints(odo, complaints).forEach(p => add(p.id, 'physical', p.why, 'watch', p.qty));
    }
    return list;
}

function syncPlanFromDiagnosis(firstTime = false) {
    if (firstTime && repairPlanParts.length > 0) return; // Only auto-assign once if first time
    
    const complaintsContainer = document.getElementById('step2-complaints-container');
    if (complaintsContainer) {
        if (inspectionState.intake.complaints && inspectionState.intake.complaints.length > 0) {
            complaintsContainer.innerHTML = inspectionState.intake.complaints.map(c => 
                `<span class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200"><i class="ph-fill ph-warning-circle text-amber-500"></i> ${escHTML(c)}</span>`
            ).join('');
            complaintsContainer.parentElement.classList.remove('hidden');
        } else {
            complaintsContainer.parentElement.classList.add('hidden');
        }
    }

    const suggestions = getSuggestedParts();
    
    suggestions.forEach(r => {
        if (r.level === 'fix' || r.level === 'ecu' || r.level === 'watch') {
            const part = mockInventory.find(p => p.id === r.id);
            if (part && r.checked) {
                // Find target
                let target = 'Other / General';
                let category = 'Other / General';
                let isAuto = true;
                
                // Match with flagged items
                if (inspectionState.flaggedItems) {
                    const flaggedMatch = inspectionState.flaggedItems.find(f => f.suggestedPart && f.suggestedPart.id === r.id);
                    if (flaggedMatch) {
                        target = flaggedMatch.name;
                        category = flaggedMatch.category;
                    }
                }
                
                if (target === 'Other / General' && r.level === 'ecu') {
                    target = 'ECU Code';
                    category = 'Diagnostics';
                }
                
                const existing = repairPlanParts.find(p => p.id === r.id);
                if (!existing) {
                    repairPlanParts.push({
                        id: part.id,
                        part: part,
                        qty: r.qty,
                        target: target,
                        category: category,
                        isAuto: true,
                        stock: part.stock
                    });
                } else if (existing.isAuto) {
                    existing.qty = Math.max(existing.qty, r.qty);
                }
            }
        }
    });
    
    planReviewed = true;
    renderRepairPlan();
    updatePlanTotals();
}

function holdRepairPlan() {
    alert("Repair plan saved as draft. Returning to dashboard...");
    document.querySelector('.nav-link[data-target="dashboard"]')?.click();
}

function renderStep3Summary() {
    const summaryBox = document.getElementById('step3-plan-summary');
    if (!summaryBox) return;

    const findings = (document.getElementById('final-findings')?.value || 'No final findings recorded.').trim();
    const labor = parseFloat(document.getElementById('labor-cost-input')?.value) || 0;
    let partsTotal = 0;
    
    const rows = repairPlanParts.map(p => {
        partsTotal += p.part.price * p.qty;
        
        let badgeHtml = '';
        if ((p.stock === 0 || p.stock < p.qty) && p.handling === 'order') {
            badgeHtml = `<span class="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 px-1 py-0.5 rounded text-[8px] font-bold uppercase mt-1 w-max">Waiting for parts</span>`;
            if (p.expectedArrival) {
                badgeHtml += `<span class="text-[9px] text-amber-600 ml-1.5 font-medium">ETA: ${escHTML(p.expectedArrival)}</span>`;
            }
        }
        
        return `<li class="flex justify-between gap-2 border-b border-slate-50 pb-1.5 pt-1.5 first:pt-0 last:border-0 last:pb-0">
            <div class="flex flex-col min-w-0">
                <span class="truncate text-slate-600">${p.qty} × ${escHTML(p.part.name)}</span>
                ${badgeHtml ? `<div class="flex items-center">${badgeHtml}</div>` : ''}
            </div>
            <span class="font-semibold shrink-0 text-slate-800 mt-0.5">${fmtPeso(p.part.price * p.qty)}</span>
        </li>`;
    });

    summaryBox.innerHTML = `
        <div class="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <h3 class="text-[11px] font-bold text-slate-500 uppercase mb-1">Final Findings</h3>
            <p class="text-xs text-slate-700 italic">${escHTML(findings)}</p>
        </div>
        <div class="mb-3">
            <h3 class="text-[11px] font-bold text-slate-500 uppercase mb-2">Required Parts & Materials</h3>
            ${repairPlanParts.length ? `<ul class="flex flex-col gap-1 text-xs">${rows.join('')}</ul>` : '<p class="text-xs text-slate-500">No parts assigned.</p>'}
        </div>
        <div class="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex flex-col gap-1.5">
            <div class="flex justify-between text-xs font-semibold text-slate-600"><span>Parts Total</span><span>${fmtPeso(partsTotal)}</span></div>
            <div class="flex justify-between text-xs font-semibold text-slate-600"><span>Estimated Labor</span><span>${fmtPeso(labor)}</span></div>
            <div class="border-t border-blue-200/60 pt-1.5 mt-1 flex justify-between text-sm font-extrabold text-blue-800"><span>Estimated Total</span><span>${fmtPeso(partsTotal + labor)}</span></div>
        </div>
    `;
    
    validateStep3();
}
function toggleStep3RegistrationMode(checkbox) {
    const existingSec = document.getElementById('step3-existing-vehicle-section');
    const newSec = document.getElementById('step3-new-vehicle-section');
    if (checkbox.checked) {
        existingSec.classList.add('hidden');
        newSec.classList.remove('hidden');
        newSec.classList.add('flex');
    } else {
        existingSec.classList.remove('hidden');
        newSec.classList.add('hidden');
        newSec.classList.remove('flex');
    }
    validateStep3();
}

function validateStep3() {
    const btn = document.getElementById('btn-confirm-push');
    if (!btn) return;

    const isNew = document.getElementById('step3-toggle-new-reg')?.checked;
    let isValid = false;

    if (isNew) {
        const name = document.getElementById('step3-new-cust-name')?.value.trim();
        const phone = document.getElementById('step3-new-cust-phone')?.value.trim();
        const model = document.getElementById('step3-new-veh-model')?.value.trim();
        const plate = document.getElementById('step3-new-veh-plate')?.value.trim();
        isValid = !!(name && phone && model && plate);
    } else {
        const sel = document.getElementById('step3-motorcycle-select');
        isValid = !!(sel && sel.value !== "");
    }

    btn.disabled = !isValid;
}

document.addEventListener('input', function(e) {
    if (e.target.id && (e.target.id.startsWith('step3-new-') || e.target.id === 'step3-motorcycle-select')) {
        validateStep3();
    }
});

document.addEventListener('change', function(e) {
    if (e.target.id === 'step3-motorcycle-select') {
        validateStep3();
    }
});

function confirmStep3Push() {
    const btn = document.getElementById('btn-confirm-push');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Pushing...`;
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        
        // Hide form, show success state
        document.getElementById('step3-vehicle-card')?.classList.add('hidden');
        const actions = document.getElementById('step3-actions');
        if(actions) {
            actions.classList.add('hidden');
            actions.classList.remove('flex');
        }
        
        const labor = parseFloat(document.getElementById('labor-cost-input')?.value) || 0;
        let partsTotal = 0;
        repairPlanParts.forEach(p => partsTotal += p.part.price * p.qty);
        const total = fmtPeso(partsTotal + labor);
        
        const isNew = document.getElementById('step3-toggle-new-reg')?.checked;
        const vehInput = document.getElementById('step3-motorcycle-select');
        const vehName = isNew ? document.getElementById('step3-new-veh-model').value : (vehInput ? vehInput.value.split(' - ')[1] || 'Walk-in' : 'Walk-in');

        const isWaiting = inspectionState.hasPendingParts;
        const jobId = `JOB #${Math.floor(1000 + Math.random() * 9000)}`;
        const statusName = isWaiting ? 'Waiting for Parts' : 'In Progress';
        
        const successDetails = document.getElementById('step3-success-details');
        if (successDetails) {
            successDetails.textContent = `${jobId} is now ${statusName} • ${vehName} • Total: ${total}`;
        }
        
        // --- ADD TO ACTIVE REPAIRS ---
        const newJob = {
            id: jobId,
            plate: isNew ? document.getElementById('step3-new-veh-plate').value.toUpperCase() : (vehInput ? vehInput.value.split(' (')[1]?.replace(')', '') || 'N/A' : 'N/A'),
            model: vehName,
            customer: isNew ? document.getElementById('step3-new-cust-name').value : (vehInput ? vehInput.value.split(' - ')[0] || 'Walk-in' : 'Walk-in'),
            mechanicOptions: ['Mike (Chief Mechanic)', 'Leo (Sub-Mechanic)'],
            selectedMechIndex: 0,
            diagnosis: (document.getElementById('final-findings')?.value || 'No diagnosis recorded').trim(),
            statusId: isWaiting ? 'waiting' : 'progress',
            statusName: statusName,
            statusClass: isWaiting ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-blue-50 text-blue-600 border-blue-200',
            dotClass: isWaiting ? 'bg-orange-500' : 'bg-blue-500 animate-pulse',
            btnText: 'Manage Repair <i class="ph-bold ph-caret-right"></i>',
            btnClass: 'bg-slate-800 hover:bg-slate-900 text-white',
            btnAction: 'openRepairModal()',
            
            // Step 3 rules: store full parts list with availability, target, source, labor, total
            repairPlan: {
                parts: JSON.parse(JSON.stringify(repairPlanParts)), // Deep copy to store it snapshot style
                laborCost: labor,
                estimatedTotal: partsTotal + labor
            }
        };
        
        if (typeof mockRepairsData !== 'undefined') {
            mockRepairsData.unshift(newJob); // Add to the top of the list
            if (typeof renderRepairs === 'function') {
                renderRepairs(); // Refresh the Active Repairs list in the background
            }
        }

        const successState = document.getElementById('step3-success-state');
        if (successState) {
            successState.classList.remove('hidden');
            successState.classList.add('flex');
            successState.classList.add('animate-[fadeIn_0.5s_ease-out]');
        }

        clearInspectionDraft();
        planReviewed = false;
        
    }, 800);
}
function resetDiagnosticsWorkflow() {
    // Clear step 3 form
    const sel = document.getElementById('step3-motorcycle-select');
    if(sel) sel.value = "";
    
    const ids = ['step3-new-cust-name', 'step3-new-cust-phone', 'step3-new-veh-model', 'step3-new-veh-plate', 'step3-new-veh-year'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = '';
    });
    
    const tog = document.getElementById('step3-toggle-new-reg');
    if(tog) { tog.checked = false; toggleStep3RegistrationMode(tog); }

    // Restore UI for next time
    document.getElementById('step3-vehicle-card')?.classList.remove('hidden');
    const actions = document.getElementById('step3-actions');
    if(actions) {
        actions.classList.remove('hidden');
        actions.classList.add('flex');
    }
    
    const successState = document.getElementById('step3-success-state');
    if(successState) {
        successState.classList.add('hidden');
        successState.classList.remove('flex');
    }

    // Reset step 2
    const planBox = document.getElementById('selected-parts-container');
    if (planBox) planBox.innerHTML = '';
    repairPlanParts = [];
    const laborInput = document.getElementById('labor-cost-input');
    if (laborInput) laborInput.value = '';
    const findings = document.getElementById('final-findings');
    if (findings) findings.value = '';
    
    // Ensure Continue is reset
    const btnNext2 = document.getElementById('btn-next-step2');
    if (btnNext2) btnNext2.disabled = true;

    if (typeof updatePlanTotals === 'function') updatePlanTotals();

    switchDiagStep(1);
}
function openRepairModal() { toggleModal('repair-modal', 'repair-modal-backdrop', 'repair-modal-content', true); }
function closeRepairModal() { toggleModal('repair-modal', 'repair-modal-backdrop', 'repair-modal-content', false); }
function completeJob(event) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeRepairModal();
    }, 800);
}

function openAddPartModal() { 
    if (!window.can('inventory.addPart')) { closeAddPartModal(); showToast("You don't have permission to do this."); return; }
    toggleModal('modal-add-part', 'add-part-backdrop', 'add-part-content', true); 
}
function closeAddPartModal() { toggleModal('modal-add-part', 'add-part-backdrop', 'add-part-content', false); }

function openRestockModal() { 
    if (!window.can('inventory.restock')) { closeRestockModal(); showToast("You don't have permission to do this."); return; }
    toggleModal('modal-restock', 'restock-backdrop', 'restock-content', true); 
}
function closeRestockModal() { toggleModal('modal-restock', 'restock-backdrop', 'restock-content', false); }

function openEditPartModal() {
    if (!window.can('inventory.editPart')) { showToast("You don't have permission to do this."); return; }
    // Assuming edit modal would be toggled here if it existed
}

function openWalkInModalInv(itemName, itemPrice) {
    if (!window.can('inventory.walkInSale')) { closeWalkInModalInv(); showToast("You don't have permission to do this."); return; }
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
    if (!window.can('inventory.walkInSale')) { closeWalkInCheckout(); showToast("You don't have permission to do this."); return; }
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

    const isMobile = document.body.classList.contains('mobile-app');
    
    // Check Permissions
    const canRestock = window.can('inventory.restock');
    const canAdd = window.can('inventory.addPart');
    const canEdit = window.can('inventory.editPart');
    const canWalkIn = window.can('inventory.walkInSale');
    const showActions = canEdit || canWalkIn;

    // Apply Permissions to top bar
    const btnWrap = document.getElementById('inv-btn-wrap');
    if (btnWrap) {
        let html = '';
        if (canRestock) {
            html += `<button onclick="openRestockModal()" class="flex-1 lg:flex-none bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                <i class="ph-bold ph-arrows-clockwise"></i> Restock Items
            </button>`;
        }
        if (canAdd) {
            html += `<button onclick="openAddPartModal()" class="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                <i class="ph-bold ph-plus"></i> Add New Part
            </button>`;
        }
        btnWrap.innerHTML = html;
        btnWrap.classList.toggle('hidden', html === '');
    }

    // Adjust table classes on mobile and action header
    const thead = document.querySelector('#view-inventory thead');
    const table = document.querySelector('#view-inventory table');
    if (thead) {
        if (isMobile) {
            thead.classList.add('hidden');
            table?.classList.remove('min-w-[900px]');
        } else {
            thead.classList.remove('hidden');
            table?.classList.add('min-w-[900px]');
        }
        
        const tr = thead.querySelector('tr');
        if (tr) {
            const ths = tr.querySelectorAll('th');
            if (ths.length >= 5) {
                ths[4].style.display = showActions ? '' : 'none';
            }
        }
    }

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

    // Update result count
    const countEl = document.getElementById('inv-results-count');
    if (countEl) {
        if (isMobile) {
            countEl.textContent = `${filtered.length} part${filtered.length === 1 ? '' : 's'}`;
        } else {
            countEl.textContent = '';
        }
    }

    // Render HTML
    if (filtered.length === 0) {
        if (isMobile) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-8 border-0 text-center text-slate-500 font-medium"><div class="flex flex-col items-center gap-2"><i class="ph-bold ph-magnifying-glass text-3xl text-slate-300"></i> No parts found.</div></td></tr>`;
        } else {
            tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-500 font-medium">No items found matching your criteria.</td></tr>`;
        }
        return;
    }

    tbody.innerHTML = filtered.map(item => {
        if (isMobile) {
            // MOBILE CARD LAYOUT
            let stockBadgeMobile = '';
            let rowOpacity = item.stock === 0 ? 'opacity-75' : '';

            if (item.stock === 0) {
                stockBadgeMobile = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">0 Available</span>`;
            } else if (item.stock <= 5) {
                stockBadgeMobile = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700">${item.stock} Available</span>`;
            } else {
                stockBadgeMobile = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">${item.stock} Available</span>`;
            }

            if (!window.expandedInvCards) window.expandedInvCards = new Set();
            const isOpen = window.expandedInvCards.has(item.id);

            return `
                <tr class="block w-full">
                    <td colspan="5" class="block w-full p-0 border-0">
                        <div class="bg-white border-b border-slate-100 flex flex-col p-3.5 ${rowOpacity}">
                            <div class="flex items-center justify-between gap-3 min-h-[50px] cursor-pointer" onclick="toggleInvCard('${item.id}')">
                                <div class="w-12 h-12 rounded-lg shrink-0 overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                                    <img src="${item.img}" class="w-full h-full object-cover">
                                </div>
                                <div class="flex-1 min-w-0 flex flex-col justify-center">
                                    <div class="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">${item.name}</div>
                                    <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <span class="font-bold text-slate-700 text-xs">₱${item.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                        ${stockBadgeMobile}
                                    </div>
                                </div>
                                <div id="inv-chevron-${item.id}" class="w-11 h-11 rounded-full text-slate-400 flex items-center justify-center shrink-0 transition-transform duration-200" style="transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}">
                                    <i class="ph-bold ph-caret-down text-lg"></i>
                                </div>
                            </div>
                            <div id="inv-wrap-${item.id}" style="display: grid; transition: grid-template-rows 200ms ease-out; grid-template-rows: ${isOpen ? '1fr' : '0fr'};">
                                <div style="overflow: hidden;">
                                    <div class="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2 text-sm">
                                        <div class="grid grid-cols-2 gap-y-2 gap-x-4">
                                            <div class="text-slate-500 text-xs">SKU</div>
                                            <div class="font-semibold text-slate-800 text-xs text-right truncate">${item.sku}</div>
                                            
                                            <div class="text-slate-500 text-xs">Compatibility</div>
                                            <div class="font-semibold text-slate-800 text-xs text-right truncate">${item.comp}</div>
                                            
                                            <div class="text-slate-500 text-xs">Category</div>
                                            <div class="font-semibold text-slate-800 text-xs text-right truncate">${item.category}</div>
                                            
                                            <div class="text-slate-500 text-xs">Location</div>
                                            <div class="font-semibold text-slate-800 text-xs text-right truncate">${item.loc}</div>
                                            
                                            <div class="text-slate-500 text-xs">Reserved</div>
                                            <div class="font-semibold text-slate-800 text-xs text-right truncate">${item.reserved}</div>
                                        </div>
                                        
                                        ${item.dtc ? `
                                        <div class="mt-1">
                                            <div class="text-slate-500 text-xs mb-1">Linked DTC</div>
                                            <div class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200"><i class="ph-bold ph-cpu text-blue-500"></i> ${item.dtc}</div>
                                        </div>` : ''}
                        
                                        ${showActions ? `
                                        <div class="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                                            ${canEdit ? `<button onclick="openEditPartModal()" class="flex-1 text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors"><i class="ph-bold ph-pencil-simple text-sm"></i> Edit</button>` : ''}
                                            
                                            ${canWalkIn ? `<button ${item.stock === 0 ? 'disabled' : `onclick="openWalkInModalInv('${item.name}', '${item.price.toFixed(2)}')" `} class="flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors ${item.stock === 0 ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent'}"><i class="ph-bold ph-shopping-cart-simple text-sm"></i> Walk-in Sale</button>` : ''}
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            // DESKTOP TABLE LAYOUT
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
                    ${showActions ? `
                    <td class="p-4 text-right">
                        <div class="flex justify-end gap-2">
                            ${canEdit ? `<button onclick="openEditPartModal()" class="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"><i class="ph-bold ph-pencil-simple text-lg"></i></button>` : ''}
                            ${canWalkIn ? `<button ${btnStatus}>
                                <i class="ph-bold ph-shopping-cart-simple"></i> Walk-in Sale
                            </button>` : ''}
                        </div>
                    </td>
                    ` : ''}
                </tr>
            `;
        }
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
        statusId: 'waiting',
        statusName: 'Waiting for Parts',
        statusClass: 'bg-orange-50 text-orange-600 border-orange-200',
        dotClass: 'bg-orange-500',
        repairPlan: {
            parts: [
                {
                    id: 'part-1',
                    part: { name: 'Coolant Temperature Sensor', price: 850 },
                    target: 'Coolant temp sensor high (P0118) (Engine)',
                    qty: 1,
                    handling: 'order',
                    expectedArrival: '2026-10-07',
                    partStatus: 'Waiting'
                },
                {
                    id: 'part-2',
                    part: { name: 'Front Brake Pads', price: 450 },
                    target: 'Brake pads heavily worn (Brakes)',
                    qty: 1,
                    handling: 'order',
                    expectedArrival: '2026-10-06',
                    partStatus: 'Ordered'
                }
            ],
            laborCost: 500,
            estimatedTotal: 1800
        }
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
        statusName: 'Pending Post-Scan / Calibration',
        statusClass: 'bg-purple-50 text-purple-600 border-purple-200',
        dotClass: 'bg-purple-500',
        repairPlan: {
            parts: [],
            laborCost: 800,
            estimatedTotal: 800
        }
    }
];

function checkJobPartsStatus(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job || !job.repairPlan || !job.repairPlan.parts) return;
    
    const pendingParts = job.repairPlan.parts.filter(p => p.handling === 'order' && p.partStatus !== 'Received');
    
    if (pendingParts.length === 0 && job.statusId === 'waiting') {
        job.statusId = 'progress';
        job.statusName = 'In Progress';
        job.statusClass = 'bg-blue-50 text-blue-600 border-blue-200';
        job.dotClass = 'bg-blue-500 animate-pulse';
        job.startedAnyway = false;
        
        showToast(`All parts ready. ${job.id} moved to In Progress.`);
        renderRepairs();
    } else {
        renderRepairs();
    }
}

function showToast(msg) {
    let toast = document.createElement('div');
    const isMobile = document.body.classList.contains('mobile-app');
    const bottomClass = isMobile ? 'bottom-24 left-4 right-4 mx-auto w-max max-w-[90%]' : 'bottom-4 right-4';
    toast.className = `fixed ${bottomClass} bg-slate-800 text-white px-4 py-2 rounded shadow-lg text-sm font-medium z-[9999] transition-opacity duration-300 text-center`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

window.markPartStatus = function(jobId, partId, newStatus) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    const part = job.repairPlan.parts.find(p => p.id === partId);
    if (!part) return;
    part.partStatus = newStatus;
    checkJobPartsStatus(jobId);
};

window.checkStockForJob = function(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    
    if (job.repairPlan && job.repairPlan.parts) {
        job.repairPlan.parts.forEach(p => {
            if (p.handling === 'order') {
                p.partStatus = 'Received';
            }
        });
    }
    checkJobPartsStatus(jobId);
};

window.startRepairAnyway = function(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    
    job.statusId = 'progress';
    job.statusName = 'In Progress';
    job.statusClass = 'bg-blue-50 text-blue-600 border-blue-200';
    job.dotClass = 'bg-blue-500 animate-pulse';
    job.startedAnyway = true;
    renderRepairs();
};

window.markRepairDone = function(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    
    // Check if ecu was used (for mock demo, if it has 'sensor' in diagnosis or randomly)
    const ecuUsed = job.diagnosis.toLowerCase().includes('sensor') || job.diagnosis.toLowerCase().includes('ecu');
    
    if (ecuUsed) {
        job.statusId = 'pending';
        job.statusName = 'Pending Post-Scan / Calibration';
        job.statusClass = 'bg-purple-50 text-purple-600 border-purple-200';
        job.dotClass = 'bg-purple-500';
    } else {
        job.statusId = 'ready';
        job.statusName = 'Ready for Billing';
        job.statusClass = 'bg-emerald-50 text-emerald-600 border-emerald-200';
        job.dotClass = 'bg-emerald-500';
    }
    job.startedAnyway = false;
    renderRepairs();
};

window.completePostScan = function(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    
    job.statusId = 'ready';
    job.statusName = 'Ready for Billing';
    job.statusClass = 'bg-emerald-50 text-emerald-600 border-emerald-200';
    job.dotClass = 'bg-emerald-500';
    renderRepairs();
};

// Payment logic state
let currentPaymentJob = null;
let currentPayMethod = 'Cash';

window.proceedToPayment = function(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    
    currentPaymentJob = job;
    
    // Hide active repairs main, show payment
    document.getElementById('active-repairs-main').classList.add('hidden');
    document.getElementById('payment-screen-container').classList.remove('hidden');
    document.getElementById('payment-form-state').classList.remove('hidden');
    document.getElementById('payment-success-state').classList.add('hidden');
    
    document.getElementById('payment-job-summary').textContent = `${job.customer} - ${job.plate} (${job.model}) • ${job.id}`;
    
    // Adjust layout for mobile
    const isMobile = document.body.classList.contains('mobile-app');
    const payContainer = document.getElementById('payment-screen-container');
    const cashSection = document.getElementById('cash-payment-section');
    const payBtn = document.getElementById('btn-complete-payment');
    const payMethodWrapper = document.querySelector('.pay-method-btn').parentElement;
    
    if (isMobile) {
        payContainer.className = 'w-full bg-white flex flex-col min-h-screen pb-32 pt-2 relative z-10';
        if (cashSection) cashSection.className = 'mb-6 flex flex-col gap-4';
        if (payMethodWrapper) payMethodWrapper.className = 'flex flex-wrap gap-2';
        if (payBtn) payBtn.className = 'w-[calc(100%-32px)] bg-slate-800 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed fixed bottom-20 left-4 right-4 shadow-xl z-20 transition-all';
        document.getElementById('payment-change')?.classList.add('text-2xl', 'py-4');
        document.getElementById('payment-amount')?.classList.add('text-2xl', 'py-4');
    } else {
        payContainer.className = 'max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200';
        if (cashSection) cashSection.className = 'mb-6 flex gap-4';
        if (payMethodWrapper) payMethodWrapper.className = 'flex gap-2';
        if (payBtn) payBtn.className = 'w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';
        document.getElementById('payment-change')?.classList.remove('text-2xl', 'py-4');
        document.getElementById('payment-amount')?.classList.remove('text-2xl', 'py-4');
    }
    
    let itemsHTML = '';
    let grandTotal = 0;
    
    if (job.repairPlan && job.repairPlan.parts) {
        job.repairPlan.parts.forEach(p => {
            const lineTotal = p.part.price * p.qty;
            grandTotal += lineTotal;
            itemsHTML += `
                <div class="flex justify-between text-sm py-1">
                    <div>
                        <span class="font-semibold text-slate-700">${p.part.name}</span> <span class="text-xs text-slate-500">x${p.qty}</span>
                        <div class="text-[10px] text-slate-400">For: ${p.target}</div>
                    </div>
                    <span class="font-mono text-slate-700">₱${lineTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
            `;
        });
        
        if (job.repairPlan.laborCost) {
            grandTotal += job.repairPlan.laborCost;
            itemsHTML += `
                <div class="flex justify-between text-sm py-2 mt-2 border-t border-slate-100">
                    <div class="font-semibold text-slate-700">Labor</div>
                    <span class="font-mono text-slate-700">₱${job.repairPlan.laborCost.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
            `;
        }
    }
    
    document.getElementById('payment-items').innerHTML = itemsHTML || '<div class="text-sm text-slate-500 text-center py-2">No items</div>';
    document.getElementById('payment-grand-total').textContent = `₱${grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    
    currentPaymentJob.computedTotal = grandTotal;
    
    // reset form
    document.getElementById('payment-amount').value = '';
    document.getElementById('payment-change').textContent = '0.00';
    updatePaymentValidation();
};

window.closePaymentScreen = function() {
    document.getElementById('active-repairs-main').classList.remove('hidden');
    document.getElementById('payment-screen-container').classList.add('hidden');
    renderRepairs(); // refresh grid
};

window.completePayment = function() {
    if (!currentPaymentJob) return;
    
    // status paid
    currentPaymentJob.statusId = 'paid';
    currentPaymentJob.statusName = 'Paid / Completed';
    currentPaymentJob.statusClass = 'bg-slate-100 text-slate-600 border-slate-200';
    currentPaymentJob.dotClass = 'bg-slate-400';
    
    // Deduct inventory
    if (currentPaymentJob.repairPlan && currentPaymentJob.repairPlan.parts) {
        currentPaymentJob.repairPlan.parts.forEach(p => {
            if (p.partStatus === 'Received' || !p.partStatus) {
                const invItem = mockInventory.find(inv => inv.name === p.part.name);
                if (invItem) {
                    invItem.stock = Math.max(0, invItem.stock - p.qty);
                }
            }
        });
    }
    
    document.getElementById('payment-form-state').classList.add('hidden');
    document.getElementById('payment-success-state').classList.remove('hidden');
    
    document.getElementById('payment-success-summary').textContent = `${currentPaymentJob.id} for ${currentPaymentJob.plate} has been successfully paid via ${currentPayMethod}.`;
};

// Add event listeners for payment method chips and amount
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('pay-method-btn')) {
        document.querySelectorAll('.pay-method-btn').forEach(btn => {
            btn.className = 'pay-method-btn flex-1 py-2 border border-slate-200 bg-white text-slate-600 rounded font-semibold text-sm hover:bg-slate-50';
        });
        e.target.className = 'pay-method-btn flex-1 py-2 border border-blue-500 bg-blue-50 text-blue-700 rounded font-semibold text-sm';
        currentPayMethod = e.target.getAttribute('data-method');
        
        const cashSection = document.getElementById('cash-payment-section');
        if (cashSection) {
            if (currentPayMethod === 'Cash') {
                cashSection.classList.remove('hidden');
                cashSection.classList.add('flex');
            } else {
                cashSection.classList.add('hidden');
                cashSection.classList.remove('flex');
            }
        }
        updatePaymentValidation();
    }
});

document.addEventListener('input', function(e) {
    if (e.target.id === 'payment-amount' || e.target.id === 'payment-discount') {
        updatePaymentValidation();
    }
});

function updatePaymentValidation() {
    if (!currentPaymentJob) return;
    const btn = document.getElementById('btn-complete-payment');
    if (!btn) return;
    
    const discount = parseFloat(document.getElementById('payment-discount')?.value) || 0;
    const baseTotal = currentPaymentJob.computedTotal || 0;
    const total = Math.max(0, baseTotal - discount);
    
    document.getElementById('payment-grand-total').textContent = `₱${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    
    if (currentPayMethod === 'Cash') {
        const amount = parseFloat(document.getElementById('payment-amount').value) || 0;
        const change = amount - total;
        
        document.getElementById('payment-change').textContent = change >= 0 ? change.toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00';
        
        btn.disabled = amount < total;
    } else {
        btn.disabled = false;
        document.getElementById('payment-change').textContent = '0.00';
    }
}

window.toggleRepairCard = function(id) {
    if (!window.expandedRepairCards) window.expandedRepairCards = new Set();
    const isExpanding = !window.expandedRepairCards.has(id);
    
    if (isExpanding) {
        window.expandedRepairCards.add(id);
    } else {
        window.expandedRepairCards.delete(id);
    }
    
    // Animate DOM directly to allow smooth transition without destroying elements
    const contentDiv = document.getElementById(`repair-expanded-${id}`);
    const chevron = document.getElementById(`repair-chevron-${id}`);
    
    if (contentDiv && chevron) {
        if (isExpanding) {
            contentDiv.classList.remove('max-h-0', 'opacity-0');
            contentDiv.classList.add('max-h-[2000px]', 'opacity-100');
            chevron.classList.add('rotate-180');
        } else {
            contentDiv.classList.remove('max-h-[2000px]', 'opacity-100');
            contentDiv.classList.add('max-h-0', 'opacity-0');
            chevron.classList.remove('rotate-180');
        }
    } else {
        renderRepairs();
    }
};

function renderRepairs() {
    const grid = document.getElementById('repairs-grid');
    if (!grid) return;
    
    const isMobile = document.body.classList.contains('mobile-app');
    
    const searchInput = document.getElementById('repair-search');
    const searchContainer = searchInput?.parentElement;
    const filterContainer = document.getElementById('repair-filters');
    
    if (isMobile) {
        grid.className = 'flex flex-col gap-3 pb-32';
        if (searchInput) searchInput.placeholder = "Search plate, customer or job #";
        if (searchContainer) searchContainer.className = 'relative w-full';
        if (filterContainer) {
            filterContainer.style.maskImage = 'linear-gradient(to right, black 85%, transparent 100%)';
            filterContainer.style.webkitMaskImage = 'linear-gradient(to right, black 85%, transparent 100%)';
        }
    } else {
        grid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5';
        if (searchInput) searchInput.placeholder = "Search by Plate No., Customer Name, or Job ID...";
        if (searchContainer) searchContainer.className = 'relative w-full sm:max-w-md';
        if (filterContainer) {
            filterContainer.style.maskImage = '';
            filterContainer.style.webkitMaskImage = '';
        }
    }

    const query = (document.getElementById('repair-search')?.value || '').toLowerCase();

    // Filter Data
    const filtered = mockRepairsData.filter(job => {
        const matchesSearch = job.plate.toLowerCase().includes(query) || 
                              job.customer.toLowerCase().includes(query) || 
                              job.id.toLowerCase().includes(query);
                              
        const matchesStatus = currentRepairFilter === 'all' ? job.statusId !== 'paid' : job.statusId === currentRepairFilter;

        return matchesSearch && matchesStatus;
    });

    // Update Filter Chips Counts
    const statusCounts = { all: mockRepairsData.filter(j => j.statusId !== 'paid').length };
    mockRepairsData.forEach(j => {
        statusCounts[j.statusId] = (statusCounts[j.statusId] || 0) + 1;
    });
    
    document.querySelectorAll('.repair-filter-btn').forEach(btn => {
        const f = btn.getAttribute('data-filter');
        const count = statusCounts[f] || 0;
        if (!btn.hasAttribute('data-original-text')) {
            btn.setAttribute('data-original-text', btn.textContent.trim());
        }
        const origText = btn.getAttribute('data-original-text');
        
        if (isMobile) {
            btn.innerHTML = `${origText} <span class="ml-1 px-1.5 py-0.5 bg-black/10 rounded text-[10px]">${count}</span>`;
        } else {
            btn.textContent = origText;
        }
    });

    let resultCountHTML = '';
    if (isMobile && filtered.length > 0) {
        const countText = filtered.length === 1 ? '1 job' : `${filtered.length} jobs`;
        resultCountHTML = `<div class="text-sm font-semibold text-slate-500 px-1 mb-1">${countText}</div>`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-slate-500 font-medium bg-white rounded-xl border border-slate-200 shadow-sm">${isMobile ? 'No jobs found' : 'No active repairs found matching your criteria.'}</div>`;
        return;
    }

    // Render HTML Cards
    grid.innerHTML = resultCountHTML + filtered.map(job => {
        const opacityClass = (job.statusId !== 'progress' && job.statusId !== 'waiting') ? 'opacity-80' : '';
        
        // Build mechanic select options
        const mechOptions = job.mechanicOptions.map((mech, idx) => 
            `<option ${idx === job.selectedMechIndex ? 'selected' : ''}>${mech}</option>`
        ).join('');

        let partsHTML = '';
        const showPartsList = job.statusId === 'waiting' || (job.statusId === 'progress' && job.startedAnyway);
        let hasPending = false;
        
        if (job.repairPlan && job.repairPlan.parts) {
            const pendingParts = job.repairPlan.parts.filter(p => p.handling === 'order');
            hasPending = pendingParts.some(p => p.partStatus !== 'Received');
            
            if (showPartsList && pendingParts.length > 0) {
                let partsRows = pendingParts.map(p => {
                    let actionsHTML = '';
                    if (p.partStatus !== 'Received') {
                        if (p.partStatus === 'Waiting' || !p.partStatus) {
                            actionsHTML += `<button onclick="markPartStatus('${job.id}', '${p.id}', 'Ordered')" class="text-[10px] text-blue-600 hover:underline">Mark ordered</button>`;
                        }
                        actionsHTML += `<button onclick="markPartStatus('${job.id}', '${p.id}', 'Received')" class="text-[10px] text-emerald-600 hover:underline ml-2">Mark received</button>`;
                    } else {
                        actionsHTML = `<span class="text-[10px] text-emerald-600 font-bold"><i class="ph-bold ph-check"></i> Ready</span>`;
                    }
                    
                    let statusColor = (!p.partStatus || p.partStatus === 'Waiting') ? 'text-amber-600' : (p.partStatus === 'Ordered' ? 'text-blue-600' : 'text-emerald-600');

                    return `
                        <div class="flex flex-col py-1.5 border-b border-slate-100 last:border-0">
                            <div class="flex justify-between items-start mb-0.5">
                                <span class="text-xs font-semibold text-slate-700">${p.part.name} (x${p.qty})</span>
                                <span class="text-[10px] font-bold ${statusColor}">${p.partStatus || 'Waiting'}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] text-slate-500 truncate pr-2">For: ${p.target}</span>
                                <span class="text-[10px] text-slate-400 whitespace-nowrap">ETA: ${p.expectedArrival || 'N/A'}</span>
                            </div>
                            <div class="flex justify-end mt-1">${actionsHTML}</div>
                        </div>
                    `;
                }).join('');

                let anywayBtn = '';
                if (job.statusId === 'waiting') {
                    anywayBtn = `<button onclick="startRepairAnyway('${job.id}')" class="text-[10px] font-semibold text-amber-600 hover:text-amber-700 hover:underline mt-2 inline-flex items-center gap-1"><i class="ph-bold ph-play"></i> Start repair anyway</button>`;
                }

                let pendingTag = '';
                if (job.statusId === 'progress' && hasPending) {
                    pendingTag = `<span class="absolute top-3 right-3 bg-orange-50 text-orange-600 border-orange-200 border text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"><i class="ph-bold ph-warning-circle"></i> Parts pending</span>`;
                }

                partsHTML = `
                    <div class="mt-3 bg-slate-50 border border-slate-200 rounded p-2.5 relative">
                        ${pendingTag}
                        <span class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Parts Needed</span>
                        ${partsRows}
                        ${anywayBtn}
                    </div>
                `;
            }
        }

        // Determine primary button based on rules
        let btnText = 'View Details';
        let btnClass = 'bg-slate-800 hover:bg-slate-900 text-white';
        let btnAction = 'openRepairModal()';
        let btnDisabled = false;
        let hintHTML = '';
        
        if (job.statusId === 'waiting') {
            btnText = '<i class="ph-bold ph-arrows-clockwise"></i> Check stock';
            btnAction = `checkStockForJob('${job.id}')`;
        } else if (job.statusId === 'progress') {
            btnText = '<i class="ph-bold ph-check-circle"></i> Mark Repair Done';
            btnAction = `markRepairDone('${job.id}')`;
            if (hasPending) {
                btnDisabled = true;
                btnClass = 'bg-slate-300 text-slate-500 cursor-not-allowed';
                hintHTML = `<div class="text-[10px] text-amber-600 font-medium text-right mt-1 w-full"><i class="ph-bold ph-info"></i> Cannot complete: waiting for parts</div>`;
            }
        } else if (job.statusId === 'pending') {
            btnText = '<i class="ph-bold ph-check-square"></i> Complete Post-Scan';
            btnAction = `completePostScan('${job.id}')`;
        } else if (job.statusId === 'ready') {
            btnText = 'Proceed to Payment <i class="ph-bold ph-arrow-right"></i>';
            btnAction = `proceedToPayment('${job.id}')`;
            btnClass = 'bg-blue-600 hover:bg-blue-700 text-white';
        } else if (job.statusId === 'paid') {
            btnText = '<i class="ph-bold ph-receipt"></i> View Receipt';
            btnAction = ''; // dummy action
            btnClass = 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700';
        }

        if (isMobile) {
            if (!window.expandedRepairCards) window.expandedRepairCards = new Set();
            const isExpanded = window.expandedRepairCards.has(job.id);
            const chevronClass = isExpanded ? 'rotate-180' : '';
            const expandClasses = isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0';
            const pendingBadge = hasPending ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200">Parts pending</span>` : '';
            
            let mobilePartsHTML = '';
            if (job.repairPlan && job.repairPlan.parts && showPartsList) {
                const pendingParts = job.repairPlan.parts.filter(p => p.handling === 'order');
                if (pendingParts.length > 0) {
                    let partsRows = pendingParts.map(p => {
                        let actionsHTML = '';
                        if (p.partStatus !== 'Received') {
                            if (p.partStatus === 'Waiting' || !p.partStatus) {
                                actionsHTML += `<button onclick="markPartStatus('${job.id}', '${p.id}', 'Ordered')" class="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold border border-blue-200 active:bg-blue-100">Mark ordered</button>`;
                            }
                            actionsHTML += `<button onclick="markPartStatus('${job.id}', '${p.id}', 'Received')" class="flex-1 py-1.5 bg-emerald-50 text-emerald-600 rounded text-xs font-semibold border border-emerald-200 active:bg-emerald-100 ml-2">Mark received</button>`;
                        } else {
                            actionsHTML = `<div class="w-full text-center py-1.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200"><i class="ph-bold ph-check"></i> Ready</div>`;
                        }
                        
                        let statusColor = (!p.partStatus || p.partStatus === 'Waiting') ? 'text-amber-600' : (p.partStatus === 'Ordered' ? 'text-blue-600' : 'text-emerald-600');

                        return `
                            <div class="flex flex-col p-2.5 bg-white border border-slate-200 rounded-lg mb-2 last:mb-0 shadow-sm">
                                <div class="flex justify-between items-start mb-1.5">
                                    <span class="text-sm font-bold text-slate-700">${p.part.name} <span class="text-xs font-medium text-slate-500 ml-1">x${p.qty}</span></span>
                                    <span class="text-[10px] font-bold ${statusColor} px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded uppercase tracking-wider">${p.partStatus || 'Waiting'}</span>
                                </div>
                                <div class="flex flex-col gap-0.5 mb-2">
                                    <span class="text-xs text-slate-500"><span class="font-semibold text-slate-600">For:</span> ${p.target}</span>
                                    <span class="text-xs text-slate-500"><span class="font-semibold text-slate-600">ETA:</span> ${p.expectedArrival || 'N/A'}</span>
                                </div>
                                <div class="flex w-full">
                                    ${actionsHTML}
                                </div>
                            </div>
                        `;
                    }).join('');

                    let mobileAnywayBtn = '';
                    if (job.statusId === 'waiting') {
                        mobileAnywayBtn = `<button onclick="startRepairAnyway('${job.id}')" class="w-full py-2 bg-transparent text-amber-700 border border-amber-200 rounded-lg text-xs font-bold active:bg-amber-50 mt-1"><i class="ph-bold ph-play"></i> Start repair anyway</button>`;
                    }
                    
                    const mobileHintHTML = hintHTML ? `<div class="text-[10px] text-amber-600 font-medium text-center w-full"><i class="ph-bold ph-info"></i> Cannot complete: waiting for parts</div>` : '';

                    mobilePartsHTML = `
                        <div class="mt-4 pt-4 border-t border-slate-100">
                            <span class="text-xs font-bold text-slate-500 uppercase block mb-3">Parts Needed</span>
                            <div class="flex flex-col bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                ${partsRows}
                            </div>
                        </div>
                    `;
                }
            }
            
            return `
            <div class="w-full bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden ${opacityClass}">
                <div class="p-4 flex items-center justify-between min-h-[44px] gap-3 cursor-pointer" onclick="toggleRepairCard('${job.id}')">
                    <div class="flex-1 min-w-0 flex flex-col gap-1">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-baseline gap-2 min-w-0">
                                <span class="font-bold text-slate-800 text-lg whitespace-nowrap">${job.plate}</span>
                                <span class="text-xs text-slate-500 truncate">${job.model}</span>
                            </div>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">${job.id}</span>
                        </div>
                        <span class="text-sm font-semibold text-slate-700 truncate">${job.customer}</span>
                        <div class="flex items-center gap-2 mt-1 flex-wrap">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1.5 ${job.statusClass}">
                                ${job.dotClass ? `<span class="w-1.5 h-1.5 rounded-full ${job.dotClass}"></span>` : ''} ${job.statusName}
                            </span>
                            ${pendingBadge}
                        </div>
                    </div>
                    <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-400">
                        <i id="repair-chevron-${job.id}" class="ph-bold ph-caret-down transition-transform duration-200 ${chevronClass}"></i>
                    </div>
                </div>
                
                <div id="repair-expanded-${job.id}" class="transition-all duration-200 ease-in-out overflow-hidden ${expandClasses}">
                    <div class="p-4 pt-0 border-t border-slate-100 bg-white flex flex-col gap-3">
                        <div class="flex flex-col gap-1 mt-3">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Customer</span>
                            <span class="text-sm font-semibold text-slate-700 break-words whitespace-normal">${job.customer}</span>
                        </div>
                        <div class="flex flex-col gap-1">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Mechanic</span>
                            <select class="w-full text-sm font-medium text-slate-700 border border-slate-200 rounded-md p-2.5 bg-slate-50 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm">
                                ${mechOptions}
                            </select>
                        </div>
                        <div class="flex flex-col gap-1">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Initial Diagnosis</span>
                            <p class="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-200 leading-relaxed whitespace-normal break-words">
                                ${job.diagnosis}
                            </p>
                        </div>
                        
                        ${mobilePartsHTML}
                        
                        <div class="mt-2 pt-4 border-t border-slate-100 flex flex-col gap-1.5">
                            <button onclick="${btnAction}" class="w-full py-3 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 ${btnClass}" ${btnDisabled ? 'disabled' : ''}>
                                ${btnText}
                            </button>
                            ${mobileHintHTML}
                            ${mobileAnywayBtn}
                        </div>
                    </div>
                </div>
            </div>
            `;
        } else {
            return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow relative ${opacityClass}">
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
                        ${partsHTML}
                    </div>
                </div>
                <div class="p-3.5 border-t border-slate-100 bg-slate-50/50 flex flex-col items-end">
                    <div class="flex items-center justify-between w-full">
                        <span class="px-2.5 py-1 rounded text-[10px] font-bold border flex items-center gap-1.5 ${job.statusClass}">
                            ${job.dotClass ? `<span class="w-1.5 h-1.5 rounded-full ${job.dotClass}"></span>` : ''} ${job.statusName}
                        </span>
                        <button onclick="${btnAction}" class="text-xs font-semibold px-3.5 py-1.5 rounded transition-colors shadow-sm flex items-center gap-1.5 ${btnClass}" ${btnDisabled ? 'disabled' : ''}>
                            ${btnText}
                        </button>
                    </div>
                    ${hintHTML}
                </div>
            </div>
        `;
        }
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
let forceOwnerMobile = false; // Tracks if owner manually toggled mobile UI

window.toggleOwnerMobileMode = function() {
    forceOwnerMobile = !forceOwnerMobile;
    switchRole(currentRole); // Re-trigger UI setup
};

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
    if (roleId === 'chief' || roleId === 'owner') return mockMobileJobs;
    return mockMobileJobs.filter(job => job.mechanic === systemUsers[roleId].name);
}

// Toggles mobile mode + fills the shell (app bar avatar, More sheet, tab badge). Returns true if mobile.
function applyMobileMode(roleId) {
    const isMobile = MOBILE_ROLES.includes(roleId) || (roleId === 'owner' && forceOwnerMobile);
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
    const isChief = roleId === 'chief' || roleId === 'owner';
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

function updateSharedDiagnosis() {
    const flagged = [];
    if (typeof inspectionItems === 'undefined' || typeof inspectionSections === 'undefined') return;
    inspectionItems.forEach(item => {
        const st = getInspItem(item.id);
        if (st.status === 'fix' || st.status === 'watch') {
            const sec = inspectionSections.find(s => s.id === item.section) || {};
            const category = sec.title || sec.short || 'General';
            const parts = partsForInspectionItem(item, st);
            let suggestedPart = null;
            if (parts.length > 0) {
                const invPart = mockInventory.find(p => p.id === parts[0].id);
                if (invPart) {
                    suggestedPart = {
                        id: invPart.id,
                        name: invPart.name,
                        sku: invPart.sku,
                        price: invPart.price,
                        stock: invPart.stock
                    };
                }
            }
            flagged.push({
                id: item.id,
                category: category,
                name: item.label,
                status: st.status,
                suggestedPart: suggestedPart
            });
        }
    });
    inspectionState.flaggedItems = flagged;
}

function saveInspectionState() {
    updateSharedDiagnosis();
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
    const { complaints } = inspectionState.intake;
    document.querySelectorAll('[data-insp="complaint"]').forEach(btn => btn.classList.toggle('is-active', complaints.includes(btn.dataset.complaint)));
    validateStep1();
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
            const isDone = done === sec.items.length;
            const iconHTML = isDone 
                ? `<i class="ph-fill ph-check-circle text-emerald-500"></i>` 
                : `<i class="ph-fill ${sec.icon}"></i>`;
            return `<button type="button" data-insp="jump" data-section="${sec.id}" class="insp-pill ${isDone ? 'is-done' : ''} ${hasFix ? 'has-fix' : ''}">
                ${iconHTML} ${sec.short} ${done}/${sec.items.length}</button>`;
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
    const suggested = getSuggestedParts();
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
                <div class="grid grid-cols-1 gap-2 pt-1">
                    <button type="button" data-insp="to-findings" class="min-h-[48px] rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                        <i class="ph-bold ph-note-pencil text-lg"></i> Add to Final Findings
                    </button>
                </div>
            </div>
        </div>`;
    
    validateStep1();
}

function validateStep1() {
    const btn = document.getElementById('btn-next-step1');
    const hint = document.getElementById('hint-next-step1');
    if (!btn || !hint) return;

    const hasInsp = typeof inspectionItems !== 'undefined' && inspectionItems.some(i => getInspItem(i.id).status);

    let missing = [];
    if (!hasInsp) missing.push('1 inspection item');

    if (missing.length === 0) {
        btn.disabled = false;
        hint.textContent = '';
    } else {
        btn.disabled = true;
        hint.textContent = 'Please check at least ' + missing.join(', ');
    }
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

}

function applyInspectionMeasure(id, raw) {
    const item = inspectionItemMap[id];
    const st = getInspItem(id);
    st.value = raw === '' ? '' : String(raw);
    if (!st.manual) st.status = evaluateInspectionMeasure(item.measure, st.value);   // auto-grade unless the mechanic overrode it
    saveInspectionState();
    refreshInspectionRow(id);

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
    saveInspectionState();
    renderInspection();
}

// Called after a vehicle is pushed to Active Repairs so the next inspection starts clean
function clearInspectionDraft() {
    inspectionState = emptyInspectionState();
    inspectionPhotos = {};
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
    if (target.dataset && target.dataset.inspInput === 'measure') {
        applyInspectionMeasure(target.dataset.item, target.value);
    } else if (target.dataset && target.dataset.inspInput === 'note') {
        getInspItem(target.dataset.item).note = target.value;
        saveInspectionState();
    }
});

document.addEventListener('change', function(e) {
    if (e.target.matches && e.target.matches('[data-insp-file]')) handleInspectionPhoto(e.target);
});

window.toggleInvCard = function(id) {
    if (!window.expandedInvCards) window.expandedInvCards = new Set();
    const wrap = document.getElementById(`inv-wrap-${id}`);
    const chevron = document.getElementById(`inv-chevron-${id}`);
    
    if (window.expandedInvCards.has(id)) {
        window.expandedInvCards.delete(id);
        if (wrap) wrap.style.gridTemplateRows = '0fr';
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    } else {
        window.expandedInvCards.add(id);
        if (wrap) wrap.style.gridTemplateRows = '1fr';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
};
