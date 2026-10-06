import re

def main():
    with open('script.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update renderRepairPlan
    new_render = """function renderRepairPlan() {
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
                outOfStock = true; // Treats low stock similar to out of stock for handling
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
        // optionally reset to order so it doesn't stay stuck on replace
        item.handling = 'order'; 
    } else if (item.handling === 'remove') {
        removePlanPart(row.querySelector('.btn-remove-part') || row); // Fallback if needed, but easier to just call logic
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
"""
    
    pattern_render = r"function renderRepairPlan\(\) \{.*?\n\}\n\nwindow\.changePartTarget"
    # Wait, the end of renderRepairPlan is a bit tricky to match.
    # Let's replace function renderRepairPlan() { ... } with regex matching bracket depths if possible, or just hardcode string replacement.
    
    content = re.sub(r"function renderRepairPlan\(\) \{[\s\S]*?(?=\nwindow\.changePartTarget =)", new_render, content)

    # 2. Add bypass to qty check in addPartToPlan. The user requirement says:
    # "Compare quantity against inventory stock live... Do not block the user from continuing"
    # We should allow adding qty > stock now!
    # Let's remove the constraint in addPartToPlan and updatePlanQty.
    
    # In addPartToPlan
    add_part_find = r"const qty = Math\.max\(1, Math\.min\(opts\.qty \|\| 1, part\.stock\)\);"
    add_part_replace = r"const qty = Math.max(1, opts.qty || 1);"
    content = content.replace(add_part_find, add_part_replace)
    
    add_part_find2 = r"existing\.qty = Math\.min\(existing\.qty \+ qty, part\.stock > 0 \? part\.stock : existing\.qty \+ qty\);"
    add_part_replace2 = r"existing.qty = existing.qty + qty;"
    content = content.replace(add_part_find2, add_part_replace2)
    
    # In window.updatePlanQty
    update_qty_find = r"""        if \(delta > 0 && item\.qty >= item\.stock && item\.stock > 0\) \{
            alert\(`Only \$\{item\.stock\} units available in stock\.\`\);
            return;
        \}"""
    content = re.sub(update_qty_find, "", content)
    
    # In confirmManualPart
    confirm_manual_find = r"""    if \(qty > part\.stock && part\.stock > 0\) \{
        alert\(`Only \$\{part\.stock\} units available in stock\.\`\);
        return;
    \}"""
    content = re.sub(confirm_manual_find, "", content)
    
    # 3. Rewrite updatePlanTotals to set the banner, hasPendingParts, and next button text
    new_update_totals = """function updatePlanTotals() {
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
}"""
    
    content = re.sub(r"function updatePlanTotals\(\) \{[\s\S]*?(?=\nfunction hasDiagnosisData)", new_update_totals, content)
    
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    main()

