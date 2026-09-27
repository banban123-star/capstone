// --- Dynamic Loading Logic (SPA) ---
const mainContentArea = document.getElementById('main-content-area');
const headerTitle = document.getElementById('header-title');

async function loadView(viewName) {
    try {
        const response = await fetch(`views/${viewName}.html`);
        if (!response.ok) throw new Error('File not found');
        const html = await response.text();
        mainContentArea.innerHTML = html;
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
    owner: { name: 'User', role: 'Shop Owner', initials: 'IG', color: 'bg-blue-600' },
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