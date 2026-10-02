import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<th' in line and 'rea</' in line:
        lines[i] = '                        <th className={`p-4 font-bold text-center ${isOpen ? \'hidden xl:table-cell\' : \'\'}`}>Área</th>\n'

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Fixed Area header")
