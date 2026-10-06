import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the inner return `...` of the mobile map in renderInventory

replacement_map = """
            if (!window.expandedInvCards) window.expandedInvCards = new Set();
            const isOpen = window.expandedInvCards.has(item.id);

            return `
                <tr class="block w-full">
                    <td colspan="5" class="block w-full p-0 border-0">
                        <div class="bg-white border-b border-slate-100 flex flex-col p-3.5 ${rowOpacity}">
                            <div class="flex items-center justify-between gap-3 min-h-[50px] cursor-pointer" onclick="toggleInvCard('${item.id}')">
                                <div class="w-12 h-12 rounded-lg shrink-0 overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                                    <img src="${item.img}" class="w-full h-full object-cover">
                                </div>
                                <div class="flex-1 min-w-0 flex flex-col justify-center">
                                    <div class="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">${item.name}</div>
                                    <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <span class="font-bold text-slate-700 text-xs">₱${item.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                        ${stockBadgeMobile}
                                    </div>
                                </div>
                                <div id="inv-chevron-${item.id}" class="w-11 h-11 rounded-full text-slate-400 flex items-center justify-center shrink-0 transition-transform duration-200" style="transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}">
                                    <i class="ph-bold ph-caret-down text-lg"></i>
                                </div>
                            </div>
                            <div id="inv-wrap-${item.id}" style="display: grid; transition: grid-template-rows 200ms ease-out; grid-template-rows: ${isOpen ? '1fr' : '0fr'};">
                                <div style="overflow: hidden;">
                                    <div class="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2 text-sm">
                                        <div class="grid grid-cols-2 gap-y-2 gap-x-4">
                                            <div class="text-slate-500 text-xs">SKU</div>
                                            <div class="font-semibold text-slate-800 text-xs text-right truncate">${item.sku}</div>
                                            
                                            <div class="text-slate-500 text-xs">Compatibility</div>
                                            <div class="font-semibold text-slate-800 text-xs text-right truncate">${item.comp}</div>
                                            
                                            <div class="text-slate-500 text-xs">Category</div>
                                            <div class="font-semibold text-slate-800 text-xs text-right truncate">${item.category}</div>
                                            
                                            <div class="text-slate-500 text-xs">Location</div>
                                            <div class="font-semibold text-slate-800 text-xs text-right truncate">${item.loc}</div>
                                            
                                            <div class="text-slate-500 text-xs">Reserved</div>
                                            <div class="font-semibold text-slate-800 text-xs text-right truncate">${item.reserved}</div>
                                        </div>
                                        
                                        ${item.dtc ? `
                                        <div class="mt-1">
                                            <div class="text-slate-500 text-xs mb-1">Linked DTC</div>
                                            <div class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200"><i class="ph-bold ph-cpu text-blue-500"></i> ${item.dtc}</div>
                                        </div>` : ''}
                        
                                        <div class="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                                            <button class="flex-1 text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors"><i class="ph-bold ph-pencil-simple text-sm"></i> Edit</button>
                                            
                                            <button ${item.stock === 0 ? 'disabled' : `onclick="openWalkInModalInv('${item.name}', '${item.price.toFixed(2)}')" `} class="flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors ${item.stock === 0 ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent'}"><i class="ph-bold ph-shopping-cart-simple text-sm"></i> Walk-in Sale</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            `;"""

old_pattern = r"return `\s*<tr class=\"block w-full\">\s*<td colspan=\"5\" class=\"block w-full p-0 border-0\">\s*<div class=\"bg-white p-3.5 border-b border-slate-100 flex items-center justify-between min-h-\[64px\] gap-3 \$\{rowOpacity\}\">.*?</td>\s*</tr>\s*`;"
content = re.sub(old_pattern, replacement_map.strip().replace('\\', '\\\\'), content, flags=re.DOTALL)

# Add toggleInvCard at the end
toggle_fn = """
window.toggleInvCard = function(id) {
    if (!window.expandedInvCards) window.expandedInvCards = new Set();
    const wrap = document.getElementById(`inv-wrap-${id}`);
    const chevron = document.getElementById(`inv-chevron-${id}`);
    
    if (window.expandedInvCards.has(id)) {
        window.expandedInvCards.delete(id);
        if (wrap) wrap.style.gridTemplateRows = '0fr';
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    } else {
        window.expandedInvCards.add(id);
        if (wrap) wrap.style.gridTemplateRows = '1fr';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
};
"""
content += toggle_fn

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Inventory cards expanded state added.")

