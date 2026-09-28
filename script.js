// --- Mock Inventory Data for Diagnostics Autocomplete ---
const mockInventory = [
    { id: 'p1', name: 'Coolant Temp Sensor (OEM Honda)', sku: '37870-KZR-601', price: 850.00, stock: 24 },
    { id: 'p2', name: 'Front Disc Brake Pads', sku: '06455-K59-A71', price: 450.00, stock: 3 },
    { id: 'p3', name: 'Yamaha V-Belt', sku: '2DP-E7641-00', price: 1200.00, stock: 0 },
    { id: 'p4', name: 'Yamalube Standard Engine Oil', sku: 'YAM-OIL-STD', price: 400.00, stock: 45 },
    { id: 'p5', name: 'Spark Plug (NGK CPR8EA-9)', sku: 'NGK-CPR8EA', price: 250.00, stock: 12 }
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
        
        if (part && part.stock > 0) {
            const container = document.getElementById('selected-parts-container');
            
            // Render line item chip if it doesn't already exist
            if (!document.getElementById(`selected-part-${part.id}`)) {
                const html = `
                    <div id="selected-part-${part.id}" class="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 shadow-sm animate-[fadeIn_0.2s_ease-out]">
                        <div class="flex-1 min-w-0 pr-2">
                            <div class="text-sm font-bold text-slate-800 truncate">${part.name}</div>
                            <div class="text-xs text-slate-500">₱${part.price.toFixed(2)} / unit</div>
                        </div>
                        <div class="flex items-center gap-3 shrink-0">
                            <div class="flex items-center bg-slate-50 rounded-md border border-slate-200">
                                <button class="px-2.5 py-1 text-slate-400 hover:text-blue-600 btn-qty-minus transition-colors"><i class="ph-bold ph-minus"></i></button>
                                <span class="w-6 text-center text-xs font-bold text-slate-700 qty-val">1</span>
                                <button class="px-2.5 py-1 text-slate-400 hover:text-blue-600 btn-qty-plus transition-colors" data-max="${part.stock}"><i class="ph-bold ph-plus"></i></button>
                            </div>
                            <button class="text-slate-400 hover:bg-red-50 hover:text-red-500 rounded p-1.5 btn-remove-part transition-colors" title="Remove part"><i class="ph-bold ph-x"></i></button>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', html);
            }
            
            document.getElementById('part-search-input').value = '';
            document.getElementById('part-autocomplete-dropdown').classList.add('hidden');
        } else if (part && part.stock === 0) {
            alert('This item is currently out of stock.');
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

async function loadView(viewName) {
    try {
        const response = await fetch(`views/${viewName}.html`);
        if (!response.ok) throw new Error('File not found');
        const html = await response.text();
        mainContentArea.innerHTML = html;

        // Initialize Diagnostics view state
        if (viewName === 'diagnostics') {
            const isPhysicalOn = document.getElementById('toggle-physical')?.checked;
            const isEcuOn = document.getElementById('toggle-ecu')?.checked;
            if (document.getElementById('physical-inspection-card')) document.getElementById('physical-inspection-card').classList.toggle('hidden', !isPhysicalOn);
            if (document.getElementById('ecu-scan-card')) document.getElementById('ecu-scan-card').classList.toggle('hidden', !isEcuOn);
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

        headerTitle.textContent = this.textContent.trim();
        loadView(targetId); // FETCH THE HTML FILE

        if(window.innerWidth < 1024) toggleSidebar(false);
    });
});

// --- Role-Based Access Control (RBAC) Simulation ---
const systemUsers = {
    owner: { name: 'Admin', role: 'Shop Owner', initials: 'IG', color: 'bg-blue-600' },
    chief: { name: 'Larpus', role: 'Chief Mechanic', initials: 'JB', color: 'bg-purple-600' },
    sub: { name: 'Hiyo', role: 'Sub-Mechanic', initials: 'F', color: 'bg-slate-600' },
    cashier: { name: 'Sarah Lee', role: 'Cashier', initials: 'SL', color: 'bg-emerald-600' }
};

function switchRole(roleId) {
    const user = systemUsers[roleId];
    
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

// --- Active Repairs / Inventory Modals ---
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


// --- NEW: Interactive Reports & Analytics Logic ---

function renderReports(dateRange) {
    // 1. Highlight the active filter button
    const filterBtns = document.querySelectorAll('.report-date-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            // Revert all buttons to default styling
            btn.classList.remove('bg-blue-600', 'text-white', 'border-transparent');
            btn.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
            
            // Set active styling on the clicked button
            if (btn.getAttribute('data-range') === dateRange) {
                btn.classList.add('bg-blue-600', 'text-white', 'border-transparent');
                btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
            }
        });
    }

    // 2. Simulated Dynamic UI updates (You can link this to real data later)
    console.log(`Reports view successfully updated for range: ${dateRange}`);
    
    // Example (Optional): Update a summary card if it exists in your reports.html
    /*
    const revenueAmount = document.getElementById('report-revenue-amount');
    if (revenueAmount) {
        if (dateRange === 'today') revenueAmount.textContent = '₱4,500.00';
        else if (dateRange === 'week') revenueAmount.textContent = '₱32,000.00';
        else if (dateRange === 'month') revenueAmount.textContent = '₱145,000.00';
        else if (dateRange === 'year') revenueAmount.textContent = '₱1,750,000.00';
    }
    */
}

// Attach Event Listeners for Report Date Filters
document.addEventListener('click', function(e) {
    const dateBtn = e.target.closest('.report-date-btn');
    if (dateBtn) {
        const range = dateBtn.getAttribute('data-range');
        if (range) {
            renderReports(range);
        }
    }
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