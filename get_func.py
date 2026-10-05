import re
with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'function refreshInspectionSummary\(\) \{.*?\n\}', content, re.DOTALL)
if m:
    with open('out.txt', 'w', encoding='utf-8') as out:
        out.write(m.group(0))
