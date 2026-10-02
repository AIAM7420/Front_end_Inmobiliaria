import re
with open('scratch/user_prompt.txt', 'r', encoding='utf-8') as f:
    content = f.read()
match = re.search(r'import React.*?export const AsesorInventoryView.*?;\s*}\s*;\s*};\s*', content, re.DOTALL)
if match:
    with open('src/components/views/asesor/AsesorInventoryView.tsx', 'w', encoding='utf-8') as out:
        out.write(match.group(0))
    print('Extracted original code')
else:
    print('Regex failed')
