import re
content = open(r'c:\Users\prog3\Desktop\Moduli calcolo HTML\calcolatore_cuscinetti.html','r',encoding='utf-8').read()

# Extract a few thrust bearing entries to see their parameters
pattern = r'"(SKF_511\d+|FAG_511\d+|SKF_294\d+|FAG_294\d+|SKF_512\d+|FAG_512\d+)": \{[^}]+\}'
matches = re.findall(pattern, content)
# Show first few
i=0
for m in matches[:12]:
    full = re.search(r'"'+m+r'": \{[^}]+\}', content)
    if full:
        print(full.group())
        i+=1
