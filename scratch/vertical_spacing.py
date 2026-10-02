import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\organisms\PropertyCreatorWizard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Step 2: Ubicacion adjustments
# Make the wrapper flex-1 so it takes all available height
# We'll replace the container class for renderStepUbicacion
content = content.replace(
    'const renderStepUbicacion = () => (\n    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 justify-center py-4">',
    'const renderStepUbicacion = () => (\n    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 py-4">'
)

# And make the flex col inside it flex-1
content = content.replace(
    '<div className="flex flex-col gap-3 shrink-0">\n        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">',
    '<div className="flex flex-col gap-3 flex-1">\n        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">'
)

# And make Textarea flex-1
content = content.replace(
    'className="min-h-[100px] max-h-[150px]"',
    'className="flex-1 min-h-[100px] resize-none"'
)

# Step 3: Caracteristicas adjustments
content = content.replace(
    'const renderStepCaracteristicas = () => (\n    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 justify-center py-4">',
    'const renderStepCaracteristicas = () => (\n    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 py-4">'
)
# Make the flex col inside it flex-1, and the tags list flex-1
content = content.replace(
    'const renderStepCaracteristicas = () => (\n    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 py-4">\n      <div className="mb-2 shrink-0 text-center">\n        <p className="text-sm text-gray-500 mt-2">Dimensiones y amenidades del inmueble.</p>\n      </div>\n      <div className="flex flex-col gap-2 shrink-0">',
    'const renderStepCaracteristicas = () => (\n    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 py-4">\n      <div className="mb-2 shrink-0 text-center">\n        <p className="text-sm text-gray-500 mt-2">Dimensiones y amenidades del inmueble.</p>\n      </div>\n      <div className="flex flex-col gap-2 flex-1">'
)
# Make tags list fill space
content = content.replace(
    'className="flex flex-wrap gap-2 overflow-y-auto max-h-[80px] custom-scrollbar pr-1"',
    'className="flex flex-wrap gap-2 overflow-y-auto flex-1 min-h-[80px] custom-scrollbar pr-1 content-start"'
)

# Step 4: Multimedia adjustments
content = content.replace(
    'const renderStepMultimedia = () => (\n    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 justify-center py-4">',
    'const renderStepMultimedia = () => (\n    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 py-4">'
)
content = content.replace(
    '<div className="flex flex-col gap-3 shrink-0">\n        <div className="w-full relative rounded-[24px] overflow-hidden bg-gray-50 dark:bg-inmo-darkbg shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-700 group flex flex-col items-center justify-center min-h-[160px]">',
    '<div className="flex flex-col gap-3 flex-1">\n        <div className="w-full relative rounded-[24px] overflow-hidden bg-gray-50 dark:bg-inmo-darkbg flex-1 border-2 border-dashed border-gray-300 dark:border-gray-700 group flex flex-col items-center justify-center min-h-[160px]">'
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated vertical spacing")
