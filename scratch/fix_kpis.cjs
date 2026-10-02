const fs = require('fs');
const file = 'src/components/views/admin/AdminPublicationsView.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const newKpi = `  const renderKpiContent = () => {
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
  };`.split('\n');

lines.splice(416, 52, ...newKpi);
fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed KPI lines');
