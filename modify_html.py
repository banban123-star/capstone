import re

with open('views/diagnostics.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract customer complaints
complaints_pattern = r'''<div>\s*<label class="block text-\[11px\] font-bold text-slate-600 uppercase mb-1\.5">Customer Complaint <span class="normal-case font-medium text-slate-400">\(tap all that apply\)</span></label>\s*<div class="flex flex-wrap gap-1\.5" id="insp-complaints">.*?</div>\s*</div>'''
complaints_match = re.search(complaints_pattern, content, re.DOTALL)
complaints_html = complaints_match.group(0)

# Remove vehicle intake card entirely
intake_pattern = r'''<!-- Vehicle Intake -->\s*<div id="vehicle-intake-card" class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col p-5">.*?</div>\s*</div>\s*</div>\s*<!-- Next Button for Step 1 -->'''

def replacement(m):
    return '    </div>\n    \n    <!-- Next Button for Step 1 -->'

content = re.sub(intake_pattern, replacement, content, flags=re.DOTALL)

# Insert complaints at the beginning of Step 1
complaints_card = f'''    <!-- 1. Customer Complaint -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h2 id="title-customer-complaint" class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">1. Customer Complaint</h2>
        {complaints_html}
    </div>

'''

# Change title of Inspection Setup to 2.
content = content.replace('<!-- 1. Inspection Setup -->', '<!-- 2. Inspection Setup -->')
content = content.replace('<h2 id="title-inspection-setup" class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">1. Inspection Setup</h2>', '<h2 id="title-inspection-setup" class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">2. Inspection Setup</h2>')

# Change title of ECU to 3.
content = content.replace('<!-- 2. ECU / OBD Diagnostic (Hidden by Default) -->', '<!-- 3. ECU / OBD Diagnostic (Hidden by Default) -->')
content = content.replace('<h2 id="title-ecu-scan" class="text-sm font-bold text-slate-800 uppercase tracking-wider">2. ECU / OBD Diagnostic</h2>', '<h2 id="title-ecu-scan" class="text-sm font-bold text-slate-800 uppercase tracking-wider">3. ECU / OBD Diagnostic</h2>')

# Change title of Physical to 4.
content = content.replace('<!-- 3. Physical Inspection Log (Visible by Default) -->', '<!-- 4. Physical Inspection Log (Visible by Default) -->')
content = content.replace('<h2 id="title-physical-inspection" class="text-sm font-bold text-slate-800 uppercase tracking-wider">3. Physical Inspection Log</h2>', '<h2 id="title-physical-inspection" class="text-sm font-bold text-slate-800 uppercase tracking-wider">4. Physical Inspection Log</h2>')


# Find insertion point
insert_marker = '<!-- ================= STEP 1: DIAGNOSE ================= -->\n    <div id="step-1-diagnose" class="flex flex-col gap-6">\n'
content = content.replace(insert_marker, insert_marker + complaints_card)

with open('views/diagnostics.html', 'w', encoding='utf-8') as f:
    f.write(content)
