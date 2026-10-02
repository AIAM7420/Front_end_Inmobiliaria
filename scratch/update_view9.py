import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the PropertyCreatorWizard instantiation
pattern = r"<PropertyCreatorWizard\s*initialData=\{wizardDraft \|\| undefined\}\s*onCancel=\{\(\) => \{ setViewMode\('list'\); setSelectedId\(null\); \}\}"
replacement = """<PropertyCreatorWizard
          initialData={wizardDraft || undefined}
          onDirtyChange={setIsWizardDirty}
          onCancel={() => {
            if (isWizardDirty) {
              setShowCancelModal(true);
            } else {
              setSelectedId(null);
              setWizardStep(0);
              setViewMode('list');
            }
          }}"""

content = re.sub(pattern, replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated PropertyCreatorWizard instantiation")
