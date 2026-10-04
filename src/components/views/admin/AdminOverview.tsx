import React, { useState } from 'react';
import { Bell, Users, TrendingUp, CreditCard, ShieldAlert, Activity } from 'lucide-react';
import { ComposedChart, Area, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { PeriodSelector, type PeriodOption } from '../../molecules/PeriodSelector';
import { PeriodDropdown } from '../../molecules/PeriodDropdown';
import { IconButton } from '../../atoms/IconButton';
import { Button } from '../../atoms/Button';
import { measuredChart, periodDays, type ChartViewMode } from '../../organisms/StatisticsPanels';
import { useStatistics } from '../../../integrations/backend/hooks/useEngagement';
import { useGetAdminReports } from '../../../integrations/backend/hooks/useAdministration';
import { useGetMe } from '../../../integrations/backend/hooks/useAuth';
import { useGetNotifications, useMarkNotificationRead } from '../../../integrations/backend/hooks/useNotifications';
import { operationError } from '../../../integrations/backend/versioning';
import { BottomSheet } from '../../organisms/BottomSheet';
import { Link, useNavigate } from 'react-router-dom';
import { ModuleLayout } from '../../templates/ModuleLayout';

export const AdminOverview: React.FC = () => {
  const [isUsersSheetOpen, setIsUsersSheetOpen] = useState(false);
  const [isReportsSheetOpen, setIsReportsSheetOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('Mes');
  const [activeMobileChart, setActiveMobileChart] = useState<'trafico' | 'conversion'>('trafico');
  const [traficoViewMode, setTraficoViewMode] = useState<ChartViewMode>('dias');
  const [conversionViewMode, setConversionViewMode] = useState<ChartViewMode>('dias');

  const navigate = useNavigate(), me = useGetMe(), statistics = useStatistics(true, periodDays[selectedPeriod] ?? 30);
  const reports = useGetAdminReports({ limit: 20, estado: 'PENDIENTE' });
  const notifications = useGetNotifications(), markRead = useMarkNotificationRead();
  const [showNotifications, setShowNotifications] = useState(false);
  const audience = statistics.data?.usuarios_por_rol;
  const publicCount = audience?.GENERAL ?? 0, advisorCount = audience?.ASESOR ?? 0;
  const publicPercent = publicCount + advisorCount ? Math.round(publicCount / (publicCount + advisorCount) * 100) : 0;
  const plans = statistics.data?.suscripciones_por_plan ?? {};
  const traficoData = measuredChart(statistics.data, traficoViewMode).map(point => ({ ...point, traffic: point.views }));
  const conversionData = measuredChart(statistics.data, conversionViewMode, 'contactos').map(point => ({ ...point, conversion: point.views }));

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
              strokeDasharray="141.37" strokeDashoffset={141.37 * (1 - publicPercent / 100)} />
          </svg>
          <div className="absolute top-[85%] left-0 w-full flex flex-col items-center justify-end">
            <span className="font-montserrat font-black text-5xl md:text-6xl text-inmo-secondary dark:text-white leading-none">{statistics.data ? publicPercent + '%' : '—'}</span>
            <span className="font-inter text-caption md:text-xs font-bold text-inmo-accent mt-1 uppercase tracking-wide">Públicos</span>
          </div>
        </div>

        <div className="w-full flex justify-between items-center px-4 md:px-8 shrink-0 mt-8 md:mt-12">
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-bold text-xl md:text-2xl text-inmo-secondary dark:text-white">{statistics.data ? publicCount : '—'}</span>
            <span className="font-inter text-caption md:text-caption font-semibold text-gray-400 uppercase tracking-wider">Públicos</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-bold text-xl md:text-2xl text-gray-400 dark:text-gray-500">{statistics.data ? advisorCount : '—'}</span>
            <span className="font-inter text-caption md:text-caption font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wider">Asesores</span>
          </div>
        </div>
      </div>

      {/* Cards 2 & 3: KPIs */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 shrink-0">
        <div className="bg-white dark:bg-inmo-darkcard rounded-card p-4 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col justify-between relative h-full min-h-[96px] overflow-hidden">
          <p className="font-inter text-xs font-semibold text-gray-500 uppercase tracking-wider">Nuevos</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-montserrat font-black text-3xl text-inmo-secondary dark:text-white">{statistics.data?.usuarios_nuevos ?? '—'}</span>
            <div className="flex flex-col items-center justify-center text-inmo-success">

              <p className="font-inter text-caption font-semibold mt-0.5">{selectedPeriod}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-inmo-darkcard rounded-card p-4 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col justify-between relative h-full min-h-[96px] overflow-hidden">
          <p className="font-inter text-xs font-semibold text-gray-500 uppercase tracking-wider">Bajas</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-montserrat font-black text-3xl text-inmo-secondary dark:text-white">{statistics.data?.bajas_permanentes ?? '—'}</span>
            <div className="flex flex-col items-center justify-center text-inmo-danger">

              <p className="font-inter text-caption font-semibold mt-0.5">{selectedPeriod}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 bg-white dark:bg-inmo-darkcard rounded-card p-4 md:p-5 border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col justify-between">
        <p className="text-xs font-bold text-gray-400 uppercase mb-3">Suscripciones vigentes por plan</p>
        {Object.entries(plans).map(([name, count]) => <div key={name} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-inmo-darktertiary"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-inmo-darkbg flex items-center justify-center"><CreditCard className="w-4 h-4" /></div><span className="font-inter text-sm font-semibold">{name}</span></div><span className="font-montserrat font-bold text-lg">{count}</span></div>)}
        {statistics.data && Object.keys(plans).length === 0 && <p className="text-sm text-gray-500">No hay periodos pagados vigentes.</p>}
        <Link to="/admin/asesores" className="text-inmo-accent font-semibold text-sm text-center pt-4">Gestionar usuarios</Link>
      </div>
    </div>
  );

  const reportsSideContent = (
    <div className="flex flex-col gap-4">
      {reports.isPending && <p>Cargando reportes…</p>}
      {reports.isError && <p role="alert">{operationError(reports.error)}<button className="text-inmo-accent block" onClick={() => void reports.refetch()}>Reintentar</button></p>}
      {reports.data?.items.length === 0 && <p className="text-sm text-gray-500">No hay reportes pendientes.</p>}
      {reports.data?.items.map(report => <button key={report.id} onClick={() => navigate('/admin/reportes?report=' + report.id)} className="text-left bg-white dark:bg-inmo-darkcard rounded-2xl p-4 border border-red-50 dark:border-red-900/10 shadow-sm hover:border-inmo-danger/50 hover:shadow-md transition-all flex gap-3 items-start group"><div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl text-inmo-danger group-hover:scale-110"><ShieldAlert className="w-5 h-5" /></div><div className="flex-1 min-w-0"><div className="flex justify-between items-start gap-2"><span className="font-inter font-semibold text-sm line-clamp-1">{report.tipo_objetivo} #{report.objetivo_id}</span><span className="text-caption font-bold text-inmo-danger rounded-full bg-red-50 dark:bg-red-900/20 px-2 py-0.5">{report.estado}</span></div><p className="text-xs text-gray-500 mt-1 line-clamp-1">{report.motivo}</p><p className="text-caption text-gray-400 mt-3">{new Date(report.registrado_at).toLocaleString('es-MX')} · {report.categoria}</p></div></button>)}
      <Button onClick={() => navigate('/admin/reportes')} className="w-full mt-2 py-3 rounded-xl border border-gray-200 dark:border-inmo-darktertiary text-inmo-secondary dark:text-white font-inter font-semibold text-xs hover:bg-gray-50 dark:hover:bg-inmo-darktertiary transition-colors">
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
    <>
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
        <ModuleLayout
          title={'Hola, ' + (me.data?.value.nombre.split(' ')[0] ?? 'Admin')}
          subtitle="Panel de Control Global"
          isFullScreen={true}
          showSearch={false}
          showFilters={false}
          headerEndContent={
            <>
              {/* Selector de Periodo Desktop - CENTRADO */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-30 w-full max-w-[400px] xl:max-w-[450px]">
                <PeriodSelector
                  selectedPeriod={selectedPeriod}
                  onChange={setSelectedPeriod}
                />
              </div>

              <div className="flex items-center gap-2 flex-1 justify-end">
                {/* Selector de Periodo Mobile */}
                <PeriodDropdown
                  selectedPeriod={selectedPeriod}
                  onChange={setSelectedPeriod}
                  options={['Semana', 'Mes', '3 Meses', '6 Meses', 'Año']}
                  className="md:hidden"
                />

                <Link to="/admin/solicitudes" className="rounded-full bg-white dark:bg-inmo-darkcard shadow-soft px-3 py-2 text-xs font-bold text-inmo-accent">Autorizaciones{statistics.data ? ' · ' + statistics.data.autorizaciones_pendientes : ''}</Link><div className="relative z-20">
                  <IconButton
                    icon={<Bell className="w-5 h-5 md:w-6 md:h-6 text-inmo-secondary dark:text-white" strokeWidth={2} />}
                    variant="secondary"
                    className="relative shrink-0 md:!w-12 md:!h-12 md:bg-white md:dark:bg-inmo-darkcard shadow-soft"
                    onClick={() => setShowNotifications(true)} aria-label="Abrir notificaciones"
                  />
                </div>
              </div>
            </>
          }
        >
          <div className="flex flex-col gap-3 md:gap-4 h-full w-full animate-in fade-in">

          {statistics.isError && <p role="alert">{operationError(statistics.error)}<button onClick={() => void statistics.refetch()} className="ml-3 text-inmo-accent">Reintentar</button></p>}
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
                <span className={`font-inter text-caption md:text-xs text-gray-500 dark:text-gray-400 font-medium transition-all duration-300 ${isSplitOpen ? 'hidden' : 'block'}`}>Ingresos confirmados</span>
                <CreditCard className={`w-3 h-3 md:w-4 md:h-4 text-gray-400 transition-all duration-300 ${isSplitOpen ? 'block' : 'hidden md:block'}`} />
              </div>
              <div className="mt-1.5 md:mt-3 relative z-10">
                <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">{statistics.data ? Number(statistics.data.ingresos_confirmados_mxn).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }) : '—'}</span>
              </div>
              <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
                <div className="px-1.5 md:px-2 py-0.5 rounded bg-green-50 dark:bg-green-900/20 text-inmo-success flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span className={`font-inter text-caption md:text-caption font-bold ${isSplitOpen ? 'hidden md:block lg:block' : ''}`}>{selectedPeriod} · MXN</span>
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
                <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">{statistics.data ? Object.values(plans).reduce((sum, value) => sum + value, 0) : '—'}</span>
              </div>
              <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
                <div className="px-1.5 md:px-2 py-0.5 rounded bg-green-50 dark:bg-green-900/20 text-inmo-success flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span className={`font-inter text-caption md:text-caption font-bold ${isSplitOpen ? 'hidden md:block lg:block' : ''}`}>Vigentes</span>
                </div>
              </div>
            </div>

            {/* 3. Total Usuarios */}
            <div role="button" tabIndex={0}
              onClick={() => { setIsReportsSheetOpen(false); setIsUsersSheetOpen(true); }}
              onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setIsReportsSheetOpen(false); setIsUsersSheetOpen(true); } }}
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
                <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">{statistics.data ? Object.values(audience ?? {}).reduce((sum, value) => sum + value, 0) : '—'}</span>
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
              onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setIsUsersSheetOpen(false); setIsReportsSheetOpen(true); } }}
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
                <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-white">{statistics.data?.reportes_pendientes ?? '—'}</span>
              </div>
              <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
                <div className="px-1.5 md:px-2 py-0.5 rounded bg-white text-inmo-accent flex items-center gap-1">
                  <span className={`font-inter text-caption md:text-caption font-bold uppercase tracking-wider ${isSplitOpen ? 'hidden md:block lg:block' : ''}`}>Atención</span>
                </div>
              </div>
            </div>

          </div>

          {/* 3. Panel Visual: Actividad del Sistema */}
          <div className="flex-auto min-h-[160px] md:min-h-[220px] flex flex-col relative shrink gap-2 md:gap-3">
            <div className="relative z-10 shrink-0 hidden md:flex justify-between items-center px-2 mt-2">
              <h3 className="font-montserrat font-bold text-base md:text-lg text-inmo-secondary dark:text-white">
                Métricas del Sistema
              </h3>
            </div>

            <div className="flex-1 w-full flex flex-col md:flex-row gap-4 overflow-hidden">

              {/* Gráfica 1: Tráfico Semanal */}
              <div className={`flex-1 w-full md:w-1/2 bg-white dark:bg-inmo-darkcard rounded-card border-4 border-white dark:border-inmo-darkcard shadow-soft p-5 relative flex flex-col justify-between gap-4 transition-all duration-300 ${activeMobileChart === 'trafico' ? 'flex' : 'hidden md:flex'}`}>

                <div className="flex justify-between items-start relative z-20 w-full">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <h4 className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Tráfico</h4>
                    </div>
                    <p className="font-inter text-caption text-gray-400 mt-0.5">Visitas en el rango seleccionado</p>
                  </div>
                  {['6 Meses', 'Año'].includes(selectedPeriod) && (
                    <div className="hidden md:flex bg-gray-100 dark:bg-inmo-darkbg rounded-lg p-0.5 ml-auto">
                      <button
                        onClick={() => setTraficoViewMode('dias')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${traficoViewMode === 'dias' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >Días</button>
                      <button
                        onClick={() => setTraficoViewMode('semanas')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${traficoViewMode === 'semanas' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >Semanas</button>
                      <button
                        onClick={() => setTraficoViewMode('meses')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${traficoViewMode === 'meses' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >Meses</button>
                    </div>
                  )}
                </div>

                <div className="md:hidden absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                  <Button
                    onClick={() => setActiveMobileChart('conversion')}
                    variant="accent"
                    className="!rounded-atom !py-1.5 !px-3 !h-auto shadow-glow active:scale-95 transition-transform"
                    icon={<Activity className="w-3.5 h-3.5 text-white" strokeWidth={2} />}
                  >
                    <span className="font-inter font-medium text-caption text-white">
                      Contactos
                    </span>
                  </Button>
                  {['6 Meses', 'Año'].includes(selectedPeriod) && (
                    <div className="flex bg-gray-100 dark:bg-inmo-darkbg rounded-lg p-0.5">
                      <button
                        onClick={() => setTraficoViewMode('dias')}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${traficoViewMode === 'dias' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500'}`}
                      >Días</button>
                      <button
                        onClick={() => setTraficoViewMode('semanas')}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${traficoViewMode === 'semanas' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500'}`}
                      >Sem.</button>
                      <button
                        onClick={() => setTraficoViewMode('meses')}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${traficoViewMode === 'meses' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500'}`}
                      >Meses</button>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full h-[200px] md:h-full relative pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={traficoData}
                      margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-white/5" />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', className: 'text-gray-400 font-inter text-[11px]' }}
                        dy={10}
                        minTickGap={30}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', className: 'text-gray-400 font-inter text-[11px]' }}
                        tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`}
                      />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-white/10 rounded-xl p-3 shadow-soft font-inter">
                                <p className="font-montserrat font-bold text-inmo-secondary dark:text-gray-200 mb-1">{label}</p>
                                <p className="text-inmo-accent font-bold text-xs">
                                  Visitas: {Number(payload[0].value).toLocaleString('es-MX')}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                        cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
                      />
                      <Bar dataKey="traffic" fill="currentColor" className="text-inmo-accent" radius={[6, 6, 0, 0]} fillOpacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfica 2: Contactos */}
              <div className={`flex-1 w-full md:w-1/2 bg-white dark:bg-inmo-darkcard rounded-card border-4 border-white dark:border-inmo-darkcard shadow-soft p-5 relative flex flex-col justify-between gap-4 transition-all duration-300 ${activeMobileChart === 'conversion' ? 'flex' : 'hidden md:flex'}`}>

                <div className="flex justify-between items-start relative z-20 w-full">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <h4 className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Contactos por inmueble</h4>
                    </div>
                    <p className="font-inter text-caption text-gray-400 mt-0.5">Primer mensaje de cada cliente por inmueble</p>
                  </div>
                  {['6 Meses', 'Año'].includes(selectedPeriod) && (
                    <div className="hidden md:flex bg-gray-100 dark:bg-inmo-darkbg rounded-lg p-0.5 ml-auto">
                      <button
                        onClick={() => setConversionViewMode('dias')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${conversionViewMode === 'dias' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >Días</button>
                      <button
                        onClick={() => setConversionViewMode('semanas')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${conversionViewMode === 'semanas' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >Semanas</button>
                      <button
                        onClick={() => setConversionViewMode('meses')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${conversionViewMode === 'meses' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >Meses</button>
                    </div>
                  )}
                </div>

                <div className="md:hidden absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
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
                  {['6 Meses', 'Año'].includes(selectedPeriod) && (
                    <div className="flex bg-gray-100 dark:bg-inmo-darkbg rounded-lg p-0.5">
                      <button
                        onClick={() => setConversionViewMode('dias')}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${conversionViewMode === 'dias' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500'}`}
                      >Días</button>
                      <button
                        onClick={() => setConversionViewMode('semanas')}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${conversionViewMode === 'semanas' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500'}`}
                      >Sem.</button>
                      <button
                        onClick={() => setConversionViewMode('meses')}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${conversionViewMode === 'meses' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500'}`}
                      >Meses</button>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full h-[200px] md:h-full relative pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={conversionData}
                      margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="adminConversionGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="currentColor" className="text-inmo-accent" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="currentColor" className="text-inmo-accent" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-white/5" />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', className: 'text-gray-400 font-inter text-[11px]' }}
                        dy={10}
                        minTickGap={30}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', className: 'text-gray-400 font-inter text-[11px]' }}
                        allowDecimals={false}
                      />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-white/10 rounded-xl p-3 shadow-soft font-inter">
                                <p className="font-montserrat font-bold text-inmo-secondary dark:text-gray-200 mb-1">{label}</p>
                                <p className="text-inmo-accent font-bold text-xs">
                                  Contactos: {payload[0].value}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                        cursor={{ stroke: 'currentColor', className: 'text-gray-100 dark:text-white/5' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="conversion"
                        stroke="none"
                        fillOpacity={1}
                        fill="url(#adminConversionGradient)"
                        activeDot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="conversion"
                        stroke="currentColor"
                        strokeWidth={3}
                        dot={false}
                        className="text-inmo-accent [filter:drop-shadow(0px_8px_8px_theme(colors.inmo.accent))]"
                        activeDot={{ r: 6, strokeWidth: 0, fill: "currentColor", className: "text-inmo-accent" }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
          <p className="text-[10px] text-gray-400 shrink-0">{statistics.data && `${new Date(statistics.data.desde).toLocaleDateString('es-MX')} – ${new Date(statistics.data.hasta).toLocaleDateString('es-MX')} · CDMX. Instrumentación desde ${new Date(statistics.data.instrumentacion_desde).toLocaleDateString('es-MX')}.`}</p>
          </div>
        </ModuleLayout>
      }
    />
    <BottomSheet isOpen={showNotifications} onClose={() => setShowNotifications(false)} title="Notificaciones"><div className="space-y-3 p-4">{notifications.data?.items.map(item => <Button key={item.id} variant="ghost" className="w-full !justify-start text-left" onClick={() => { if (!item.leida_at) markRead.mutate(item.id); }}>{item.tipo.replaceAll('_', ' ')} · {new Date(item.creada_at).toLocaleString('es-MX')}{!item.leida_at ? ' · Nueva' : ''}</Button>)}{notifications.isPending && <p>Cargando…</p>}{notifications.data?.items.length === 0 && <p>No hay notificaciones.</p>}{(notifications.isError || markRead.isError) && <p role="alert">{operationError(notifications.error ?? markRead.error)}</p>}</div></BottomSheet>
    </>
  );
};
