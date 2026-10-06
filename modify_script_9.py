import re

def main():
    with open('script.js', 'r', encoding='utf-8') as f:
        content = f.read()

    new_render_step3 = """function renderStep3Summary() {
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
}"""

    content = re.sub(r"function renderStep3Summary\(\) \{[\s\S]*?(?=\nfunction toggleStep3RegistrationMode)", new_render_step3, content)


    new_confirm = """function confirmStep3Push() {
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
            statusClass: isWaiting ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-blue-100 text-blue-700 border-blue-200',
            dotClass: isWaiting ? 'bg-amber-500' : 'bg-blue-500 animate-pulse',
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
}"""

    content = re.sub(r"function confirmStep3Push\(\) \{[\s\S]*?(?=\nfunction resetDiagnosticsWorkflow)", new_confirm, content)

    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    main()

