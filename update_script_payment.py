import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's add the payment logic functions and replace renderRepairs
start_idx = content.find('function checkJobPartsStatus(jobId) {')
end_idx = content.find('// Attach Event Listeners', start_idx)

new_code = """function checkJobPartsStatus(jobId) {
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
    toast.className = 'fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded shadow-lg text-sm font-medium z-50';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
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
    if (e.target.id === 'payment-amount') {
        updatePaymentValidation();
    }
});

function updatePaymentValidation() {
    if (!currentPaymentJob) return;
    const btn = document.getElementById('btn-complete-payment');
    if (!btn) return;
    
    if (currentPayMethod === 'Cash') {
        const amount = parseFloat(document.getElementById('payment-amount').value) || 0;
        const total = currentPaymentJob.computedTotal || 0;
        const change = amount - total;
        
        document.getElementById('payment-change').textContent = change >= 0 ? change.toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00';
        
        btn.disabled = amount < total;
    } else {
        btn.disabled = false;
    }
}

function renderRepairs() {
    const grid = document.getElementById('repairs-grid');
    if (!grid) return;

    const query = (document.getElementById('repair-search')?.value || '').toLowerCase();

    // Filter Data
    const filtered = mockRepairsData.filter(job => {
        const matchesSearch = job.plate.toLowerCase().includes(query) || 
                              job.customer.toLowerCase().includes(query) || 
                              job.id.toLowerCase().includes(query);
                              
        const matchesStatus = currentRepairFilter === 'all' ? job.statusId !== 'paid' : job.statusId === currentRepairFilter;

        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-slate-500 font-medium bg-white rounded-xl border border-slate-200">No active repairs found matching your criteria.</div>`;
        return;
    }

    // Render HTML Cards
    grid.innerHTML = filtered.map(job => {
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
    }).join('');
}
"""

new_content = content[:start_idx] + new_code + "\n" + content[end_idx:]

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Script updated with payment flow.")

