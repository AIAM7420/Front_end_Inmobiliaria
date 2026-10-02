import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Fix onClose
onclose_search = """        onClose={() => {
          if (isCreating && isWizardDirty) {
            setShowCancelModal(true);
          } else {
            if (isCreating) setSelectedId(null);
            setViewMode('list');
          }
        }}"""
onclose_replace = """        onClose={() => {
          if (isCreating && isWizardDirty) {
            setShowCancelModal(true);
          } else {
            if (isCreating) {
              setSelectedId(null);
              setWizardStep(0);
            }
            setViewMode('list');
          }
        }}"""
content = content.replace(onclose_search, onclose_replace)

# Fix onConfirm
onconfirm_search = """        onConfirm={() => {
          setShowCancelModal(false);
          setIsWizardDirty(false);
          setSelectedId(null);
          setViewMode('list');
        }}"""
onconfirm_replace = """        onConfirm={() => {
          setShowCancelModal(false);
          setIsWizardDirty(false);
          setSelectedId(null);
          setWizardStep(0);
          setViewMode('list');
        }}"""
content = content.replace(onconfirm_search, onconfirm_replace)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Added setWizardStep(0) to reset on close")
