import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<table className="w-full text-left border-collapse min-w-[900px] h-fit">' in line:
        lines[i] = '                  <table className={`w-full text-left border-collapse h-fit ${isOpen ? \'min-w-full\' : \'min-w-[900px]\'}`}>\n'
    
    if 'text-center">Rec' in line and '<th' in line:
        lines[i] = '                        <th className={`p-4 font-bold text-center ${isOpen ? \'hidden xl:table-cell\' : \'\'}`}>Recámaras</th>\n'
        
    elif 'text-center">Ba' in line and '<th' in line:
        lines[i] = '                        <th className={`p-4 font-bold text-center ${isOpen ? \'hidden xl:table-cell\' : \'\'}`}>Baños</th>\n'
        
    elif 'text-center">A' in line and 'rea' in line and '<th' in line:
        lines[i] = '                        <th className={`p-4 font-bold text-center ${isOpen ? \'hidden xl:table-cell\' : \'\'}`}>Área</th>\n'
        
    # Also fix the <td> for cells just in case I missed them or they were using 2xl
    elif '{prop.beds}</span>' in line and '<td' in line:
        lines[i] = '                          <td className={`p-4 align-middle text-center ${isOpen ? \'hidden xl:table-cell\' : \'\'}`}>\n'
    elif '{prop.baths}</span>' in line and '<td' in line:
        lines[i] = '                          <td className={`p-4 align-middle text-center ${isOpen ? \'hidden xl:table-cell\' : \'\'}`}>\n'
    elif '{prop.sqft}m²</span>' in line and '<td' in line:
        lines[i] = '                          <td className={`p-4 align-middle text-center ${isOpen ? \'hidden xl:table-cell\' : \'\'}`}>\n'

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Fixed table compress logic")
