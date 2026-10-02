import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

create_search = """  const handleCreateNew = () => {
    setSelectedId(null);
    setWizardDraft(null);
    setViewMode('create');
  };"""
create_replace = """  const handleCreateNew = () => {
    setSelectedId(null);
    setWizardDraft(null);
    setWizardStep(0);
    setIsWizardDirty(false);
    setViewMode('create');
  };"""

content = content.replace(create_search, create_replace)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated handleCreateNew")
