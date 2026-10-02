import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "Descartar publicaci" in line:
        lines[i] = '        title="¿Descartar publicación?"\n'
    elif "Tienes informaci" in line:
        lines[i] = '        message="Tienes información sin guardar en este formulario. Si sales ahora, perderás tu progreso."\n'
    elif "salir" in line and "confirmText" in line:
        lines[i] = '        confirmText="Sí, salir"\n'

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Replaced lines directly")
