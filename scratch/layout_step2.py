import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\organisms\PropertyCreatorWizard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Extract the renderStepUbicacion block
start_idx = content.find("const renderStepUbicacion = () => (")
end_idx = content.find("  const renderStepCaracteristicas = () => (")

old_block = content[start_idx:end_idx]

new_block = """  const renderStepUbicacion = () => (
    <div className="w-full max-w-lg w-full mx-auto flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 justify-center py-4">
      <div className="mb-2 shrink-0 text-center">
        <p className="text-sm text-gray-500 mt-2">Configura los datos principales de la propiedad.</p>
      </div>
      <div className="flex flex-col gap-3 shrink-0">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Título (ej. Residencia en El Campestre)"
              value={formData.title}
              onChange={(e) => update('title', e.target.value)}
            />
            <Input
              placeholder="Dirección completa"
              leftIcon={<MapPin className="w-5 h-5 text-gray-400" />}
              value={formData.location}
              onChange={(e) => update('location', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Precio (MXN)"
              leftIcon={<DollarSign className="w-5 h-5 text-gray-400" />}
              value={formData.price}
              onChange={(e) => update('price', e.target.value)}
            />
          </div>
          <div className="w-full h-full min-h-[120px] bg-gray-50 dark:bg-inmo-darkbg rounded-[20px] overflow-hidden relative shrink-0 border-2 border-transparent focus-within:border-inmo-accent transition-colors group">
            <PropertyMiniMap
              lat={formData.lat || 21.160}
              lng={formData.lng || -101.690}
              propertyType={formData.propertyType || formData.operationType}
              onLocationChange={(lat, lng) => { update('lat', lat); update('lng', lng); }}
            />
            <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-inmo-secondary dark:text-white">Ajustar Ubicación</span>
            </div>
          </div>
        </div>
        <Textarea
          placeholder="Descripción detallada de la propiedad..."
          value={formData.description}
          onChange={(e) => update('description', e.target.value)}
          className="min-h-[100px] max-h-[150px]"
        />
      </div>
    </div>
  );

"""

content = content[:start_idx] + new_block + content[end_idx:]

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated Step 2 layout")
