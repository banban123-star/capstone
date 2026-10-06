import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace mockRepairsData and related functions again to update the colors
start_idx = content.find('const mockRepairsData = [')
end_idx = content.find('// Attach Event Listeners', start_idx)

new_code = """const mockRepairsData = [
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
        const opacityClass = (job.statusId !== 'progress' && job.statusId !== 'waiting') ? 'opacity-80' : '';
        
        // Build mechanic select options
        const mechOptions = job.mechanicOptions.map((mech, idx) => 
            `<option ${idx === job.selectedMechIndex ? 'selected' : ''}>${mech}</option>`
        ).join('');

        let partsHTML = '';
        const showPartsList = job.statusId === 'waiting' || (job.statusId === 'progress' && job.startedAnyway);
        
        if (showPartsList && job.repairPlan && job.repairPlan.parts) {
            const pendingParts = job.repairPlan.parts.filter(p => p.handling === 'order');
            if (pendingParts.length > 0) {
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

                const hasPending = pendingParts.some(p => p.partStatus !== 'Received');

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

        // Determine primary button
        let btnText = 'Manage Repair <i class="ph-bold ph-caret-right"></i>';
        let btnClass = 'bg-slate-800 hover:bg-slate-900 text-white';
        let btnAction = 'openRepairModal()';
        
        if (job.statusId === 'waiting') {
            btnText = '<i class="ph-bold ph-arrows-clockwise"></i> Check stock';
            btnAction = `checkStockForJob('${job.id}')`;
            btnClass = 'bg-slate-800 hover:bg-slate-900 text-white';
        } else if (job.statusId === 'pending') {
            btnText = 'Manage Repair <i class="ph-bold ph-caret-right"></i>';
            btnClass = 'bg-slate-800 hover:bg-slate-900 text-white';
        } else if (job.statusId === 'ready') {
            btnText = 'Manage Repair <i class="ph-bold ph-caret-right"></i>';
            btnClass = 'bg-slate-800 hover:bg-slate-900 text-white';
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
                <div class="p-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span class="px-2.5 py-1 rounded text-[10px] font-bold border flex items-center gap-1.5 ${job.statusClass}">
                        <span class="w-1.5 h-1.5 rounded-full ${job.dotClass}"></span> ${job.statusName}
                    </span>
                    <button onclick="${btnAction}" class="text-xs font-semibold px-3.5 py-1.5 rounded transition-colors shadow-sm flex items-center gap-1.5 ${btnClass}">
                        ${btnText}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}
"""

new_content = content[:start_idx] + new_code + "\n" + content[end_idx:]

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Colors updated successfully.")

