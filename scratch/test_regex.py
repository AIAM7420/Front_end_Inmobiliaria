import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Modify Headers
header_pattern = r'<th className="p-4 font-bold">Propiedad</th>\s*<th className="p-4 font-bold">Tipo</th>\s*<th className="p-4 font-bold">Precio</th>\s*<th className="p-4 font-bold text-center">Estado</th>\s*<th className="p-4 font-bold text-center">Recámaras</th>\s*<th className="p-4 font-bold text-center">Baños</th>\s*<th className="p-4 font-bold text-center">Área</th>\s*<th className="p-4 font-bold text-center">Interacciones</th>\s*<th className="p-4 font-bold text-right">Acciones</th>'

header_replacement = """<th className="p-4 font-bold min-w-[250px]">Propiedad</th>
                        <th className={`p-4 font-bold ${isOpen ? 'hidden 2xl:table-cell' : ''}`}>Tipo</th>
                        <th className="p-4 font-bold">Precio</th>
                        <th className="p-4 font-bold text-center">Estado</th>
                        <th className={`p-4 font-bold text-center ${isOpen ? 'hidden xl:table-cell' : ''}`}>Métricas</th>
                        <th className={`p-4 font-bold text-center ${isOpen ? 'hidden xl:table-cell' : ''}`}>Amenidades</th>
                        <th className="p-4 font-bold text-right">Acciones</th>"""

# For the header replacement, I am grouping Recámaras, Baños, Área into one column "Amenidades" when compacted?
# No, let's keep them separate but hide them all. Wait, if I change the column count, I MUST change the `<td>`s too!
# Let's change the table body as well to match the exact same `<td>` structure.
