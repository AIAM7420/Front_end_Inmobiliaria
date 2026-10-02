import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

oncancel_search = """            onCancel={() => { 
              if (isWizardDirty) {
                setShowCancelModal(true);
              } else {
                setViewMode('list'); 
                setSelectedId(null); 
              }
            }}"""
oncancel_replace = """            onCancel={() => { 
              if (isWizardDirty) {
                setShowCancelModal(true);
              } else {
                setViewMode('list'); 
                setSelectedId(null); 
                setWizardStep(0);
              }
            }}"""
content = content.replace(oncancel_search, oncancel_replace)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated onCancel to reset wizard step")
