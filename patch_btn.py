import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    const btnWrap = document.getElementById('inv-btn-wrap');
    if (btnWrap) {
        const canAutoAssign = window.can('inventory.autoAssign');
        let html = '';
        if (canAutoAssign) {
            html += `<button onclick="openAutoAssignLinks()" class="flex-1 lg:flex-none bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                <i class="ph-bold ph-magic-wand"></i> Auto Assign
            </button>`;
        }
        if (canRestock) {
            html += `<button onclick="openRestockModal()" class="flex-1 lg:flex-none bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                <i class="ph-bold ph-arrows-clockwise"></i> Restock Items
            </button>`;
        }
        if (canAdd) {
            html += `<button onclick="openAddPartModal()" class="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                <i class="ph-bold ph-plus"></i> Add New Part
            </button>`;
        }
        btnWrap.innerHTML = html;
        btnWrap.classList.toggle('hidden', html === '');
    }"""

replacement = """    const btnWrap = document.getElementById('inv-btn-wrap');
    if (btnWrap) {
        const canAutoAssign = window.can('inventory.autoAssign');
        let html = '';
        
        if (isMobile) {
            btnWrap.className = 'w-full shrink-0 flex flex-col gap-2 mt-1';
            
            let topButtons = [];
            if (canAutoAssign) {
                topButtons.push(`<button onclick="openAutoAssignLinks()" class="flex-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 h-[44px] rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"><i class="ph-bold ph-magic-wand"></i> Auto Assign</button>`);
            }
            if (canRestock) {
                topButtons.push(`<button onclick="openRestockModal()" class="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 h-[44px] rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"><i class="ph-bold ph-arrows-clockwise"></i> Restock Items</button>`);
            }
            
            if (topButtons.length > 0) {
                html += `<div class="flex gap-2 w-full">${topButtons.join('')}</div>`;
            }
            
            if (canAdd) {
                html += `<button onclick="openAddPartModal()" class="w-full bg-blue-600 hover:bg-blue-700 text-white h-[44px] rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"><i class="ph-bold ph-plus"></i> Add New Part</button>`;
            }
            
        } else {
            btnWrap.className = 'flex gap-2 w-full lg:w-auto shrink-0';
            if (canAutoAssign) {
                html += `<button onclick="openAutoAssignLinks()" class="flex-1 lg:flex-none bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <i class="ph-bold ph-magic-wand"></i> Auto Assign
                </button>`;
            }
            if (canRestock) {
                html += `<button onclick="openRestockModal()" class="flex-1 lg:flex-none bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <i class="ph-bold ph-arrows-clockwise"></i> Restock Items
                </button>`;
            }
            if (canAdd) {
                html += `<button onclick="openAddPartModal()" class="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <i class="ph-bold ph-plus"></i> Add New Part
                </button>`;
            }
        }
        
        btnWrap.innerHTML = html;
        btnWrap.classList.toggle('hidden', html === '');
    }"""

def escape_for_regex(s):
    # Escape special regex chars, but convert tabs/spaces to \s+
    s = re.escape(s)
    # allow flexible whitespace for spaces and newlines
    s = re.sub(r'\\\s', r'\\s*', s)
    return s

pattern = escape_for_regex(target)
# Make it non-greedy on spaces to be safer, actually re.sub is fine if we just match literal strings
# Let's just use string replace after normalizing whitespace
def normalize(s):
    return re.sub(r'\s+', '', s)

if normalize(target) in normalize(content):
    # We can't easily replace if we only normalize, so let's do a smart regex
    # Wait, the exact string match might work if whitespace is exactly the same
    if target in content:
        content = content.replace(target, replacement)
        print("Replaced exactly.")
    else:
        # Build regex
        import ast
        # since it failed exact, maybe just use simple find/replace on lines
        # or we just re.sub with \s+
        regex_pattern = r'\s+'.join(re.escape(word) for word in target.split())
        content = re.sub(regex_pattern, replacement, content, count=1)
        print("Replaced with regex.")
        
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(content)
else:
    print("Target not found.")

