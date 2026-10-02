const fs = require('fs');
let content = fs.readFileSync('src/components/views/asesor/AsesorInventoryView.tsx', 'utf8');

// 1. Imports
content = content.replace('Plus,', 'Trash2,\n  Plus,');
content = content.replace("import { ActionMenu } from '../../molecules/ActionMenu';", "import { ActionMenu } from '../../molecules/ActionMenu';\nimport { SemanticToast } from '../../molecules/SemanticToast';\nimport { ConfirmModal } from '../../molecules/ConfirmModal';");

// 2. States and handlers
const stateString = `const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [toast, setToast] = useState<{show: boolean, type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string} | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmVariant: 'accent' | 'danger' | 'warning' | 'secondary';
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmVariant: 'danger',
    confirmText: '',
    onConfirm: () => {}
  });

  const [localProperties, setLocalProperties] = useState(MOCK_PROPERTIES.map((p, index) => {
    let status: 'Activa' | 'Pausada' | 'Borrador' = 'Activa';
    if (index % 3 === 1) status = 'Pausada';
    if (index % 3 === 2) status = 'Borrador';
    return {
      ...p,
      status,
      views: Math.floor(Math.random() * 500) + 50,
      messages: Math.floor(Math.random() * 20),
    };
  }));

  const showToast = (type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string) => {
    setToast({ show: true, type, title, message });
  };

  React.useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleDelete = (id: number) => {
    setLocalProperties(prev => prev.filter(p => p.id !== id));
    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
      setIsEditMode(false);
    }
    showToast('success', 'Propiedad eliminada', 'La propiedad ha sido eliminada de tu inventario.');
  };

  const requestDelete = (prop: any) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Propiedad',
      message: '¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.',
      confirmVariant: 'danger',
      confirmText: 'Eliminar',
      onConfirm: () => handleDelete(prop.id)
    });
  };

  const requestToggleStatus = (prop: any) => {
    setConfirmModal({
      isOpen: true,
      title: prop.status === 'Activa' ? 'Pausar Propiedad' : 'Activar Propiedad',
      message: prop.status === 'Activa' 
        ? '¿Estás seguro de que deseas pausar esta propiedad? Dejará de ser visible en las búsquedas.' 
        : '¿Estás seguro de que deseas activar esta propiedad? Volverá a ser visible para los usuarios.',
      confirmVariant: prop.status === 'Activa' ? 'warning' : 'accent',
      confirmText: prop.status === 'Activa' ? 'Pausar' : 'Activar',
      onConfirm: () => {
        setLocalProperties(prev => prev.map(p => p.id === prop.id ? { ...p, status: p.status === 'Activa' ? 'Pausada' : 'Activa' } : p));
        showToast('success', 'Estado actualizado', \`La propiedad ahora está \${prop.status === 'Activa' ? 'pausada' : 'activa'}.\`);
      }
    });
  };

  const handleCreateNew = () => {
    const newProperty = {
      id: Date.now(),
      title: '',
      location: '',
      price: 0,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
      type: 'venta',
      status: 'Borrador',
      views: 0,
      messages: 0,
      description: '',
      beds: 0,
      baths: 0,
      sqft: 0
    };
    setSelectedProperty(newProperty);
    setIsEditMode(true);
  };`;

