const fs = require('fs');
const file = 'src/components/views/admin/AdminPublicationsView.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Title change
content = content.replace('title="Publicaciones (Moderación)"', 'title="Publicaciones"');

// 2. KPIs change
const kpiOld = `  const renderKpiContent = () => {
    const propertyLimit = 15;
    const currentCount = properties.length;
    const limitText = statusFilter === 'Todos' ? \`de \${propertyLimit} disp.\` : statusFilter;

    return (
      <>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 25 Q 30 35 60 20 T 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 25 Q 30 35 60 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-secondary dark:text-white mb-1">
              {currentCount} <span className="text-base lg:text-lg text-gray-400 font-medium">{statusFilter === 'Todos' ? \`/ \${propertyLimit}\` : ''}</span>
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Publicaciones<br />{limitText}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-accent" preserveAspectRatio="none">
              <path d="M 0 40 L 0 35 Q 20 20 40 25 T 80 15 L 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 35 Q 20 20 40 25 T 80 15 L 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-accent mb-1">
              {properties.reduce((acc, p) => acc + p.views, 0)}
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Visitas Totales</span>
          </div>
        </div>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-success" preserveAspectRatio="none">
              <path d="M 0 40 L 0 5 Q 30 20 60 10 T 100 25 L 100 40 Z" fill="currentColor" />
              <path d="M 0 5 Q 30 20 60 10 T 100 25" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-success mb-1">
              {properties.reduce((acc, p) => acc + p.messages, 0)}
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Leads (Contactos)</span>
          </div>
        </div>
      </>
    );
  };`;

const kpiNew = `  const renderKpiContent = () => {
    return (
      <>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 25 Q 30 35 60 20 T 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 25 Q 30 35 60 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-secondary dark:text-white mb-1">
              8,492
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Propiedades<br/>Activas</span>
          </div>
        </div>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-accent" preserveAspectRatio="none">
              <path d="M 0 40 L 0 35 Q 20 20 40 25 T 80 15 L 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 35 Q 20 20 40 25 T 80 15 L 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-accent mb-1">
              124
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Propiedades<br/>Reportadas</span>
          </div>
        </div>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-danger" preserveAspectRatio="none">
              <path d="M 0 40 L 0 5 Q 30 20 60 10 T 100 25 L 100 40 Z" fill="currentColor" />
              <path d="M 0 5 Q 30 20 60 10 T 100 25" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-danger mb-1">
              32
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Propiedades<br/>Suspendidas</span>
          </div>
        </div>
      </>
    );
  };`;

content = content.replace(kpiOld, kpiNew);

// 3. Actions in List
// In the table we have:
// { label: 'Revisar Publicación', icon: <Edit className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setSelectedId(prop.id); setViewMode('edit'); setOpenMenuId(null); } },
// { label: 'Suspender', icon: <Trash2 className="w-4 h-4 shrink-0 text-red-500" />, onClick: (e) => { e.stopPropagation(); requestDelete(prop); setOpenMenuId(null); } },
// Let's replace those with Ocultar, Reportar, Eliminar.
const actionsOld = `{ label: 'Revisar Publicación', icon: <Edit className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setSelectedId(prop.id); setViewMode('edit'); setOpenMenuId(null); } },
                                  { label: 'Suspender', icon: <Trash2 className="w-4 h-4 shrink-0 text-red-500" />, onClick: (e) => { e.stopPropagation(); requestDelete(prop); setOpenMenuId(null); } },`;
const actionsNew = `{ label: 'Ocultar', icon: <EyeOff className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setOpenMenuId(null); } },
                                  { label: 'Reportar', icon: <AlertCircle className="w-4 h-4 shrink-0 text-yellow-500" />, onClick: (e) => { e.stopPropagation(); setOpenMenuId(null); } },
                                  { label: 'Eliminar', icon: <Trash2 className="w-4 h-4 shrink-0 text-red-500" />, onClick: (e) => { e.stopPropagation(); requestDelete(prop); setOpenMenuId(null); } },`;
content = content.replaceAll(actionsOld, actionsNew);

// 4. Quick Actions in Grid
// <IconButton variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} title="Revisar" onClick={(e) => { e.stopPropagation(); setSelectedId(prop.id); setViewMode('edit'); }} />
// <IconButton variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-red-500" />} title="Suspender" onClick={(e) => { e.stopPropagation(); requestDelete(prop); }} />
const gridActionsOld = `<IconButton variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} title="Revisar" onClick={(e) => { e.stopPropagation(); setSelectedId(prop.id); setViewMode('edit'); }} />
                              <IconButton variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-red-500" />} title="Suspender" onClick={(e) => { e.stopPropagation(); requestDelete(prop); }} />`;
const gridActionsNew = `<IconButton variant="ghost" size="sm" icon={<EyeOff className="w-4 h-4" />} title="Ocultar" onClick={(e) => { e.stopPropagation(); }} />
                              <IconButton variant="ghost" size="sm" icon={<AlertCircle className="w-4 h-4 text-yellow-500" />} title="Reportar" onClick={(e) => { e.stopPropagation(); }} />
                              <IconButton variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-red-500" />} title="Eliminar" onClick={(e) => { e.stopPropagation(); requestDelete(prop); }} />`;
content = content.replaceAll(gridActionsOld, gridActionsNew);

fs.writeFileSync(file, content);
console.log('Fixed SuperAdmin');
