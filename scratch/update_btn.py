import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the button class
search_btn = 'className="h-[44px] !rounded-[14px] shadow-glow shrink-0 font-bold px-4 flex items-center gap-2"'
replace_btn = 'className="h-[44px] !rounded-[14px] shadow-glow shrink-0 font-bold px-4 flex items-center gap-2 whitespace-nowrap"'

content = content.replace(search_btn, replace_btn)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Added whitespace-nowrap to button")
