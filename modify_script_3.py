import re

with open('script.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove auto-assign button
pattern = r'<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">\s*<button type="button" data-insp="to-findings".*?</button>\s*<button type="button" data-insp="auto-assign".*?</button>\s*</div>'

new_buttons = '''<div class="grid grid-cols-1 gap-2 pt-1">
                    <button type="button" data-insp="to-findings" class="min-h-[48px] rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                        <i class="ph-bold ph-note-pencil text-lg"></i> Add to Final Findings
                    </button>
                </div>'''

text = re.sub(pattern, new_buttons, text, flags=re.DOTALL)

# 2. Rename buildDiagnosisSuggestions to getSuggestedParts
text = text.replace('function buildDiagnosisSuggestions()', 'function getSuggestedParts(diagnosis = inspectionState)')
text = text.replace('buildDiagnosisSuggestions()', 'getSuggestedParts()')

# 3. Add updateSharedDiagnosis to saveInspectionState
old_save = '''function saveInspectionState() {
    try { localStorage.setItem(INSPECTION_STORAGE_KEY, JSON.stringify(inspectionState)); } catch (err) { /* ignore quota errors */ }
}'''

new_save = '''function updateSharedDiagnosis() {
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
}'''

text = text.replace(old_save, new_save)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
