import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace Headers
content = content.replace(
    '<th className="p-4 font-bold">Tipo</th>',
    '<th className={`p-4 font-bold ${isOpen ? \'hidden xl:table-cell\' : \'\'}`}>Tipo</th>'
)
content = content.replace(
    '<th className="p-4 font-bold text-center">RecAmaras</th>',
    '<th className={`p-4 font-bold text-center ${isOpen ? \'hidden 2xl:table-cell\' : \'\'}`}>Recámaras</th>'
)
content = content.replace(
    '<th className="p-4 font-bold text-center">BaAos</th>',
    '<th className={`p-4 font-bold text-center ${isOpen ? \'hidden 2xl:table-cell\' : \'\'}`}>Baños</th>'
)
content = content.replace(
    '<th className="p-4 font-bold text-center">A?rea</th>',
    '<th className={`p-4 font-bold text-center ${isOpen ? \'hidden 2xl:table-cell\' : \'\'}`}>Área</th>'
)
content = content.replace(
    '<th className="p-4 font-bold text-center">Rendimiento</th>',
    '<th className={`p-4 font-bold text-center ${isOpen ? \'hidden xl:table-cell\' : \'\'}`}>Rendimiento</th>'
)

# Replace Body Cells
content = content.replace(
    '<td className="p-4 align-middle">\n                            <span className="capitalize text-sm font-medium text-gray-600 dark:text-gray-300">{prop.type}</span>\n                          </td>',
    '<td className={`p-4 align-middle ${isOpen ? \'hidden xl:table-cell\' : \'\'}`}>\n                            <span className="capitalize text-sm font-medium text-gray-600 dark:text-gray-300">{prop.type}</span>\n                          </td>'
)

content = content.replace(
    '<td className="p-4 align-middle text-center">\n                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.beds}</span>\n                          </td>',
    '<td className={`p-4 align-middle text-center ${isOpen ? \'hidden 2xl:table-cell\' : \'\'}`}>\n                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.beds}</span>\n                          </td>'
)

content = content.replace(
    '<td className="p-4 align-middle text-center">\n                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.baths}</span>\n                          </td>',
    '<td className={`p-4 align-middle text-center ${isOpen ? \'hidden 2xl:table-cell\' : \'\'}`}>\n                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.baths}</span>\n                          </td>'
)

content = content.replace(
    '<td className="p-4 align-middle text-center">\n                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.sqft}m²</span>\n                          </td>',
    '<td className={`p-4 align-middle text-center ${isOpen ? \'hidden 2xl:table-cell\' : \'\'}`}>\n                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.sqft}m²</span>\n                          </td>'
)

content = content.replace(
    '<td className="p-4 align-middle text-center">\n                            <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-300">\n                              <span className="flex items-center gap-1 font-montserrat"><Eye className="w-4 h-4 text-gray-400" /> {prop.views}</span>\n                              <span className="flex items-center gap-1 font-montserrat"><MessageSquare className="w-4 h-4 text-gray-400" /> {prop.messages}</span>\n                            </div>\n                          </td>',
    '<td className={`p-4 align-middle text-center ${isOpen ? \'hidden xl:table-cell\' : \'\'}`}>\n                            <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-300">\n                              <span className="flex items-center gap-1 font-montserrat"><Eye className="w-4 h-4 text-gray-400" /> {prop.views}</span>\n                              <span className="flex items-center gap-1 font-montserrat"><MessageSquare className="w-4 h-4 text-gray-400" /> {prop.messages}</span>\n                            </div>\n                          </td>'
)

# Colspan fix
content = content.replace(
    '<td colSpan={5} className="p-8 text-center text-gray-500 font-inter">No se encontraron propiedades.</td>',
    '<td colSpan={9} className="p-8 text-center text-gray-500 font-inter">No se encontraron propiedades.</td>'
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Applied table responsive logic")
