import React, { useState } from 'react';
import { Bell, Heart, TrendingUp, Podium, Briefcase, Activity } from 'lucide-react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ZoneDistributionMap } from '../../organisms/ZoneDistributionMap';
import { BottomSheet } from '../../organisms/BottomSheet';
import { IconButton } from '../../atoms/IconButton';
import { Button } from '../../atoms/Button';
import { useStatistics } from '../../../integrations/backend/hooks/useEngagement';
import { useGetMe } from '../../../integrations/backend/hooks/useAuth';
import { useGetNotifications, useMarkNotificationRead } from '../../../integrations/backend/hooks/useNotifications';
import { operationError } from '../../../integrations/backend/versioning';

import { PeriodSelector } from '../../molecules/PeriodSelector';
import { PeriodDropdown } from '../../molecules/PeriodDropdown';

import { ModuleLayout } from '../../templates/ModuleLayout';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { measuredChart, periodDays, PortfolioStatistics, PropertyRanking, type ChartViewMode } from '../../organisms/StatisticsPanels';


export const AsesorOverview: React.FC = () => {
  const me = useGetMe(), notifications = useGetNotifications(), markRead = useMarkNotificationRead();

  const [activeSidePanel, setActiveSidePanel] = useState<'ranking' | 'portafolio' | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Mes');
  const [chartViewMode, setChartViewMode] = useState<ChartViewMode>('dias');
  const statistics = useStatistics(false, periodDays[selectedPeriod] ?? 30);
  const unread = notifications.data?.items.filter(item => !item.leida_at) ?? [];
  const notificationItems = notifications.data?.items.map(item => ({ id: item.id, title: item.tipo.replaceAll('_', ' '), body: 'Notificación de tu cuenta', time: new Date(item.creada_at).toLocaleString('es-MX'), unread: !item.leida_at })) ?? [];

  const currentChartData = measuredChart(statistics.data, chartViewMode);

  const renderMainContent = () => (
    <ModuleLayout
      title={'Hola, ' + (me.data?.value.nombre.split(' ')[0] ?? 'Asesor')}
      subtitle="Tu resumen del día"
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

            <div className="relative z-20">
              <IconButton
                icon={<Bell className="w-5 h-5 md:w-6 md:h-6 text-inmo-secondary dark:text-white" strokeWidth={2} />}
                variant="secondary"
                className="relative shrink-0 md:!w-12 md:!h-12 md:bg-white md:dark:bg-inmo-darkcard shadow-soft"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                {unread.length > 0 && <span className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 md:w-2.5 md:h-2.5 bg-inmo-accent rounded-full border border-white dark:border-inmo-darkcard"></span>}
              </IconButton>

              {/* Desktop Notifications Dropdown (Hidden on Mobile) */}
              {isNotificationsOpen && (
                <div className="hidden md:block fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)}></div>
              )}

              <div
                className={`hidden md:block absolute right-0 top-full mt-4 w-[340px] bg-white dark:bg-inmo-darkcard rounded-2xl shadow-xl border border-gray-100 dark:border-inmo-darktertiary z-20 overflow-hidden transition-all duration-200 origin-top-right ${
                  isNotificationsOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
                }`}
              >
                <div className="p-4 border-b border-gray-100 dark:border-inmo-darktertiary flex justify-between items-center">
                  <span className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Notificaciones</span>
                  <span
                    className="text-xs text-inmo-accent font-bold cursor-pointer hover:underline"
                    onClick={() => { for (const item of unread) markRead.mutate(item.id); }}
                  >
                    Marcar cargadas como leídas
                  </span>
                </div>
                <div className="flex flex-col max-h-[360px] overflow-y-auto">
                   {notificationItems.map(n => (
                     <button type="button" onClick={() => { if (n.unread) markRead.mutate(n.id); }} key={n.id} className="text-left p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                       <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${n.unread ? 'bg-inmo-accent' : 'bg-transparent'}`} />
                       <div className="flex flex-col">
                         <span className="text-xs font-bold text-inmo-secondary dark:text-white">{n.title}</span>
                         <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.body}</span>
                         <span className="text-[10px] text-gray-400 mt-2">{n.time}</span>
                       </div>
                     </button>
                   ))}
                   {notifications.isError && <p role="alert" className="p-4">{operationError(notifications.error)}</p>}
                   {notificationItems.length === 0 && <p className="p-4 text-sm text-gray-500">{notifications.isPending ? 'Cargando…' : 'No hay notificaciones.'}</p>}
                </div>
              </div>
            </div>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-4 md:gap-6 animate-in fade-in h-full">

      {statistics.isError && <p role="alert">{operationError(statistics.error)}</p>}
      {/* 3. KPIs Unificados + Botones Laterales */}
      {/* Mobile: 12-col grid | Desktop: flex row so button column can auto-shrink */}
      <div className="grid grid-cols-12 md:flex md:flex-row gap-3 md:gap-4 shrink-0">

        {/* Nuevos contactos */}
        <div className="col-span-4 md:flex-1 order-1 md:order-1 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-card p-3 md:p-5 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 relative overflow-hidden hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 delay-[100ms] fill-mode-both min-w-0">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 30 Q 25 15 50 25 T 100 10 L 100 40 Z" fill="currentColor" />
              <path d="M 0 30 Q 25 15 50 25 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 justify-center relative z-10">
            <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Nuevos Leads</span>
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          </div>
          <div className="mt-1.5 md:mt-3 relative z-10">
            <span className="font-montserrat font-bold text-2xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">{statistics.data?.contactos ?? '—'}</span>
          </div>
          <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
            <div className="px-1.5 md:px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-1 group-hover:bg-inmo-secondary group-hover:text-white transition-colors">
              <span className="font-inter text-[9px] md:text-caption font-bold">{selectedPeriod}</span>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="col-span-4 md:flex-1 order-2 md:order-2 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-card p-3 md:p-5 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 relative overflow-hidden hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 delay-[200ms] fill-mode-both min-w-0">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 25 Q 30 35 60 20 T 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 25 Q 30 35 60 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 justify-center relative z-10">
            <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Mensajes</span>
            <Bell className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          </div>
          <div className="mt-1.5 md:mt-3 relative z-10">
            <span className="font-montserrat font-bold text-2xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">{statistics.data?.mensajes_no_leidos ?? '—'}</span>
          </div>
          <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
            <div className="px-1.5 md:px-2 py-0.5 rounded bg-inmo-warning/10 dark:bg-inmo-warning/20 text-inmo-warning flex items-center gap-1">
              <span className="font-inter text-[9px] md:text-caption font-bold">Pendientes</span>
            </div>
          </div>
        </div>

        {/* Botones Interactivos Desktop (Stacked on Mobile too) */}
        <div className={`col-span-4 order-3 md:order-5 flex flex-col gap-2 md:gap-3 h-full animate-in fade-in slide-in-from-bottom-4 delay-[500ms] fill-mode-both transition-[width,flex,min-width] ease-[cubic-bezier(0.4,0,0.2,1)] duration-500 ${
          activeSidePanel !== null ? 'md:flex-none md:w-[64px]' : 'md:flex-1 md:min-w-0 delay-500'
        }`}>
          <button
            onClick={() => setActiveSidePanel('ranking')}
            className={`bg-inmo-accent text-white font-inter font-bold overflow-hidden flex flex-col md:flex-row items-center justify-center flex-1 rounded-[16px] md:rounded-[20px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] w-full ${
              activeSidePanel === 'ranking'
                ? 'opacity-50 cursor-default'
                : 'shadow-glow hover:bg-red-600 active:scale-95 cursor-pointer hover:scale-[1.02]'
            } ${
              activeSidePanel !== null
                ? 'gap-0 p-0'
                : 'gap-1 md:gap-3 px-1 md:px-5 py-2 md:py-0 delay-500'
            }`}
          >
            <Podium className="w-4 h-4 md:w-6 md:h-6 text-white shrink-0" strokeWidth={1.5} />
            <span className={`font-inter font-medium text-[9px] md:text-sm lg:text-base text-white whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              activeSidePanel !== null
                ? 'md:max-w-0 md:opacity-0 md:w-0 md:hidden'
                : 'max-w-[120px] opacity-100 delay-[800ms]'
            }`}>Ranking</span>
          </button>

          <button
            onClick={() => setActiveSidePanel('portafolio')}
            className={`font-inter font-bold overflow-hidden flex flex-col md:flex-row items-center justify-center flex-1 bg-white dark:bg-inmo-darkcard text-inmo-secondary dark:text-white shadow-soft rounded-[16px] md:rounded-[20px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] w-full ${
              activeSidePanel === 'portafolio'
                ? 'opacity-50 cursor-default'
                : 'hover:bg-gray-100 dark:hover:bg-inmo-darkbg active:scale-95 cursor-pointer hover:scale-[1.02]'
            } ${
              activeSidePanel !== null
                ? 'gap-0 p-0'
                : 'gap-1 md:gap-3 px-1 md:px-5 py-2 md:py-0 delay-500'
            }`}
          >
            <Briefcase className="w-4 h-4 md:w-6 md:h-6 shrink-0 text-inmo-secondary dark:text-white" strokeWidth={1.5} />
            <span className={`font-inter font-medium text-[9px] md:text-sm lg:text-base text-inmo-secondary dark:text-white whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              activeSidePanel !== null
                ? 'md:max-w-0 md:opacity-0 md:w-0 md:hidden'
                : 'max-w-[120px] opacity-100 delay-[800ms]'
            }`}>Portafolio</span>
          </button>
        </div>

        {/* Visitas */}
        <div className="col-span-6 md:flex-1 order-4 md:order-3 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-card p-3 md:p-5 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 relative overflow-hidden hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 delay-[300ms] fill-mode-both min-w-0">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 35 Q 20 20 40 25 T 80 15 L 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 35 Q 20 20 40 25 T 80 15 L 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 justify-center relative z-10">
            <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Visitas</span>
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          </div>
          <div className="mt-1.5 md:mt-3 relative z-10">
            <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">{statistics.data?.visitas ?? '—'}</span>
          </div>
          <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
            <div className="px-1.5 md:px-2 py-0.5 rounded bg-inmo-success/10 dark:bg-inmo-success/20 text-inmo-success flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span className="font-inter text-caption md:text-caption font-bold">{selectedPeriod}</span>
            </div>
          </div>
        </div>

        {/* Favoritos */}
        <div className="col-span-6 md:flex-1 order-5 md:order-4 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-card p-3 md:p-5 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 relative overflow-hidden hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 delay-[400ms] fill-mode-both min-w-0">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 5 Q 30 20 60 10 T 100 25 L 100 40 Z" fill="currentColor" />
              <path d="M 0 5 Q 30 20 60 10 T 100 25" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 justify-center relative z-10">
            <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Favoritos</span>
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          </div>
          <div className="mt-1.5 md:mt-3 relative z-10">
            <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">{statistics.data?.favoritos ?? '—'}</span>
          </div>
          <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
            <div className="px-1.5 md:px-2 py-0.5 rounded bg-inmo-success/10 dark:bg-inmo-success/20 text-inmo-success flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span className="font-inter text-caption md:text-caption font-bold">Guardados actualmente</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Mapa Interactivo y Gráfica */}
      <div className="flex-auto min-h-[160px] flex flex-col md:flex-row gap-4 relative shrink animate-in fade-in slide-in-from-bottom-8 duration-700 delay-[600ms] fill-mode-both -mb-[112px] md:mb-0">

        <ZoneDistributionMap data={statistics.data} />

        {/* Gráfica de Tráfico (30%) */}
        <div className="flex w-full min-h-[300px] md:min-h-0 md:w-[30%] bg-white dark:bg-inmo-darkcard rounded-card border-4 border-white dark:border-inmo-darkcard shadow-soft p-5 relative flex-col justify-between gap-4 transition-all duration-300">
          <div className="flex justify-between items-start relative z-20 w-full">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-gray-400" />
                <h4 className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Tráfico</h4>
              </div>
              <p className="font-inter text-caption text-gray-400 mt-0.5">Visitas a tu portafolio</p>
            </div>
            {['6 Meses', 'Año'].includes(selectedPeriod) && (
              <div className="flex bg-gray-100 dark:bg-inmo-darkbg rounded-lg p-0.5 ml-auto">
                <button
                  onClick={() => setChartViewMode('dias')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartViewMode === 'dias' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >Días</button>
                <button
                  onClick={() => setChartViewMode('semanas')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartViewMode === 'semanas' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >Semanas</button>
                <button
                  onClick={() => setChartViewMode('meses')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartViewMode === 'meses' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >Meses</button>
              </div>
            )}
          </div>

          <div className="flex-1 w-full h-full relative pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="currentColor" className="text-inmo-accent" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="currentColor" className="text-inmo-accent" stopOpacity={0} />
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
                  tickFormatter={(value) => `${value}`}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-white/10 rounded-xl p-3 shadow-soft font-inter">
                          <p className="font-montserrat font-bold text-inmo-secondary dark:text-gray-200 mb-1">{label}</p>
                          <p className="text-inmo-accent font-bold text-xs">
                            Visitas: {payload[0].value}
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
                  dataKey="views"
                  stroke="none"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  activeDot={false}
                />
                <Line
                  type="monotone"
                  dataKey="views"
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
      <p className="text-[10px] text-gray-400">{statistics.data && `${new Date(statistics.data.desde).toLocaleDateString('es-MX')} – ${new Date(statistics.data.hasta).toLocaleDateString('es-MX')} · CDMX. Visitas instrumentadas desde ${new Date(statistics.data.instrumentacion_desde).toLocaleDateString('es-MX')}.`}</p>
      </div>
    </ModuleLayout>
  );

  const renderSideContent = () => activeSidePanel === 'ranking' ? <PropertyRanking data={statistics.data} /> : <PortfolioStatistics data={statistics.data} />;

  return (
    <>
    <SplitViewLayout
      isOpen={activeSidePanel !== null}
      onClose={() => setActiveSidePanel(null)}
      sideTitle={activeSidePanel === 'ranking' ? 'Ranking Inmuebles' : 'Análisis de Portafolio'}
      sidePosition="left"
      sideContent={renderSideContent()}
      mainContent={renderMainContent()}
      sidePanelWidthClass="w-full md:w-[30%]"
      mainPanelWidthClass="md:w-[70%]"
      bottomSheetNoPadding={false}
      desktopNoPadding={false}
    />
    <div className="md:hidden"><BottomSheet isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} title="Notificaciones"><div className="space-y-3 p-4">{notificationItems.map(item => <Button key={item.id} variant="ghost" className="w-full !justify-start text-left" onClick={() => { if (item.unread) markRead.mutate(item.id); }}>{item.title} · {item.time}{item.unread ? ' · Nueva' : ''}</Button>)}{notifications.isError && <p role="alert">{operationError(notifications.error)}</p>}{notificationItems.length === 0 && <p>{notifications.isPending ? 'Cargando…' : 'No hay notificaciones.'}</p>}{markRead.isError && <p role="alert">{operationError(markRead.error)}</p>}</div></BottomSheet></div>
    </>
  );
};
