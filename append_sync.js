const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf-8');

const additions = `
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

window.getSuggestedParts = function(diagnosis = inspectionState) {
    const list = [];
    const add = (id, target, category, level, qty) => {
        const part = mockInventory.find(p => p.id === id);
        if (!part) return;
        const q = Math.max(1, qty || 1);
        let s = list.find(x => x.id === id && x.target === target);
        if (!s) {
            s = { id, qty: q, target, category, level, checked: level !== 'watch' };
            list.push(s);
        } else {
            s.qty = Math.max(s.qty, q);
        }
    };

    // 1. ECU / OBD codes
    const dtcVisible = document.getElementById('toggle-ecu')?.checked !== false && !document.getElementById('ecu-scan-card')?.classList.contains('hidden');
    if (dtcVisible) {
        document.querySelectorAll('#dtc-results-container tbody tr').forEach(tr => {
            const cells = tr.querySelectorAll('td');
            const code = cells[0]?.textContent.trim();
            if (!code) return;
            
            // from linkedDTCs in mockInventory
            mockInventory.forEach(p => {
                if (p.linkedDTCs && p.linkedDTCs.includes(code)) {
                    add(p.id, \`DTC \${code}\`, 'ECU / OBD', 'fix', 1);
                }
            });
            // from partsForDtc
            if (typeof partsForDtc === 'function') {
                const found = partsForDtc(code);
                found.forEach(f => add(f.id, \`DTC \${code}\`, 'ECU / OBD', 'fix', f.qty));
            }
        });
    }

    // 2. Physical inspection items mapped via Auto-Assign
    if (typeof inspectionSections !== 'undefined' && typeof getInspItem === 'function') {
        inspectionSections.forEach(sec => {
            sec.items.forEach(item => {
                const st = getInspItem(item.id);
                if (st.status === 'fix' || st.status === 'watch') {
                    const linkedParts = mockInventory.filter(p => p.linkedInspectionItems && p.linkedInspectionItems.some(l => l.itemId === item.id));
                    linkedParts.forEach(p => {
                        const link = p.linkedInspectionItems.find(l => l.itemId === item.id);
                        add(p.id, item.label, sec.title, st.status, link.qty);
                    });
                }
            });
        });
    }

    return list;
};

window.removedAutoSuggestions = window.removedAutoSuggestions || new Set();

window.syncPlanFromDiagnosis = function(firstTime = false, restoreRemoved = false) {
    if (firstTime && repairPlanParts.length > 0) return; // Only auto-assign once if first time
    
    if (restoreRemoved) {
        window.removedAutoSuggestions.clear();
    }
    
    const complaintsContainer = document.getElementById('step2-complaints-container');
    if (complaintsContainer) {
        if (inspectionState.intake.complaints && inspectionState.intake.complaints.length > 0) {
            complaintsContainer.innerHTML = inspectionState.intake.complaints.map(c => 
                \`<span class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200"><i class="ph-fill ph-warning-circle text-amber-500"></i> \${escHTML(c)}</span>\`
            ).join('');
            complaintsContainer.parentElement.classList.remove('hidden');
        } else {
            complaintsContainer.parentElement.classList.add('hidden');
        }
    }

    const suggestions = window.getSuggestedParts();
    
    // 1. Identify unlinked fixes
    const unlinkedFixes = [];
    if (typeof inspectionSections !== 'undefined' && typeof getInspItem === 'function') {
        inspectionSections.forEach(sec => {
            sec.items.forEach(item => {
                const st = getInspItem(item.id);
                if (st.status === 'fix') {
                    const hasLink = mockInventory.some(p => p.linkedInspectionItems && p.linkedInspectionItems.some(l => l.itemId === item.id));
                    if (!hasLink) unlinkedFixes.push(item.label);
                }
            });
        });
    }
    window.unlinkedFixesList = unlinkedFixes;
    
    // 2. Add suggestions
    suggestions.forEach(r => {
        if (r.level === 'fix' || r.level === 'ecu' || r.level === 'watch') {
            const part = mockInventory.find(p => p.id === r.id);
            if (part && r.checked) {
                let target = r.target || 'Other / General';
                let category = r.category || 'Other / General';
                
                if (window.removedAutoSuggestions.has(part.id + '|' + target)) return; // Skipped intentionally removed
                
                const existing = repairPlanParts.find(p => p.id === r.id && p.target === target);
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
                }
            }
        }
    });
    
    // 3. Mark obsolete auto-assigned parts (No longer needed)
    repairPlanParts.forEach(p => {
        if (p.isAuto) {
            const stillNeeded = suggestions.some(s => s.id === p.id && s.target === p.target && s.checked);
            p.obsolete = !stillNeeded;
        }
    });
    
    planReviewed = true;
    renderRepairPlan();
    updatePlanTotals();
}

// Ensure function syncPlanFromDiagnosis delegates to window.syncPlanFromDiagnosis
function syncPlanFromDiagnosis(firstTime, restoreRemoved) {
    window.syncPlanFromDiagnosis(firstTime, restoreRemoved);
}

function getSuggestedParts(diag) {
    return window.getSuggestedParts(diag);
}
`;

content += '\n' + additions;

fs.writeFileSync('script.js', content, 'utf-8');
console.log("Successfully appended missing functions.");

