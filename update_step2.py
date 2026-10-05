import re

def main():
    with open('script.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update autocomplete click to show the form instead of addPartToPlan
    old_autocomplete_click = """    // 3. Select Item from Autocomplete
    const autocompleteItem = e.target.closest('.autocomplete-item');
    if (autocompleteItem) {
        const partId = autocompleteItem.getAttribute('data-id');
        const part = mockInventory.find(p => p.id === partId);
        
        if (addPartToPlan(part)) {
            document.getElementById('part-search-input').value = '';
            document.getElementById('part-autocomplete-dropdown').classList.add('hidden');
        }
    }"""
    
    new_autocomplete_click = """    // 3. Select Item from Autocomplete
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
    }"""
    content = content.replace(old_autocomplete_click, new_autocomplete_click)

    # 2. Add manual form logic and populate options
    manual_logic = """
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
    if (qty > part.stock && part.stock > 0) {
        alert(`Only ${part.stock} units available in stock.`);
        return;
    }
    
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

window.changePartTarget = function(partId, oldTarget, selectElement) {
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
"""
    if '// --- Manual Part Form Logic ---' not in content:
        content = content.replace('function addPartToPlan(part, opts = {}) {', manual_logic + '\nfunction addPartToPlan(part, opts = {}) {')

    # 3. Rewrite addPartToPlan to use target and category
    new_add_part = """function addPartToPlan(part, opts = {}) {
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
}"""
    pattern_add_part = r"function addPartToPlan\(part, opts = \{\}\) \{.*?\n    return true;\n\}"
    content = re.sub(pattern_add_part, new_add_part, content, flags=re.DOTALL)

    # 4. Rewrite the target label in renderRepairPlan to be a dropdown
    render_find = r'<div class="text-\[10px\] text-slate-400 mt-0\.5 truncate">\s*For: \$\{escHTML\(target\)\} \(\$\{escHTML\(p\.category\)\}\)\$\{outOfStock \? \' <span class="text-red-500 ml-1 font-semibold">• Order needed</span>\' : \'\'\}\s*</div>'
    
    render_replace = """<div class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        For: 
                        <select class="bg-transparent border border-slate-200 rounded px-1 py-0.5 outline-none hover:border-blue-300 focus:border-blue-500" onchange="changePartTarget('${p.id}', '${escHTML(target)}', this)">
                            ${getDropdownOptionsHTML(target)}
                        </select>
                        ${outOfStock ? ' <span class="text-red-500 ml-1 font-semibold">• Order needed</span>' : ''}
                    </div>"""
    
    content = re.sub(render_find, render_replace, content)

    # 5. Add the blue badge for manual parts in renderRepairPlan
    badge_find = r'\$\{p\.isAuto \? `<span class="inline-flex items-center gap-1 bg-purple-50 text-purple-600 border-purple-200 px-1\.5 py-0\.5 rounded text-\[9px\] font-bold border uppercase tracking-wider">Auto-assigned</span>` : \'\'\}'
    badge_replace = """${p.isAuto ? `<span class="inline-flex items-center gap-1 bg-purple-50 text-purple-600 border-purple-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider">Auto-assigned</span>` : `<span class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border-blue-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider">Added by mechanic</span>`}"""
    
    content = re.sub(badge_find, badge_replace, content)

    # Wait, in the manual form we also need to allow changing the target of ANY part, including auto-assigned ones.
    # We added the dropdown inside renderRepairPlan.
    # Are we replacing the remove button correctly?
    # Because there might be duplicates (same part id, different target), we need to modify removePlanPart and updatePlanQty to also take target as parameter.
    
    qty_remove_find = r'onclick="updatePlanQty\(\'\$\{p\.id\}\', -1\)"(.*?)onclick="updatePlanQty\(\'\$\{p\.id\}\', 1\)"(.*?)onclick="removePlanPart\(\'\$\{p\.id\}\'\)"'
    qty_remove_replace = r'onclick="updatePlanQty(\'${p.id}\', \'${escHTML(target)}\', -1)"\1onclick="updatePlanQty(\'${p.id}\', \'${escHTML(target)}\', 1)"\2onclick="removePlanPart(\'${p.id}\', \'${escHTML(target)}\')"'
    
    content = re.sub(qty_remove_find, qty_remove_replace, content, flags=re.DOTALL)
    
    # 6. Update window.updatePlanQty and window.removePlanPart
    update_qty_find = r'window\.updatePlanQty = function\(id, delta\) \{.*?\}'
    update_qty_replace = """window.updatePlanQty = function(id, target, delta) {
    const item = repairPlanParts.find(p => p.id === id && p.target === target);
    if (item) {
        if (delta > 0 && item.qty >= item.stock && item.stock > 0) {
            alert(`Only ${item.stock} units available in stock.`);
            return;
        }
        if (item.qty + delta > 0) {
            item.qty += delta;
            renderRepairPlan();
            updatePlanTotals();
        }
    }
}"""
    content = re.sub(update_qty_find, update_qty_replace, content, flags=re.DOTALL)
    
    remove_part_find = r'window\.removePlanPart = function\(id\) \{.*?\}'
    remove_part_replace = """window.removePlanPart = function(id, target) {
    const idx = repairPlanParts.findIndex(p => p.id === id && p.target === target);
    if (idx !== -1) {
        repairPlanParts.splice(idx, 1);
        renderRepairPlan();
        updatePlanTotals();
    }
}"""
    content = re.sub(remove_part_find, remove_part_replace, content, flags=re.DOTALL)

    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    main()
