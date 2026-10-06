import re

with open('views/inventory.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Mobile CSS overrides
css_to_add = """
    /* Add New Part Modal - Mobile Fit */
    body.mobile-app #modal-add-part {
        position: absolute !important;
        padding: 0 !important;
    }
    body.mobile-app #add-part-backdrop {
        position: absolute !important;
    }
    body.mobile-app #add-part-content {
        height: 100% !important;
        max-height: 100% !important;
        border-radius: 0 !important;
    }
    body.mobile-app #modal-add-part .grid {
        grid-template-columns: 1fr !important;
    }
    body.mobile-app #modal-add-part input,
    body.mobile-app #modal-add-part select {
        height: 44px !important;
        font-size: 16px !important;
    }
    body.mobile-app #modal-add-part .border-t {
        display: flex !important;
        gap: 0.75rem !important;
    }
    body.mobile-app #modal-add-part .border-t button {
        flex: 1 !important;
        width: 100% !important;
        height: 44px !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        justify-content: center !important;
    }
"""

if "Add New Part Modal - Mobile Fit" not in content:
    content = content.replace("</style>", css_to_add + "</style>")

# 2. Wrap Cost and Selling Price
cost_selling_target = """                      <div>
                          <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">Cost Price (₱)</label>
                          <input type="number" placeholder="0.00" class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-semibold">
                      </div>
                      <div>
                          <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">Selling Price (₱)</label>
                          <input type="number" placeholder="0.00" class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-semibold text-blue-700">
                      </div>"""

cost_selling_replace = """                      <div class="sm:col-span-2 grid grid-cols-2 gap-4">
                          <div>
                              <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">Cost Price (₱)</label>
                              <input type="number" placeholder="0.00" class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-semibold">
                          </div>
                          <div>
                              <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">Selling Price (₱)</label>
                              <input type="number" placeholder="0.00" class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-semibold text-blue-700">
                          </div>
                      </div>"""

def escape_and_sub(t, r, c):
    t_clean = re.sub(r'\s+', '', t)
    c_clean = re.sub(r'\s+', '', c)
    if t_clean in c_clean:
        pattern = r'\s+'.join(re.escape(w) for w in t.split())
        return re.sub(pattern, r, c, count=1)
    return c

content = escape_and_sub(cost_selling_target, cost_selling_replace, content)

with open('views/inventory.html', 'w', encoding='utf-8') as f:
    f.write(content)

