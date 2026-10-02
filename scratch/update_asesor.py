import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add wizardStep state
content = re.sub(
    r"(const \[wizardDraft, setWizardDraft\].*?;)",
    r"\1\n  const [wizardStep, setWizardStep] = useState(0);",
    content
)

# 2. Modify sideTitle
side_title_replacement = """  const WIZARD_TITLES = ['¿Qué tipo de operación es?', 'Tipo de Inmueble', 'Ubicación y Precio', 'Características', 'Multimedia'];
  const sideTitle = isCreating
    ? WIZARD_TITLES[wizardStep]
    : isCreatingVisual"""
content = re.sub(
    r"const sideTitle = isCreating\s*\n\s*\? undefined\s*\n\s*: isCreatingVisual",
    side_title_replacement,
    content
)

# 3. Add onStepChange to PropertyCreatorWizard
content = re.sub(
    r"(<PropertyCreatorWizard[^>]*?isSubmitting=\{createMutation\.isPending\})",
    r"\1\n          onStepChange={setWizardStep}",
    content
)

# 4. Remove hideDesktopCloseButton and hideMobileCloseButton from SplitViewLayout
content = re.sub(
    r"\s*hideDesktopCloseButton=\{isCreating\}",
    "",
    content
)
content = re.sub(
    r"\s*hideMobileCloseButton=\{isCreating\}",
    "",
    content
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated AsesorInventoryView.tsx")
