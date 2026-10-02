import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\organisms\PropertyCreatorWizard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

effect_search = r"const update = \(field: string, value: any\) =>\s*setFormData\(prev => \(\{ \.\.\.prev, \[field\]: value \}\)\);"
effect_replace = """const update = (field: string, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  React.useEffect(() => {
    if (onDirtyChange) {
      const isDirty = formData.operationType !== '' || formData.propertyType !== '' || formData.title !== '' || formData.location !== '';
      onDirtyChange(isDirty);
    }
  }, [formData.operationType, formData.propertyType, formData.title, formData.location, onDirtyChange]);"""

content = re.sub(effect_search, effect_replace, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Added useEffect to PropertyCreatorWizard.tsx")
