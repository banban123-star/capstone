import re

with open('script.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add state variable
text = text.replace('let planReviewed = false;', 'let planReviewed = false;\\nlet repairPlanParts = [];')

# 2. Update switchDiagStep
text = text.replace('autoAssignToPlan();', 'syncPlanFromDiagnosis(true);')

# 3. Replace autoAssignToPlan
auto_assign_pattern = r'function autoAssignToPlan\(\) \{.*?updatePlanTotals\(\);\n\}'
sync_func = '''function syncPlanFromDiagnosis(firstTime = false) {
    if (firstTime && planReviewed) return;

    const complaintsBox = document.getElementById("step2-complaints-container");
    if (complaintsBox) {
        const complaints = inspectionState.intake.complaints || [];
        if (complaints.length === 0) {
            complaintsBox.innerHTML = '<span class="text-xs text-slate-400 italic">None recorded</span>';
        } else {
            complaintsBox.innerHTML = complaints.map(c => '<span class="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold border border-slate-200">' + escHTML(c) + '</span>').join('');
        }
    }

    const suggestions = getSuggestedParts();
    suggestions.forEach(r => {
        const part = mockInventory.find(p => p.id === r.id);
        if (!part) return;
        if (firstTime && !r.checked) return;

        const exists = repairPlanParts.find(p => p.id === part.id);
        if (!exists) {
            let targetName = "Other / General";
            let targetCategory = "";
            
            if (r.sources.includes("ecu")) {
                targetName = r.reasons.find(rs => rs.match(/^[PBUC]\\d{4}:/)) || "ECU / OBD Diagnostic";
                targetCategory = "Diagnostic Scans";
            } else if (r.sources.includes("physical")) {
                const flagged = inspectionState.flaggedItems?.find(f => f.suggestedPart?.id === part.id);
                if (flagged) {
                    targetName = flagged.name;
                    targetCategory = flagged.category;
                } else {
                    targetName = r.reasons[0] || "General Maintenance";
                }
            }
            
            repairPlanParts.push({
                id: part.id,
                part: part,
                qty: r.qty,
                source: "diagnosis",
                target: targetName,
                category: targetCategory,
                stock: part.stock
            });
        }
    });

    planReviewed = true;
    renderRepairPlan();
    updatePlanTotals();
}

function renderRepairPlan() {
    const container = document.getElementById("selected-parts-container");
    const emptyState = document.getElementById("plan-empty");
    if (!container || !emptyState) return;

    if (repairPlanParts.length === 0) {
        container.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }
    
    emptyState.classList.add("hidden");
    
    const groups = {};
    repairPlanParts.forEach(item => {
        const key = item.target || "Other / General";
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    });

    let html = "";
    const keys = Object.keys(groups).sort((a, b) => {
        if (a === "Other / General") return 1;
        if (b === "Other / General") return -1;
        return a.localeCompare(b);
    });

    keys.forEach(key => {
        html += '<div class="mb-3 last:mb-0">';
        html += '<h4 class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">' + escHTML(key) + '</h4>';
        html += '<div class="flex flex-col gap-2">';
        
        groups[key].forEach(item => {
            const part = item.part;
            const isAuto = item.source === "diagnosis";
            const oos = part.stock === 0;
            
            html += '<div id="selected-part-' + part.id + '" data-id="' + part.id + '" data-price="' + part.price + '" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border ' + (oos ? 'border-red-200 bg-red-50/30' : 'border-slate-200') + ' rounded-lg p-3 shadow-sm">';
            html += '    <div class="flex-1 min-w-0">';
            html += '        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">';
            html += '            <div class="text-sm font-bold text-slate-800 truncate">' + escHTML(part.name) + '</div>';
            html += '            <span class="text-[10px] font-mono text-slate-500">' + escHTML(part.sku) + '</span>';
            if (isAuto) html += '            <span class="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-purple-200 uppercase tracking-wider"><i class="ph-bold ph-magic-wand"></i> Auto-assigned</span>';
            if (oos) html += '            <span class="inline-flex items-center gap-1 bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-red-200 uppercase tracking-wider"><i class="ph-bold ph-warning"></i> Out of stock</span>';
            html += '        </div>';
            html += '        <div class="text-xs text-slate-600 mb-1">';
            html += '            ,' + part.price.toFixed(2) + ' / unit A <span class="line-total font-bold text-slate-700">,' + (part.price * item.qty).toFixed(2) + '</span>';
            html += '        </div>';
            if (item.category) html += '        <div class="text-[10px] text-slate-500"><span class="font-semibold text-slate-600">For:</span> ' + escHTML(item.target) + ' (' + escHTML(item.category) + ')</div>';
            if (oos) html += '        <div class="text-[10px] font-bold text-red-600 mt-0.5">Order needed</div>';
            html += '    </div>';
            html += '    <div class="flex items-center gap-3 shrink-0">';
            html += '        <div class="flex items-center bg-slate-50 rounded-md border ' + (oos ? 'border-red-200' : 'border-slate-200') + '">';
            html += '            <button type="button" class="px-2.5 py-1 text-slate-400 hover:text-blue-600 transition-colors" onclick="updatePlanQty(\\'' + part.id + '\\', -1)"><i class="ph-bold ph-minus"></i></button>';
            html += '            <span class="w-6 text-center text-xs font-bold text-slate-700 qty-val">' + item.qty + '</span>';
            html += '            <button type="button" class="px-2.5 py-1 text-slate-400 hover:text-blue-600 transition-colors" onclick="updatePlanQty(\\'' + part.id + '\\', 1)"><i class="ph-bold ph-plus"></i></button>';
            html += '        </div>';
            html += '        <button type="button" class="text-slate-400 hover:text-red-500 transition-colors p-1" onclick="removePlanPart(\\'' + part.id + '\\')" aria-label="Remove part"><i class="ph-bold ph-trash text-lg"></i></button>';
            html += '    </div>';
            html += '</div>';
        });
        html += '</div></div>';
    });

    container.innerHTML = html.replace(/,/g, '?').replace(/ A /g, ' � ');
}

function updatePlanQty(id, delta) {
    const item = repairPlanParts.find(p => p.id === id);
    if (!item) return;
    const newQty = item.qty + delta;
    if (newQty < 1) return;
    item.qty = newQty;
    renderRepairPlan();
    updatePlanTotals();
}

function removePlanPart(id) {
    repairPlanParts = repairPlanParts.filter(p => p.id !== id);
    renderRepairPlan();
    updatePlanTotals();
}'''
text = re.sub(auto_assign_pattern, lambda m: sync_func, text, flags=re.DOTALL)

# 4. Replace addPartToPlan
add_part_pattern = r'function addPartToPlan\(part, opts = \{\}\) \{.*?\n\}'
new_add = '''function addPartToPlan(part, opts = {}) {
    if (!part) return false;
    const exists = repairPlanParts.find(p => p.id === part.id);
    if (exists) {
        exists.qty += (opts.qty || 1);
    } else {
        repairPlanParts.push({
            id: part.id,
            part: part,
            qty: opts.qty || 1,
            source: "manual",
            target: "Other / General",
            category: "",
            stock: part.stock
        });
    }
    renderRepairPlan();
    updatePlanTotals();
    return true;
}'''
text = re.sub(add_part_pattern, lambda m: new_add, text, flags=re.DOTALL)

# 5. Replace updatePlanTotals
update_totals_pattern = r'function updatePlanTotals\(\) \{.*?\n\}'
new_update_totals = '''function updatePlanTotals() {
    let count = 0;
    let partsTotal = 0;
    repairPlanParts.forEach(item => {
        count++;
        partsTotal += item.part.price * item.qty;
    });
    
    const labor = parseFloat(document.getElementById("labor-cost-input")?.value) || 0;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("plan-parts-count", count);
    set("plan-parts-total", fmtPeso(partsTotal));
    set("plan-grand-total", fmtPeso(partsTotal + labor));

    const badge = document.getElementById("plan-state-badge");
    if (badge) {
        const done = planReviewed && count > 0;
        badge.textContent = done ? "Parts finalized" : (count ? "Needs review" : "Draft");
        badge.className = "text-[10px] font-bold px-2 py-1 rounded-full border " + (done ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200");
    }

    const btnNext2 = document.getElementById("btn-next-step2");
    const ff = document.getElementById("final-findings")?.value.trim();
    if (btnNext2) {
        btnNext2.disabled = !ff;
    }
}'''
text = re.sub(update_totals_pattern, lambda m: new_update_totals, text, flags=re.DOTALL)

# 6. Reset step 2 additions
reset_pattern = r'const planBox = document.getElementById\(\'selected-parts-container\'\);\s*if \(planBox\) planBox\.innerHTML = \'\';'
new_reset = '''const planBox = document.getElementById("selected-parts-container");
    if (planBox) planBox.innerHTML = "";
    repairPlanParts = [];
    planReviewed = false;'''
text = re.sub(reset_pattern, lambda m: new_reset, text)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
