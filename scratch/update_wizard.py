import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\organisms\PropertyCreatorWizard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the HEADER block
header_regex = r"\{\/\* HEADER \(10%\) \*\/\}.*?\{\/\* CONTENT \(80%\) \*\/\}"
replacement = """{/* TIMELINE */}
      <div className="pt-4 pb-4 shrink-0 flex justify-center border-b border-gray-100 dark:border-white/10">
         <StepIndicator steps={STEP_LABELS} currentStep={step} className="max-w-[300px] w-full" />
      </div>

      {/* CONTENT (80%) */}"""

content = re.sub(header_regex, replacement, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated PropertyCreatorWizard.tsx")
