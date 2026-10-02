import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace sideTitle logic
# const sideTitle = isCreating
#    ? 'Crear Publicación'
#    : isCreatingVisual
import re
content = re.sub(
    r"const sideTitle = isCreating\s*\n\s*\? 'Crear Publicación'\s*\n\s*: isCreatingVisual",
    "const sideTitle = isCreating\n    ? undefined\n    : isCreatingVisual",
    content
)

# 2. Add hideDesktopCloseButton and hideMobileCloseButton to SplitViewLayout
# <SplitViewLayout
#   isOpen={isOpen}
#   onClose={() => {

content = re.sub(
    r"(<SplitViewLayout\s*\n\s*isOpen=\{isOpen\})",
    r"\1\n        hideDesktopCloseButton={isCreating}\n        hideMobileCloseButton={isCreating}",
    content
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Modified AsesorInventoryView.tsx")