content = content.replace(/const \[searchTerm, setSearchTerm.*?const filteredProperties = properties\.filter/s, stateString + '\n\n  const filteredProperties = localProperties.filter');
content = content.replace(/properties\.length/g, 'localProperties.length');

// 3. Update Inputs
content = content.replace(/<textarea \n\s+defaultValue=\{selectedProperty\.title\}/, `<textarea 
                  value={selectedProperty.title || ''}
                  onChange={(e) => setSelectedProperty({...selectedProperty, title: e.target.value})}
                  placeholder="Título de la propiedad"`);
content = content.replace(/className="text-\[22px\] md:text-2xl font-bold font-montserrat text-inmo-secondary dark:text-white leading-tight bg-gray-50 dark:bg-inmo-darkbg\/50 border border-gray-200 dark:border-inmo-darktertiary focus:border-inmo-accent focus:bg-white dark:focus:bg-inmo-darkcard rounded-xl outline-none resize-none overflow-hidden transition-all w-full px-4 py-3"/, `className="text-[22px] md:text-2xl font-bold font-montserrat text-inmo-secondary dark:text-white leading-tight bg-gray-50 dark:bg-inmo-darkbg/50 border border-gray-200 dark:border-inmo-darktertiary focus:border-inmo-accent focus:bg-white dark:focus:bg-inmo-darkcard rounded-xl outline-none resize-none overflow-hidden transition-all w-full px-4 py-3 placeholder:text-gray-400"`);

content = content.replace(/<input type="text" defaultValue=\{selectedProperty\.location\} className="text-sm font-inter font-medium truncate bg-transparent outline-none w-full text-inmo-secondary dark:text-gray-300" \/>/, `<input type="text" placeholder="Ubicación" value={selectedProperty.location || ''} onChange={(e) => setSelectedProperty({...selectedProperty, location: e.target.value})} className="text-sm font-inter font-medium truncate bg-transparent outline-none w-full text-inmo-secondary dark:text-gray-300 placeholder:text-gray-400" />`);
content = content.replace(/<input type="number" defaultValue=\{selectedProperty\.price\} className="text-lg font-bold font-inter text-inmo-secondary dark:text-white bg-transparent outline-none w-24 md:w-28 text-right" \/>/, `<input type="number" placeholder="0" value={selectedProperty.price || ''} onChange={(e) => setSelectedProperty({...selectedProperty, price: Number(e.target.value)})} className="text-lg font-bold font-inter text-inmo-secondary dark:text-white bg-transparent outline-none w-24 md:w-28 text-right placeholder:text-gray-400" />`);

content = content.replace(/<textarea \n\s+defaultValue="Hermosa propiedad ubicada en una de las zonas mas exclusivas y de mayor plusvalia de la ciudad\. Cuenta con amplios espacios excelentemente distribuidos, iluminacion natural abundante y acabados de lujo de primera calidad\. Perfecta para familias que buscan comodidad absoluta\."\n\s+className="text-\[13px\] text-gray-600 dark:text-gray-400 leading-relaxed font-medium bg-gray-50 dark:bg-inmo-darkbg\/50 border border-gray-200 dark:border-inmo-darktertiary focus:border-inmo-accent focus:bg-white dark:focus:bg-inmo-darkcard rounded-xl outline-none resize-none w-full min-h-\[100px\] p-4 transition-all"\n\s+\/>/, `<textarea 
                  value={selectedProperty.description || ''}
                  onChange={(e) => setSelectedProperty({...selectedProperty, description: e.target.value})}
                  placeholder="Descripción de la propiedad..."
                  className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium bg-gray-50 dark:bg-inmo-darkbg/50 border border-gray-200 dark:border-inmo-darktertiary focus:border-inmo-accent focus:bg-white dark:focus:bg-inmo-darkcard rounded-xl outline-none resize-none w-full min-h-[100px] p-4 transition-all placeholder:text-gray-400"
                />`);

content = content.replace(/<input type="number" defaultValue=\{3\}/g, `<input type="number" placeholder="0" value={selectedProperty.beds || ''} onChange={(e) => setSelectedProperty({...selectedProperty, beds: Number(e.target.value)})}`);
content = content.replace(/<input type="number" defaultValue=\{2\}/g, `<input type="number" placeholder="0" value={selectedProperty.baths || ''} onChange={(e) => setSelectedProperty({...selectedProperty, baths: Number(e.target.value)})}`);
content = content.replace(/<input type="number" defaultValue=\{120\}/g, `<input type="number" placeholder="0" value={selectedProperty.sqft || ''} onChange={(e) => setSelectedProperty({...selectedProperty, sqft: Number(e.target.value)})}`);
content = content.replace(/className="w-6 sm:w-8 text-center bg-transparent outline-none text-xs sm:text-sm font-bold text-inmo-secondary dark:text-white"/g, `className="w-6 sm:w-8 text-center bg-transparent outline-none text-xs sm:text-sm font-bold text-inmo-secondary dark:text-white placeholder:text-gray-400"`);
content = content.replace(/className="w-8 sm:w-10 text-center bg-transparent outline-none text-xs sm:text-sm font-bold text-inmo-secondary dark:text-white"/g, `className="w-8 sm:w-10 text-center bg-transparent outline-none text-xs sm:text-sm font-bold text-inmo-secondary dark:text-white placeholder:text-gray-400"`);

// 4. Save Buttons
content = content.replace(/onClick=\{\(\) => setIsEditMode\(false\)\}/, `onClick={() => {
                 if (!localProperties.find(p => p.id === selectedProperty.id)) {
                   setSelectedProperty(null);
                 }
                 setIsEditMode(false);
               }}`);

content = content.replace(/onClick=\{\(\) => setIsEditMode\(false\)\}/, `onClick={() => {
                 if (!selectedProperty.title || !selectedProperty.location || !selectedProperty.price || !selectedProperty.beds || !selectedProperty.baths || !selectedProperty.sqft) {
                   showToast('warning', 'Información incompleta', 'Por favor, llena todos los campos requeridos antes de guardar.');
                   return;
                 }
                 setLocalProperties(prev => {
                   const exists = prev.find(p => p.id === selectedProperty.id);
                   if (exists) {
                     return prev.map(p => p.id === selectedProperty.id ? selectedProperty : p);
                   } else {
                     return [selectedProperty, ...prev];
                   }
                 });
                 setIsEditMode(false);
                 showToast('success', 'Propiedad guardada', 'Los cambios se han guardado exitosamente.');
               }}`);


// 5. Desktop Actions
content = content.replace(/\{ label: 'Editar Propiedad', icon: <Edit className="w-4 h-4 shrink-0" \/>, onClick: \(e\) => \{ e\.stopPropagation\(\); setSelectedProperty\(prop\); setIsEditMode\(true\); \} \},\n\s+\{ label: 'Gestionar Fotos', icon: <ImageIcon className="w-4 h-4 shrink-0" \/>, onClick: \(e\) => e\.stopPropagation\(\) \},\n\s+\{ label: prop\.status === 'Activa' \? 'Pausar' : 'Activar Publicación', icon: prop\.status === 'Activa' \? <EyeOff className="w-4 h-4 shrink-0" \/> : <Power className="w-4 h-4 shrink-0" \/>, onClick: \(e\) => e\.stopPropagation\(\) \},\n\s+\{ label: 'Colaboración', icon: <Handshake className="w-4 h-4 shrink-0" \/>, onClick: \(e\) => e\.stopPropagation\(\) \}/, `{ label: 'Editar Propiedad', icon: <Edit className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setSelectedProperty(prop); setIsEditMode(true); setOpenMenuId(null); } },
                              { label: prop.status === 'Activa' ? 'Pausar' : 'Activar Publicación', icon: prop.status === 'Activa' ? <EyeOff className="w-4 h-4 shrink-0" /> : <Power className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); requestToggleStatus(prop); setOpenMenuId(null); } },
                              { label: 'Eliminar', icon: <Trash2 className="w-4 h-4 shrink-0 text-red-500" />, onClick: (e) => { e.stopPropagation(); requestDelete(prop); setOpenMenuId(null); } }`);

content = content.replace(/<IconButton variant="ghost" size="sm" icon=\{<ImageIcon className="w-4 h-4" \/>\} title="Fotos" onClick=\{\(e\) => \{ e\.stopPropagation\(\); \}\} \/>\n\s+<IconButton variant="ghost" size="sm" icon=\{prop\.status === 'Activa' \? <EyeOff className="w-4 h-4" \/> : <Power className="w-4 h-4" \/>\} title=\{prop\.status === 'Activa' \? 'Pausar' : 'Activar'\} onClick=\{\(e\) => \{ e\.stopPropagation\(\); \}\} \/>\n\s+<IconButton variant="ghost" size="sm" icon=\{<Handshake className="w-4 h-4" \/>\} title="Colaboración" onClick=\{\(e\) => \{ e\.stopPropagation\(\); \}\} \/>/, `<IconButton variant="ghost" size="sm" icon={prop.status === 'Activa' ? <EyeOff className="w-4 h-4" /> : <Power className="w-4 h-4" />} title={prop.status === 'Activa' ? 'Pausar' : 'Activar'} onClick={(e) => { e.stopPropagation(); requestToggleStatus(prop); }} />
                        <IconButton variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-red-500" />} title="Eliminar" onClick={(e) => { e.stopPropagation(); requestDelete(prop); }} />`);

// 6. Mobile Actions
content = content.replace(/\{ label: 'Editar Propiedad', icon: <Edit className="w-4 h-4 shrink-0" \/>, onClick: \(e\) => \{ e\.stopPropagation\(\); setSelectedProperty\(prop\); setIsEditMode\(true\); \} \},\n\s+\{ label: 'Gestionar Fotos', icon: <ImageIcon className="w-4 h-4 shrink-0" \/>, onClick: \(e\) => e\.stopPropagation\(\) \},\n\s+\{ label: prop\.status === 'Activa' \? 'Pausar' : 'Activar Publicación', icon: prop\.status === 'Activa' \? <EyeOff className="w-4 h-4 shrink-0" \/> : <Power className="w-4 h-4 shrink-0" \/>, onClick: \(e\) => e\.stopPropagation\(\) \},\n\s+\{ label: 'Colaboración', icon: <Handshake className="w-4 h-4 shrink-0" \/>, onClick: \(e\) => e\.stopPropagation\(\) \}/, `{ label: 'Editar Propiedad', icon: <Edit className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setSelectedProperty(prop); setIsEditMode(true); setOpenMenuId(null); } },
                      { label: prop.status === 'Activa' ? 'Pausar' : 'Activar Publicación', icon: prop.status === 'Activa' ? <EyeOff className="w-4 h-4 shrink-0" /> : <Power className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); requestToggleStatus(prop); setOpenMenuId(null); } },
                      { label: 'Eliminar', icon: <Trash2 className="w-4 h-4 shrink-0 text-red-500" />, onClick: (e) => { e.stopPropagation(); requestDelete(prop); setOpenMenuId(null); } }`);

// 7. Modals rendering
const endHtml = `      <SplitViewLayout
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        sideTitle={isEditMode ? "Modo Edición" : "Detalle de Propiedad"}
        sideContent={renderSideContent()}
        sidePanelWidthClass="md:w-[50%]"
        mainPanelWidthClass="md:w-[50%]"
        mainContent={mainContent}
        bottomSheetNoPadding={true}
        bottomSheetHeightMode="fixed-85"
      />
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmVariant={confirmModal.confirmVariant}
        confirmText={confirmModal.confirmText}
      />

      {toast?.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <SemanticToast type={toast.type} title={toast.title} message={toast.message} />
        </div>
      )}
    </>
  );
};`;
content = content.replace(/<SplitViewLayout.*?;\\n};/s, endHtml);
content = content.replace('return (\n    <SplitViewLayout', 'return (\n    <>\n      <SplitViewLayout');

content = content.replace(/<IconButton \n\s+variant="accent" \n\s+icon=\{<Plus className="w-5 h-5 shrink-0" strokeWidth=\{2\} \/>\} \n\s+className="w-\[44px\] h-\[44px\] !rounded-\[14px\] shadow-glow shrink-0" \n\s+title="Añadir Propiedad"\n\s+\/>/, `<IconButton 
                variant="accent" 
                icon={<Plus className="w-5 h-5 shrink-0" strokeWidth={2} />} 
                className="w-[44px] h-[44px] !rounded-[14px] shadow-glow shrink-0" 
                title="Añadir Propiedad"
                onClick={handleCreateNew}
              />`);

fs.writeFileSync('src/components/views/asesor/AsesorInventoryView.tsx', content);
