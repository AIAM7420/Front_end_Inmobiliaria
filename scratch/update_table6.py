import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace 2xl with xl in the td classes
content = content.replace(
    'hidden 2xl:table-cell',
    'hidden xl:table-cell'
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Aligned td classes")
