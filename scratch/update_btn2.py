import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the button usage
search_btn = """              <Button
                variant="accent"
                className="h-[44px] !rounded-[14px] shadow-glow shrink-0 font-bold px-4 flex items-center gap-2 whitespace-nowrap"
                title="Añadir Propiedad"
                onClick={handleCreateNew}
              >
                <Plus className="w-5 h-5 shrink-0" strokeWidth={2} />
                Nueva Propiedad
              </Button>"""

# Using the icon prop instead of children for the Plus
replace_btn = """              <Button
                variant="accent"
                className="h-[44px] !rounded-[14px] shadow-glow shrink-0 font-bold px-4 flex flex-row items-center justify-center gap-2 whitespace-nowrap"
                title="Añadir Propiedad"
                onClick={handleCreateNew}
                icon={<Plus className="w-5 h-5 shrink-0" strokeWidth={2} />}
              >
                Nueva Propiedad
              </Button>"""

if search_btn in content:
    content = content.replace(search_btn, replace_btn)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed button via exact match")
else:
    # Try regex if exact match fails due to encoding or spacing
    import re
    # We look for the <Button ... onClick={handleCreateNew}> block
    regex = r'<Button\s+variant="accent"\s+className="h-\[44px\][^"]*"\s+title="A[^"]+"\s+onClick=\{handleCreateNew\}\s*>\s*<Plus[^>]+>\s*Nueva Propiedad\s*</Button>'
    
    replace_btn_regex = """<Button
                variant="accent"
                className="h-[44px] !rounded-[14px] shadow-glow shrink-0 font-bold px-4 flex flex-row items-center justify-center gap-2 whitespace-nowrap"
                title="Añadir Propiedad"
                onClick={handleCreateNew}
                icon={<Plus className="w-5 h-5 shrink-0" strokeWidth={2} />}
              >
                Nueva Propiedad
              </Button>"""
    content = re.sub(regex, replace_btn_regex, content)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed button via regex")

