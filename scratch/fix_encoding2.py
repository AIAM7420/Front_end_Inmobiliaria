import codecs

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\organisms\PropertyCreatorWizard.tsx"

with codecs.open(filepath, "r", encoding="mbcs") as f:
    content = f.read()

# Replace the specific bad string
bad_str = "['?Qu? tipo de operaci?n es?', 'Tipo de Inmueble', 'Ubicaci?n y Precio', 'Caracter?sticas', 'Multimedia']"
good_str = "['¿Qué tipo de operación es?', 'Tipo de Inmueble', 'Ubicación y Precio', 'Características', 'Multimedia']"
content = content.replace(bad_str, good_str)

with codecs.open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed encoding.")
