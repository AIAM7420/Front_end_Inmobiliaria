import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the responsive hiding with strict hiding when isOpen is true
content = content.replace("isOpen ? 'hidden xl:table-cell' : ''", "isOpen ? 'hidden' : ''")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated table column visibility logic")
