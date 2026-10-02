import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\organisms\PropertyCreatorWizard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    "Â¿QuÃ© tipo de operaciÃ³n es?": "¿Qué tipo de operación es?",
    "AtrÃ¡s": "Atrás",
    "DiseÃ±o Visual": "Diseño Visual",
    "GalerÃ­a": "Galería",
    "AÃ±adir": "Añadir",
    "CaracterÃ­sticas": "Características",
    "DescripciÃ³n detallada": "Descripción detallada",
    "UbicaciÃ³n y Precio": "Ubicación y Precio",
    "UbicaciÃ³n": "Ubicación",
    "BaÃ±os": "Baños",
    "Metros cuadrados (mÂ²)": "Metros cuadrados (m²)",
    "RecÃ¡maras": "Recámaras",
    "JardÃ­n": "Jardín",
    "OperaciÃ³n": "Operación",
    "Inmueble": "Inmueble",
    "Multimedia": "Multimedia",
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Text replaced successfully.")
