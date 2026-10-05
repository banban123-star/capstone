import re

with open('views/diagnostics.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Insert Customer Complaints
complaints_html = '''                <!-- Customer Complaints Reference -->
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Customer Complaint</label>
                    <div id="step2-complaints-container" class="flex flex-wrap gap-1.5">
                        <span class="text-xs text-slate-400 italic">None recorded</span>
                    </div>
                </div>

                <!-- Centralized Final Notes -->'''
text = text.replace('<!-- Centralized Final Notes -->', complaints_html)


# 2. Add Re-sync button
header_pattern = r'<div class="flex items-center justify-between gap-2">\s*<label class="block text-xs font-semibold text-slate-700">Required Parts &amp; Materials</label>\s*</div>'
header_new = '''<div class="flex items-center justify-between gap-2 mb-2">
                    <label class="block text-xs font-semibold text-slate-700">Required Parts &amp; Materials</label>
                    <button type="button" onclick="syncPlanFromDiagnosis(false)" class="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors flex items-center gap-1 border border-blue-200"><i class="ph-bold ph-arrows-clockwise"></i> Re-sync from diagnosis</button>
                </div>'''
text = re.sub(header_pattern, header_new, text)

with open('views/diagnostics.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
