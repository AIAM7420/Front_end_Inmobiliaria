import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\organisms\PropertyCreatorWizard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Props Interface
prop_interface_search = """export interface PropertyCreatorWizardProps {
  onCancel: () => void;
  onSave: (dto: PropiedadCrearDTO) => void;
  onProceedToVisual?: (dto: PropiedadCrearDTO) => void;
  initialData?: Partial<PropiedadCrearDTO>;
  isSubmitting?: boolean;
  onStepChange?: (step: number) => void;
}"""
prop_interface_replace = """export interface PropertyCreatorWizardProps {
  onCancel: () => void;
  onSave: (dto: PropiedadCrearDTO) => void;
  onProceedToVisual?: (dto: PropiedadCrearDTO) => void;
  initialData?: Partial<PropiedadCrearDTO>;
  isSubmitting?: boolean;
  onStepChange?: (step: number) => void;
  onDirtyChange?: (isDirty: boolean) => void;
}"""
content = content.replace(prop_interface_search, prop_interface_replace)

# 2. Add to destructuring
destructure_search = """  isSubmitting = false,
  onStepChange,
}) => {"""
destructure_replace = """  isSubmitting = false,
  onStepChange,
  onDirtyChange,
}) => {"""
content = content.replace(destructure_search, destructure_replace)

# 3. Add useEffect to track dirty state
effect_search = """  const update = (key: string, val: any) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };"""
effect_replace = """  const update = (key: string, val: any) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  React.useEffect(() => {
    if (onDirtyChange) {
      const isDirty = formData.operationType !== '' || formData.propertyType !== '' || formData.title !== '' || formData.location !== '';
      onDirtyChange(isDirty);
    }
  }, [formData.operationType, formData.propertyType, formData.title, formData.location, onDirtyChange]);"""
content = content.replace(effect_search, effect_replace)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated PropertyCreatorWizard.tsx")
