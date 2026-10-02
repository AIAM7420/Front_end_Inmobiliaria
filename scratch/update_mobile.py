import os
import re

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# The pattern needs to capture the mobile list block.
# We will just replace from `<div className="flex flex-col md:hidden font-inter flex-1 overflow-y-auto custom-scrollbar pb-24">`
# to the end of the mobile list block.

mobile_search = """              {!isListLoading && !isError && (
                <div className="flex flex-col md:hidden font-inter flex-1 overflow-y-auto custom-scrollbar pb-24">
                  {properties.map((prop, index) => (
                    <div
                      key={prop.id}
                      className={`flex items-center gap-3 p-3 relative cursor-pointer ${index !== properties.length - 1 ? 'border-b border-gray-100 dark:border-inmo-darktertiary' : ''} ${selectedId === prop.id ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10' : ''} ${openMenuId === prop.id ? 'z-50' : 'z-0'}`}
                      onClick={() => { setSelectedId(prop.id); setViewMode('detail'); }}
                    >
                      <div className="relative shrink-0">
                        <img src={prop.image} alt={prop.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0 justify-center">
                        <span className="font-bold text-inmo-secondary dark:text-white line-clamp-1 text-sm leading-tight pr-6">{prop.title}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{prop.location}</span>
                        <span className="font-montserrat font-bold text-inmo-accent text-sm mt-1">{formatPrice(prop.price)}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(prop.status)} shrink-0`} title={prop.status} />
                        {openMenuId === prop.id && (
                          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                        )}
                        <div className="relative" onMouseLeave={() => setOpenMenuId(null)}>
                          <button
                            className="p-1 text-gray-400 hover:text-inmo-secondary dark:hover:text-white transition-colors"
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === prop.id ? null : prop.id); }}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          <ActionMenu
                            isOpen={openMenuId === prop.id}
                            onClose={() => setOpenMenuId(null)}
                            items={[
                              { label: 'Editar Propiedad', icon: <Edit className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setSelectedId(prop.id); setViewMode('edit'); setOpenMenuId(null); } },
                              { label: prop.status === 'Activa' ? 'Pausar' : 'Activar Publicación', icon: prop.status === 'Activa' ? <EyeOff className="w-4 h-4 shrink-0" /> : <Power className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); requestToggleStatus(prop); setOpenMenuId(null); } },
                              { label: 'Eliminar', icon: <Trash2 className="w-4 h-4 shrink-0 text-red-500" />, onClick: (e) => { e.stopPropagation(); requestDelete(prop); setOpenMenuId(null); } },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {!isListLoading && properties.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm font-inter">No se encontraron propiedades.</div>
                  )}
                </div>
              )}"""

mobile_replace = """              {!isListLoading && !isError && (
                <div className="flex flex-col md:hidden font-inter flex-1 overflow-y-auto custom-scrollbar pb-24">
                  {properties.map((prop, index) => (
                    <div
                      key={prop.id}
                      className={`flex flex-col p-4 relative cursor-pointer ${index !== properties.length - 1 ? 'border-b border-gray-100 dark:border-inmo-darktertiary' : ''} ${selectedId === prop.id ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10' : ''} ${openMenuId === prop.id ? 'z-50' : 'z-0'}`}
                      onClick={() => { setSelectedId(prop.id); setViewMode('detail'); }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0 mt-1">
                          <img src={prop.image} alt={prop.title} className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm" />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-[3px] border-white dark:border-inmo-darkbg rounded-full ${getStatusDotColor(prop.status)} shrink-0 shadow-sm`} title={prop.status} />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-bold text-inmo-secondary dark:text-white line-clamp-2 text-sm leading-tight flex-1 pr-1">{prop.title}</span>
                            <div className="relative shrink-0" onMouseLeave={() => setOpenMenuId(null)}>
                              <button
                                className="p-1 -mt-1 -mr-2 text-gray-400 hover:text-inmo-secondary dark:hover:text-white transition-colors"
                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === prop.id ? null : prop.id); }}
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                              <ActionMenu
                                isOpen={openMenuId === prop.id}
                                onClose={() => setOpenMenuId(null)}
                                items={[
                                  { label: 'Editar Propiedad', icon: <Edit className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setSelectedId(prop.id); setViewMode('edit'); setOpenMenuId(null); } },
                                  { label: prop.status === 'Activa' ? 'Pausar' : 'Activar Publicación', icon: prop.status === 'Activa' ? <EyeOff className="w-4 h-4 shrink-0" /> : <Power className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); requestToggleStatus(prop); setOpenMenuId(null); } },
                                  { label: 'Eliminar', icon: <Trash2 className="w-4 h-4 shrink-0 text-red-500" />, onClick: (e) => { e.stopPropagation(); requestDelete(prop); setOpenMenuId(null); } },
                                ]}
                              />
                            </div>
                          </div>
                          
                          <span className="font-montserrat font-bold text-inmo-accent mt-1">{formatPrice(prop.price)}</span>
                        </div>
                      </div>
                      
                      {/* Métricas y Amenidades (Mobile Compact) */}
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 font-montserrat">
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-gray-400" /> {prop.views}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-gray-400" /> {prop.messages}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 font-montserrat tracking-wide ml-auto">
                          <span>{prop.beds} REC</span>
                          <span>•</span>
                          <span>{prop.baths} BA</span>
                          <span>•</span>
                          <span>{prop.sqft} m²</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!isListLoading && properties.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm font-inter">No se encontraron propiedades.</div>
                  )}
                </div>
              )}"""

if mobile_search in content:
    content = content.replace(mobile_search, mobile_replace)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced mobile list exact string")
else:
    # If not found, use a lighter regex matching everything between the start and end of the block.
    print("Exact mobile block not found, falling back to regex")
    regex_search = r'\{/\* Mobile List \*/\}\s*\{!isListLoading && !isError && \(\s*<div className="flex flex-col md:hidden.*?\s*\{!isListLoading && properties\.length === 0 && \(\s*<div className="p-8 text-center text-gray-500 text-sm font-inter">No se encontraron propiedades\.</div>\s*\)\}\s*</div>\s*\)\}'
    content = re.sub(regex_search, '{/* Mobile List */}\n' + mobile_replace, content, flags=re.DOTALL)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Regex replacement executed")

