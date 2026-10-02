import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\organisms\PropertyCreatorWizard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Change max-w-md to max-w-lg everywhere to use the new 50% width
content = content.replace("max-w-md", "max-w-lg w-full")

# 2. Step 2: Ubicacion adjustments
content = content.replace('h-[180px]', 'h-[140px]')
# Reduce gap-3 to gap-2 in the container (only the one inside renderStepUbicacion)
# We can just change all `gap-3` to `gap-2.5` globally, or do it carefully.
# Actually let's just use regex for the grids.

# 3. Step 3: Caracteristicas adjustments
# Replace the beds/baths grid and sqft input with a single grid-cols-3
old_beds_block = """        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Recámaras"
            leftIcon={<Bed className="w-5 h-5 text-gray-400" />}
            value={formData.beds}
            onChange={(e) => update('beds', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Baños"
            leftIcon={<Bath className="w-5 h-5 text-gray-400" />}
            value={formData.baths}
            onChange={(e) => update('baths', e.target.value)}
          />
        </div>
        <Input
          type="number"
          placeholder="Metros cuadrados (m²)"
          leftIcon={<Maximize className="w-5 h-5 text-gray-400" />}
          value={formData.sqft}
          onChange={(e) => update('sqft', e.target.value)}
        />"""

new_beds_block = """        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            placeholder="Recámaras"
            leftIcon={<Bed className="w-5 h-5 text-gray-400" />}
            value={formData.beds}
            onChange={(e) => update('beds', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Baños"
            leftIcon={<Bath className="w-5 h-5 text-gray-400" />}
            value={formData.baths}
            onChange={(e) => update('baths', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Área (m²)"
            leftIcon={<Maximize className="w-5 h-5 text-gray-400" />}
            value={formData.sqft}
            onChange={(e) => update('sqft', e.target.value)}
          />
        </div>"""

content = content.replace(old_beds_block, new_beds_block)

# 4. Amenities grid: gap-3 -> gap-2
old_amenities = 'grid grid-cols-3 gap-3'
new_amenities = 'grid grid-cols-3 gap-2'
content = content.replace(old_amenities, new_amenities)

# 5. Step 4: Multimedia adjustments
content = content.replace('min-h-[220px]', 'min-h-[160px]')

# 6. Global spacing reduction in the main flex cols
content = content.replace('flex-col gap-3 shrink-0', 'flex-col gap-2 shrink-0')
content = content.replace('flex-col gap-5 shrink-0', 'flex-col gap-3 shrink-0')
content = content.replace('mb-6 shrink-0 text-center', 'mb-2 shrink-0 text-center')
content = content.replace('mb-4 shrink-0 text-center', 'mb-2 shrink-0 text-center')

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated PropertyCreatorWizard.tsx")
