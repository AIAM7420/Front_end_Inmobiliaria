import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

header_search = """                        <th className="p-4 font-bold">Propiedad</th>
                        <th className="p-4 font-bold">Tipo / Precio</th>
                        <th className="p-4 font-bold">Estado</th>
                        <th className="p-4 font-bold">MActricas</th>
                        <th className="p-4 font-bold text-right">Acciones</th>"""
if header_search not in content:
    # try with correctly encoded text
    header_search = """                        <th className="p-4 font-bold">Propiedad</th>
                        <th className="p-4 font-bold">Tipo / Precio</th>
                        <th className="p-4 font-bold">Estado</th>
                        <th className="p-4 font-bold">Métricas</th>
                        <th className="p-4 font-bold text-right">Acciones</th>"""

header_replace = """                        <th className="p-4 font-bold">Propiedad</th>
                        <th className="p-4 font-bold">Tipo</th>
                        <th className="p-4 font-bold">Precio</th>
                        <th className="p-4 font-bold text-center">Estado</th>
                        <th className="p-4 font-bold text-center">Recámaras</th>
                        <th className="p-4 font-bold text-center">Baños</th>
                        <th className="p-4 font-bold text-center">Área</th>
                        <th className="p-4 font-bold text-center">Interacciones</th>
                        <th className="p-4 font-bold text-right">Acciones</th>"""
content = content.replace(header_search, header_replace)

body_search = """                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="capitalize text-sm font-medium text-gray-600 dark:text-gray-300">{prop.type}</span>
                              <span className="font-montserrat font-bold text-inmo-accent mt-1">{formatPrice(prop.price)}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(prop.status)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <span className="flex items-center gap-1 font-montserrat"><Eye className="w-4 h-4 text-gray-400" /> {prop.views}</span>
                              <span className="flex items-center gap-1 font-montserrat"><MessageSquare className="w-4 h-4 text-gray-400" /> {prop.messages}</span>
                            </div>
                          </td>"""
body_replace = """                          <td className="p-4 align-middle">
                            <span className="capitalize text-sm font-medium text-gray-600 dark:text-gray-300">{prop.type}</span>
                          </td>
                          <td className="p-4 align-middle">
                            <span className="font-montserrat font-bold text-inmo-accent">{formatPrice(prop.price)}</span>
                          </td>
                          <td className="p-4 align-middle text-center">
                            <div className="flex justify-center">{getStatusBadge(prop.status)}</div>
                          </td>
                          <td className="p-4 align-middle text-center">
                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.beds}</span>
                          </td>
                          <td className="p-4 align-middle text-center">
                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.baths}</span>
                          </td>
                          <td className="p-4 align-middle text-center">
                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.sqft}m²</span>
                          </td>
                          <td className="p-4 align-middle text-center">
                            <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <span className="flex items-center gap-1 font-montserrat"><Eye className="w-4 h-4 text-gray-400" /> {prop.views}</span>
                              <span className="flex items-center gap-1 font-montserrat"><MessageSquare className="w-4 h-4 text-gray-400" /> {prop.messages}</span>
                            </div>
                          </td>"""
content = content.replace(body_search, body_replace)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated desktop table layout")
