import re
with open('views/diagnostics.html', 'r', encoding='utf-8') as f:
    text = f.read()

div_open = len(re.findall(r'<div\b', text))
div_close = len(re.findall(r'</div\b', text))
print(f"Open: {div_open}, Close: {div_close}")
