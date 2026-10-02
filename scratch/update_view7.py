import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'title="[^"]+"\s*message="[^"]+"\s*confirmText="[^"]+"\s*cancelText="Continuar editando"\s*confirmVariant="danger"'
replacement = """title="¿Descartar publicación?"
        message="Tienes información sin guardar en este formulario. Si sales ahora, perderás tu progreso."
        confirmText="Sí, salir"
        cancelText="Continuar editando"
        confirmVariant="danger\""""

content = re.sub(pattern, replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Regex string replace done")
