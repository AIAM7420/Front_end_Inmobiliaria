import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("ADescartar publicaciA3n?", "¿Descartar publicación?")
content = content.replace("informaciA3n", "información")
content = content.replace("perderAs", "perderás")
content = content.replace("SA-, salir", "Sí, salir")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed encoding in AsesorInventoryView.tsx")
