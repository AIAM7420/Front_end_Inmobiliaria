import React, { useState } from 'react';
import { Bell, Users, Building2, TrendingUp, TrendingDown, CreditCard, ShieldAlert, Activity } from 'lucide-react';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { PeriodSelector, type PeriodOption } from '../../molecules/PeriodSelector';
import { PeriodDropdown } from '../../molecules/PeriodDropdown';
import { IconButton } from '../../atoms/IconButton';
import { Button } from '../../atoms/Button';

export const AdminOverview: React.FC = () => {
  const [isUsersSheetOpen, setIsUsersSheetOpen] = useState(false);
  const [isReportsSheetOpen, setIsReportsSheetOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('Mes');
  const [activeMobileChart, setActiveMobileChart] = useState<'trafico' | 'conversion'>('trafico');

  const isSplitOpen = isUsersSheetOpen || isReportsSheetOpen;

  const handleCloseSplit = () => {
    setIsUsersSheetOpen(false);
    setIsReportsSheetOpen(false);
  };

  const getSideTitle = () => {
    if (isUsersSheetOpen) return "Distribución de Usuarios";
    if (isReportsSheetOpen) return "Atención de Reportes";
    return "";
  };

  const usersSideContent = (
    <div className="flex flex-col gap-3 md:gap-4 pb-4 md:pb-6">
      
      {/* Card 1: Gauge (Públicos vs Asesores) */}
      <div className="min-h-[220px] bg-white dark:bg-inmo-darkcard rounded-card p-4 md:p-6 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col items-center justify-between">
        <p className="font-inter text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 md:mb-6">Distribución de Audiencia</p>
        
        <div className="relative w-full max-w-[260px] flex items-end justify-center mt-auto mb-10">
          <svg viewBox="0 0 100 50" className="w-full overflow-visible">
            {/* Background track */}
            <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="10" strokeLinecap="round" />
            {/* Foreground fill (85%) */}
            <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="currentColor" className="text-inmo-accent" strokeWidth="10" strokeLinecap="round" 
              strokeDasharray="141.37" strokeDashoffset="21.2" /> 
          </svg>
          <div className="absolute top-[85%] left-0 w-full flex flex-col items-center justify-end">
            <span className="font-montserrat font-black text-5xl md:text-6xl text-inmo-secondary dark:text-white leading-none">85%</span>
            <span className="font-inter text-caption md:text-xs font-bold text-inmo-accent mt-1 uppercase tracking-wide">Públicos</span>
          </div>
        </div>
        
        <div className="w-full flex justify-between items-center px-4 md:px-8 shrink-0 mt-8 md:mt-12">
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-bold text-xl md:text-2xl text-inmo-secondary dark:text-white">10.5k</span>
            <span className="font-inter text-caption md:text-caption font-semibold text-gray-400 uppercase tracking-wider">Públicos</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-bold text-xl md:text-2xl text-gray-400 dark:text-gray-500">1.9k</span>
            <span className="font-inter text-caption md:text-caption font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wider">Asesores</span>
          </div>
        </div>
      </div>

      {/* Cards 2 & 3: KPIs */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 shrink-0">
        <div className="bg-white dark:bg-inmo-darkcard rounded-card p-4 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col justify-between relative h-full min-h-[96px] overflow-hidden">
          <p className="font-inter text-xs font-semibold text-gray-500 uppercase tracking-wider">Nuevos</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-montserrat font-black text-3xl text-inmo-secondary dark:text-white">245</span>
            <div className="flex flex-col items-center justify-center text-inmo-success">
              <TrendingUp className="w-5 h-5" />
              <p className="font-inter text-caption font-semibold mt-0.5">+12%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-inmo-darkcard rounded-card p-4 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col justify-between relative h-full min-h-[96px] overflow-hidden">
          <p className="font-inter text-xs font-semibold text-gray-500 uppercase tracking-wider">Bajas</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-montserrat font-black text-3xl text-inmo-secondary dark:text-white">12</span>
            <div className="flex flex-col items-center justify-center text-inmo-danger">
              <TrendingDown className="w-5 h-5" />
              <p className="font-inter text-caption font-semibold mt-0.5">-5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* List of properties -> Asesores por Nivel */}
      <div className="shrink-0 bg-white dark:bg-inmo-darkcard rounded-card p-4 md:p-5 border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-inmo-darkbg flex items-center justify-center text-inmo-secondary dark:text-white">
              <Building2 className="w-4 h-4"/>
            </div>
            <span className="font-inter text-sm font-semibold text-inmo-secondary dark:text-white">Agencias</span>
          </div>
          <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">45</span>
        </div>
        <div className="w-full h-px bg-gray-50 dark:bg-inmo-darktertiary my-1"></div>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-inmo-darkbg flex items-center justify-center text-inmo-secondary dark:text-white">
              <CreditCard className="w-4 h-4"/>
            </div>
            <span className="font-inter text-sm font-semibold text-inmo-secondary dark:text-white">Asesores PRO</span>
          </div>
          <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">184</span>
        </div>
        <div className="w-full h-px bg-gray-50 dark:bg-inmo-darktertiary my-1"></div>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-inmo-darkbg flex items-center justify-center text-inmo-secondary dark:text-white">
              <Users className="w-4 h-4"/>
            </div>
            <span className="font-inter text-sm font-semibold text-inmo-secondary dark:text-white">Gratuitos</span>
          </div>
          <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">1,671</span>
        </div>
      </div>
    </div>
  );

  const reportsSideContent = (
    <div className="flex flex-col gap-4">
      {/* Mock Reports List */}
      {[
        { id: 1, type: 'Propiedad', title: 'Casa en Las Lomas', reason: 'Fotos inadecuadas o spam', time: 'Hace 2 horas', status: 'Crítico' },
        { id: 2, type: 'Usuario', title: 'Carlos Rodríguez', reason: 'Múltiples cuentas detectadas', time: 'Hace 5 horas', status: 'En revisión' },
        { id: 3, type: 'Mensaje', title: 'Chat con Cliente #104', reason: 'Intento de Phishing', time: 'Ayer', status: 'Pendiente' },
      ].map(report => (
        <div key={report.id} className="bg-white dark:bg-inmo-darkcard rounded-2xl p-4 border border-red-50 dark:border-red-900/10 shadow-sm hover:border-inmo-danger/50 hover:shadow-md transition-all cursor-pointer flex gap-3 items-start group">
           <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl text-inmo-danger transition-transform group-hover:scale-110">
             <ShieldAlert className="w-5 h-5" />
           </div>
           <div className="flex-1 flex flex-col pt-0.5">
             <div className="flex justify-between items-start w-full gap-2">
               <span className="font-inter font-semibold text-sm text-inmo-secondary dark:text-white line-clamp-1">{report.title}</span>
               <span className="font-inter text-caption font-bold text-inmo-danger bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full whitespace-nowrap">{report.status}</span>
             </div>
             <p className="font-inter text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{report.reason}</p>
             <div className="flex items-center gap-2 mt-3">
               <span className="font-inter text-caption text-gray-400 font-medium">{report.time}</span>
               <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
               <span className="font-inter text-caption font-semibold text-gray-400 uppercase">{report.type}</span>
             </div>
           </div>
        </div>
      ))}
      <Button className="w-full mt-2 py-3 rounded-xl border border-gray-200 dark:border-inmo-darktertiary text-inmo-secondary dark:text-white font-inter font-semibold text-xs hover:bg-gray-50 dark:hover:bg-inmo-darktertiary transition-colors">
        Ir al Centro de Resoluciones
      </Button>
    </div>
  );

  const sideContent = (
    <div className="flex flex-col gap-8 p-4 md:p-0">
      {isUsersSheetOpen && usersSideContent}
      {isReportsSheetOpen && reportsSideContent}
    </div>
  );

  return (
    <SplitViewLayout
      isOpen={isSplitOpen}
      onClose={handleCloseSplit}
      sideTitle={getSideTitle()}
      sideContent={sideContent}
      bottomSheetNoPadding={false}
      bottomSheetIsHero={false}
      sidePanelWidthClass="w-[30%]"
      mainPanelWidthClass="md:w-[70%]"
      mainContent={
        <div className="flex flex-col gap-3 md:gap-4 h-full w-full pt-[116px] md:pt-[124px] pb-[100px] px-4 md:px-6 animate-in fade-in">
          
          {/* 1. Header Flotante (Controles) */}
          <header className="flex justify-between items-center mb-1 shrink-0 relative min-h-[48px]">
            {/* Greeting (Left side) */}
            <div className={`ml-4 md:ml-6 flex-1 flex flex-col items-start justify-center gap-0.5 md:gap-1 truncate transition-all duration-300 ${isSplitOpen ? 'opacity-0 w-0 invisible' : 'opacity-100'}`}>
              <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-inmo-secondary dark:text-white shrink-0 leading-none">Hola, Admin</h1>
              <p className="font-inter text-sm md:text-base text-gray-500 dark:text-gray-400 truncate leading-tight mt-0.5">Panel de Control Global</p>
            </div>
            
            {/* Selector de Periodo Desktop - CENTRADO */}
            <div className={`hidden md:flex absolute z-30 transition-all duration-500 ease-in-out w-[400px] xl:w-[450px] ${
              isSplitOpen 
                ? 'left-4 md:left-6 translate-x-0' 
                : 'left-1/2 -translate-x-1/2'
            }`}>
              <PeriodSelector 
                selectedPeriod={selectedPeriod} 
                onChange={setSelectedPeriod} 
              />
            </div>

            <div className="flex items-center gap-2 mr-4 md:mr-6 flex-1 justify-end">
              {/* Selector de Periodo Mobile */}
              <PeriodDropdown
                selectedPeriod={selectedPeriod}
                onChange={setSelectedPeriod}
                options={['Semana', 'Mes', '3 Meses', '6 Meses', 'Año']}
                className="md:hidden"
              />

              <div className="relative z-20">
                <IconButton 
                  icon={<Bell className="w-5 h-5 md:w-6 md:h-6 text-inmo-secondary dark:text-white" strokeWidth={2} />} 
                  variant="secondary"
                  className="relative shrink-0 md:!w-12 md:!h-12 md:bg-white md:dark:bg-inmo-darkcard shadow-soft"
                  onClick={() => console.log('Notificaciones Admin')}
                />
              </div>
            </div>
          </header>

          {/* 2. KPIs Unificados */}
          <div className="grid grid-cols-12 md:grid-cols-[2fr_2fr_2fr_1fr] gap-3 md:gap-4 shrink-0 mt-2 relative z-0">
            
            {/* 1. MRR */}
            <div className="col-span-6 md:col-span-1 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-card p-3 md:p-5 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
                <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
                  <path d="M 0 40 L 0 30 Q 25 15 50 25 T 100 10 L 100 40 Z" fill="currentColor" />
                  <path d="M 0 30 Q 25 15 50 25 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 justify-center relative z-10">
                <span className={`font-inter text-caption md:text-xs text-gray-500 dark:text-gray-400 font-medium transition-all duration-300 ${isSplitOpen ? 'hidden' : 'block'}`}>Ingresos (MRR)</span>
                <CreditCard className={`w-3 h-3 md:w-4 md:h-4 text-gray-400 transition-all duration-300 ${isSplitOpen ? 'block' : 'hidden md:block'}`} />
              </div>
              <div className="mt-1.5 md:mt-3 relative z-10">
                <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">$42k</span>
              </div>
              <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
                <div className="px-1.5 md:px-2 py-0.5 rounded bg-green-50 dark:bg-green-900/20 text-inmo-success flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span className={`font-inter text-caption md:text-caption font-bold ${isSplitOpen ? 'hidden md:block lg:block' : ''}`}>+12.5%</span>
                </div>
              </div>
            </div>

            {/* 2. Suscripciones */}
            <div className="col-span-6 md:col-span-1 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-card p-3 md:p-5 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
                <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
                  <path d="M 0 40 L 0 25 Q 30 35 60 20 T 100 5 L 100 40 Z" fill="currentColor" />
                  <path d="M 0 25 Q 30 35 60 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 justify-center relative z-10">
                <span className={`font-inter text-caption md:text-xs text-gray-500 dark:text-gray-400 font-medium transition-all duration-300 ${isSplitOpen ? 'hidden' : 'block'}`}>Suscripciones</span>
                <Users className={`w-3 h-3 md:w-4 md:h-4 text-gray-400 transition-all duration-300 ${isSplitOpen ? 'block' : 'hidden md:block'}`} />
              </div>
              <div className="mt-1.5 md:mt-3 relative z-10">
                <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">184</span>
              </div>
              <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
                <div className="px-1.5 md:px-2 py-0.5 rounded bg-green-50 dark:bg-green-900/20 text-inmo-success flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span className={`font-inter text-caption md:text-caption font-bold ${isSplitOpen ? 'hidden md:block lg:block' : ''}`}>+5.2%</span>
                </div>
              </div>
            </div>

            {/* 3. Total Usuarios */}
            <div role="button" tabIndex={0}
              onClick={() => { setIsReportsSheetOpen(false); setIsUsersSheetOpen(true); }}
              className="col-span-8 md:col-span-1 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-card p-3 md:p-5 shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-md transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
                <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
                  <path d="M 0 40 L 0 35 Q 20 20 40 25 T 80 15 L 100 5 L 100 40 Z" fill="currentColor" />
                  <path d="M 0 35 Q 20 20 40 25 T 80 15 L 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 justify-center relative z-10">
                <span className={`font-inter text-caption md:text-xs text-gray-500 dark:text-gray-400 font-medium transition-all duration-300 ${isSplitOpen ? 'hidden' : 'block'}`}>Usuarios</span>
                <Activity className={`w-3 h-3 md:w-4 md:h-4 text-gray-400 transition-all duration-300 ${isSplitOpen ? 'block' : 'hidden md:block'}`} />
              </div>
              <div className="mt-1.5 md:mt-3 relative z-10">
                <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">12.4k</span>
              </div>
              <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
                <div className="px-1.5 md:px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-1 group-hover:bg-inmo-secondary group-hover:text-white transition-colors">
                  <span className={`font-inter text-caption md:text-caption font-bold ${isSplitOpen ? 'hidden md:block lg:block' : ''}`}>Ver Detalles</span>
                </div>
              </div>
            </div>

            {/* 4. Reportes */}
            <div role="button" tabIndex={0}
              onClick={() => { setIsUsersSheetOpen(false); setIsReportsSheetOpen(true); }}
              className="col-span-4 md:col-span-1 bg-inmo-accent text-white border border-transparent rounded-card p-3 md:p-5 shadow-glow flex flex-col items-center justify-center text-center group transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.02] active:scale-95 relative overflow-hidden"
            >
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]">
                <svg viewBox="0 0 100 40" className="w-full h-full text-white" preserveAspectRatio="none">
                  <path d="M 0 40 L 0 5 Q 30 20 60 10 T 100 25 L 100 40 Z" fill="currentColor" />
                  <path d="M 0 5 Q 30 20 60 10 T 100 25" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 justify-center relative z-10">
                <span className={`font-inter text-caption md:text-xs text-white/90 font-medium transition-all duration-300 ${isSplitOpen ? 'hidden' : 'block'}`}>Reportes</span>
                <ShieldAlert className={`w-3 h-3 md:w-4 md:h-4 text-white transition-all duration-300 ${isSplitOpen ? 'block' : 'hidden md:block'}`} />
              </div>
              <div className="mt-1.5 md:mt-3 relative z-10">
                <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-white">3</span>
              </div>
              <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
                <div className="px-1.5 md:px-2 py-0.5 rounded bg-white text-inmo-accent flex items-center gap-1">
                  <span className={`font-inter text-caption md:text-caption font-bold uppercase tracking-wider ${isSplitOpen ? 'hidden md:block lg:block' : ''}`}>Atención</span>
                </div>
              </div>
            </div>

          </div>

          {/* 3. Panel Visual: Actividad del Sistema */}
          {/* 3. Panel Visual: Actividad del Sistema */}
          <div className="flex-auto min-h-[160px] md:min-h-[220px] flex flex-col relative shrink gap-2 md:gap-3">
            <div className="relative z-10 shrink-0 hidden md:flex justify-between items-center px-2 mt-2">
              <h3 className="font-montserrat font-bold text-base md:text-lg text-inmo-secondary dark:text-white">
                Métricas del Sistema
              </h3>
            </div>

            <div className="flex-1 w-full flex flex-col md:flex-row gap-4 overflow-hidden">
              
              {/* Gráfica 1: Tráfico Semanal */}
              <div className={`flex-1 w-full md:w-1/2 bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary p-5 relative shadow-sm flex flex-col justify-between gap-4 transition-all duration-300 ${activeMobileChart === 'trafico' ? 'flex' : 'hidden md:flex'}`}>
                
                <div className="flex flex-col relative z-20">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <h4 className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Tráfico Semanal</h4>
                  </div>
                  <p className="font-inter text-caption text-gray-400 mt-0.5">Visitas en el rango seleccionado</p>
                </div>
                
                <div className="md:hidden absolute top-4 right-4 z-20">
                  <Button 
                    onClick={() => setActiveMobileChart('conversion')}
                    variant="accent"
                    className="!rounded-atom !py-1.5 !px-3 !h-auto shadow-glow active:scale-95 transition-transform"
                    icon={<Activity className="w-3.5 h-3.5 text-white" strokeWidth={2} />}
                  >
                    <span className="font-inter font-medium text-caption text-white">
                      Conversión
                    </span>
                  </Button>
                </div>
                
                <div className="flex-1 w-full h-full relative pt-2 flex items-end">
                  <div className="w-full h-full flex justify-between items-end pb-6 relative z-10">
                    {/* Barras de tráfico (Clean style) */}
                    {[40, 65, 45, 80, 55, 90, 75].map((height, idx) => (
                      <div key={idx} className="flex flex-col justify-end items-center h-full group relative cursor-pointer" style={{ width: '12%' }}>
                        <div 
                          className="w-full bg-inmo-secondary/20 dark:bg-white/20 rounded-sm relative transition-all duration-300 group-hover:bg-inmo-secondary dark:group-hover:bg-white"
                          style={{ height: `${height}%` }}
                        ></div>
                        {/* Tooltip on hover (desktop only) */}
                        <div className="hidden md:group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-inmo-secondary dark:bg-white text-white dark:text-inmo-secondary text-caption font-bold px-2 py-1 rounded shadow-lg z-30">
                          {height}k
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 pb-6 pointer-events-none flex flex-col justify-between">
                    {[100, 80, 60, 40, 20, 0].map((line, idx) => (
                      <div key={idx} className="w-full border-b border-gray-100 dark:border-gray-800"></div>
                    ))}
                  </div>

                  <div className="absolute bottom-0 w-full flex justify-between text-caption md:text-caption text-gray-400 font-inter font-medium px-1">
                    <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
                  </div>
                </div>
              </div>

              {/* Gráfica 2: Conversión */}
              <div className={`flex-1 w-full md:w-1/2 bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary p-5 relative shadow-sm flex flex-col justify-between gap-4 transition-all duration-300 ${activeMobileChart === 'conversion' ? 'flex' : 'hidden md:flex'}`}>
                
                <div className="flex flex-col relative z-20">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <h4 className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Conversión de Usuarios</h4>
                  </div>
                  <p className="font-inter text-caption text-gray-400 mt-0.5">Evolución en el rango seleccionado</p>
                </div>
                
                <div className="md:hidden absolute top-4 right-4 z-20">
                  <Button 
                    onClick={() => setActiveMobileChart('trafico')}
                    variant="accent"
                    className="!rounded-atom !py-1.5 !px-3 !h-auto shadow-glow active:scale-95 transition-transform"
                    icon={<Activity className="w-3.5 h-3.5 text-white" strokeWidth={2} />}
                  >
                    <span className="font-inter font-medium text-caption text-white">
                      Tráfico
                    </span>
                  </Button>
                </div>
                
                <div className="flex-1 w-full h-full relative pt-2 flex items-end">
                  <div className="absolute inset-0 pb-6 pointer-events-none flex flex-col justify-between">
                    {[100, 80, 60, 40, 20, 0].map((line, idx) => (
                      <div key={idx} className="w-full border-b border-gray-100 dark:border-gray-800 flex items-center justify-start relative">
                        {/* Optionally add y-axis labels on the left here if desired */}
                      </div>
                    ))}
                  </div>

                  <div className="w-full h-full pb-6 relative z-10 text-inmo-secondary dark:text-white">
                    <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      {/* Sharp solid line without gradient, inspired by screenshot */}
                      <path d="M 0 35 L 15 20 L 30 25 L 45 10 L 60 15 L 80 5 L 100 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      
                      {/* Data points */}
                      <circle cx="0" cy="35" r="1.5" fill="currentColor" stroke="var(--inmo-bg-card, white)" strokeWidth="0.5" />
                      <circle cx="15" cy="20" r="1.5" fill="currentColor" stroke="var(--inmo-bg-card, white)" strokeWidth="0.5" />
                      <circle cx="30" cy="25" r="1.5" fill="currentColor" stroke="var(--inmo-bg-card, white)" strokeWidth="0.5" />
                      <circle cx="45" cy="10" r="1.5" fill="currentColor" stroke="var(--inmo-bg-card, white)" strokeWidth="0.5" />
                      <circle cx="60" cy="15" r="1.5" fill="currentColor" stroke="var(--inmo-bg-card, white)" strokeWidth="0.5" />
                      <circle cx="80" cy="5" r="1.5" fill="currentColor" stroke="var(--inmo-bg-card, white)" strokeWidth="0.5" />
                      <circle cx="100" cy="30" r="1.5" fill="currentColor" stroke="var(--inmo-bg-card, white)" strokeWidth="0.5" />
                    </svg>
                  </div>

                  <div className="absolute bottom-0 w-full flex justify-between text-caption md:text-caption text-gray-400 font-inter font-medium px-1">
                    <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
          
        </div>
      }
    />
  );
};
