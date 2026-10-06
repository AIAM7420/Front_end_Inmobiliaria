import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { UserCheck, CheckCircle2, MoreVertical, ChevronRight, Mail, Phone, UserMinus } from 'lucide-react';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { ModuleLayout } from '../../templates/ModuleLayout';
import { SearchBar } from '../../molecules/SearchBar';
import { Button } from '../../atoms/Button';
import { AdminUsersNavigation } from '../../molecules/AdminUsersNavigation';
import { IconButton } from '../../atoms/IconButton';
import { Textarea } from '../../atoms/Textarea';
import { ConfirmModal } from '../../molecules/ConfirmModal';
import { ConflictNotice } from '../../molecules/ConflictNotice';
import { getAdminAccounts, getAccountSummary } from '../../../integrations/backend/administration.service';
import { useGetAdminAccount, useChangeAdminAccountState } from '../../../integrations/backend/hooks/useAdministration';
import { useStatistics } from '../../../integrations/backend/hooks/useEngagement';
import { downloadCSV } from '../../../integrations/backend/operations.service';
import { operationError, isVersionConflict } from '../../../integrations/backend/versioning';
export function AdminUsersView() {
  const [activeTab, setActiveTab] = useState<'activos' | 'suspendidos'>('activos');
  const [searchQuery, setSearchQuery] = useState(''), [showConfirm, setShowConfirm] = useState(false), [reason, setReason] = useState(''), [conflict, setConflict] = useState(false);
  const [params, setParams] = useSearchParams(), selectedId = params.get('cuenta');
  const state = activeTab === 'activos' ? 'ACTIVA' : 'INACTIVA';
  const list = useInfiniteQuery({ queryKey: ['admin', 'accounts', searchQuery, state], queryFn: ({ pageParam }) => getAdminAccounts({ limit: 20, cursor: pageParam, texto: searchQuery, estado: state }), initialPageParam: undefined as string | undefined, getNextPageParam: page => page.next_cursor ?? undefined });
  const accounts = list.data?.pages.flatMap(page => page.items) ?? [];
  const summaries = useQueries({ queries: accounts.map(account => ({ queryKey: ['admin', 'account-summary', account.id], queryFn: () => getAccountSummary(account.id), staleTime: 30_000 })) });
  const displayedUsers = accounts.map((account, index) => ({ id: account.id, name: account.nombre, email: account.correo, avatar: null, phone: account.telefono, plan: summaries[index]?.data?.plan ?? (summaries[index]?.isError ? 'Error al consultar' : summaries[index]?.isPending ? '…' : 'Sin periodo vigente'), properties: summaries[index]?.data?.propiedades ?? '—', status: account.estado === 'ACTIVA' ? 'active' : 'suspended' }));
  const statistics = useStatistics(true, 30), detail = useGetAdminAccount(selectedId ?? ''), change = useChangeAdminAccountState();
  const summary = useQuery({ queryKey: ['admin', 'account-summary', selectedId], queryFn: () => getAccountSummary(selectedId!), enabled: !!selectedId });
  const isOpen = selectedId !== null;
  const setSelectedId = (id: string | null) => { setParams(id ? { cuenta: id } : {}); setReason(''); setConflict(false); setShowConfirm(false); change.reset(); };
  const handleCloseDetail = () => { setSelectedId(null); setReason(''); setConflict(false); change.reset(); };
  const exportCSV = useMutation({ mutationFn: () => downloadCSV('usuarios', { texto: searchQuery, estado: state }) });
  const handleStatusChange = async () => {
    if (!detail.data || conflict || !reason.trim()) throw new Error('Revisa la cuenta y escribe un motivo.');
    try { await change.mutateAsync({ id: detail.data.value.id, accion: detail.data.value.estado === 'ACTIVA' ? 'INACTIVAR' : 'ACTIVAR', motivo: reason.trim(), etag: detail.data.etag }); setReason(''); await summary.refetch(); }
    catch (error) { if (isVersionConflict(error)) { setConflict(true); setShowConfirm(false); } throw error; }
  };
  const renderKpiContent = () => (
    <>
      <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-card border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
          <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-info" preserveAspectRatio="none">
            <path d="M 0 40 L 0 30 Q 25 15 50 25 T 100 10 L 100 40 Z" fill="currentColor" />
            <path d="M 0 30 Q 25 15 50 25 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-secondary dark:text-white mb-1">
            {statistics.data ? Object.values(statistics.data.usuarios_por_rol ?? {}).reduce((sum, count) => sum + count, 0) : '—'}
          </span>
          <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Usuarios Totales</span>
        </div>
      </div>

      <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-card border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
          <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-success" preserveAspectRatio="none">
            <path d="M 0 40 L 0 35 Q 20 20 40 25 T 80 15 L 100 5 L 100 40 Z" fill="currentColor" />
            <path d="M 0 35 Q 20 20 40 25 T 80 15 L 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-secondary dark:text-white mb-1">
            {statistics.data?.usuarios_por_rol?.ASESOR ?? '—'}
          </span>
          <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Asesores registrados</span>
        </div>
      </div>

      <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-card border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
          <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-accent" preserveAspectRatio="none">
            <path d="M 0 40 L 0 25 Q 30 35 60 20 T 100 5 L 100 40 Z" fill="currentColor" />
            <path d="M 0 25 Q 30 35 60 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-accent mb-1">
            {statistics.data?.autorizaciones_pendientes ?? '—'}
          </span>
          <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Autorizaciones Pendientes</span>
        </div>
      </div>
    </>
  );

  const mainContent = (
    <ModuleLayout
      title="Usuarios de la Plataforma"
      subtitle="Gestiona accesos, planes y verifica las autorizaciones de nuevos asesores."
      isFullScreen={true}
      noScroll={true}
      showSearch={false}
      controlsMaxWidthClass="md:hidden"
      actions={
        <div className="flex flex-col gap-3 w-full shrink-0">
          <SearchBar
            placeholder="Buscar por nombre..."
            size="slim"
            className="w-full"
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <div className="flex bg-gray-100 dark:bg-inmo-darkbg rounded-lg p-1 w-full shrink-0">
            <button
              onClick={() => { setActiveTab('activos'); setSelectedId(null); }}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'activos' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Activos
            </button>
            <button
              onClick={() => { setActiveTab('suspendidos'); setSelectedId(null); }}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'suspendidos' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Suspendidos
            </button>
          </div>
        </div>
      }
    >
      <AdminUsersNavigation />
      <div className="flex flex-col md:flex-row w-full flex-1 min-h-0 gap-6 font-inter pb-0 md:pb-6 mt-4">
        {/* KPI Panel (Desktop, when no selection) */}
        {!isOpen && (
          <div className="hidden md:flex flex-col w-[15%] lg:w-[12%] gap-4 h-full shrink-0">
            {renderKpiContent()}
          </div>
        )}

        {/* Table / List */}
        <div className="flex flex-col h-full flex-1 min-w-0 gap-6">
          {/* Desktop Controls */}
          <div className="hidden md:flex gap-3 w-full items-center">
            <SearchBar
              placeholder="Buscar por nombre..."
              size="slim"
              className="flex-1 md:flex-none md:w-[350px] min-w-0"
              value={searchQuery}
              onChange={setSearchQuery}
            />

            <div className="flex-1" />

            <div className="flex bg-gray-100 dark:bg-inmo-darkbg rounded-lg p-1 shrink-0">
              <button
                onClick={() => { setActiveTab('activos'); setSelectedId(null); }}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'activos' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Activos
              </button>
              <button
                onClick={() => { setActiveTab('suspendidos'); setSelectedId(null); }}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'suspendidos' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Suspendidos
              </button>
            </div>
          </div>

          <div className="flex justify-end"><Button variant="secondary" isLoading={exportCSV.isPending} onClick={() => exportCSV.mutate()}>Exportar resultados CSV</Button></div>
          {list.isError && <p role="alert">{operationError(list.error)}<button onClick={() => void list.refetch()} className="text-inmo-accent ml-3">Reintentar</button></p>}
          {exportCSV.isError && <p role="alert">{operationError(exportCSV.error)}</p>}
          {/* Container */}
          <div className="bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-2">

            <div className="hidden md:block w-full flex-1 overflow-y-auto overflow-x-auto custom-scrollbar relative">
                <table className={`w-full text-left border-collapse h-fit ${isOpen ? 'min-w-full' : 'min-w-[800px]'}`}>
                <thead className="sticky top-0 z-10 shadow-sm">
                  <tr className="border-b border-gray-100 dark:border-inmo-darktertiary bg-gray-50/95 dark:bg-inmo-darkbg/95 backdrop-blur-md text-inmo-secondary dark:text-gray-300 font-montserrat text-sm">
                    <th className="p-4 font-bold">Usuario</th>
                    <th className={`p-4 font-bold ${isOpen ? 'hidden' : ''}`}>Plan</th>
                    <th className="p-4 font-bold text-center">Propiedades</th>
                    <th className="p-4 font-bold text-center">Estado</th>
                    <th className="p-4 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="font-inter">
                  {displayedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-50 dark:border-inmo-darktertiary hover:bg-gray-50 dark:hover:bg-inmo-darktertiary transition-colors cursor-pointer relative ${selectedId === user.id ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10' : ''}`}
                      onClick={() => setSelectedId(user.id)}
                      tabIndex={0} role="button" onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedId(user.id); } }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-inmo-accent/10 flex items-center justify-center shrink-0">
                              <UserCheck className="w-5 h-5 text-inmo-accent" />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-inmo-secondary dark:text-white line-clamp-1">{user.name}</span>
                            <span className="text-[11px] text-gray-500 truncate">{user.email}</span>
                          </div>
                        </div>
                      </td>

                          <td className={`p-4 ${isOpen ? 'hidden' : ''}`}>
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase ${
                              user.plan === 'PRO' ? 'bg-inmo-accent/10 text-inmo-accent' :
                              user.plan === 'Ã‰LITE' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                              'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400'
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-montserrat font-bold text-inmo-secondary dark:text-white">{user.properties}</span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-inmo-success' : 'bg-inmo-danger'}`} />
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {user.status === 'active' ? 'Activo' : 'Suspendido'}
                              </span>
                            </div>
                          </td>
                      <td className="p-4 text-right">
                        <IconButton
                          variant="secondary"
                          icon={<MoreVertical className="w-4 h-4" />}
                          className="w-8 h-8 rounded-lg opacity-50 hover:opacity-100 inline-flex"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(user.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                  {displayedUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        {list.isPending ? 'Cargando usuarios…' : 'No se encontraron usuarios.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col p-4 gap-4 overflow-y-auto custom-scrollbar">
              {displayedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-50 dark:bg-inmo-darkbg p-4 rounded-xl flex items-center justify-between border border-gray-100 dark:border-inmo-darktertiary active:scale-[0.98] transition-transform"
                  onClick={() => setSelectedId(user.id)}
                >
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-inmo-accent/10 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-inmo-accent" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-inmo-secondary dark:text-white">{user.name}</span>
                      <span className="text-[10px] text-gray-500">{user.email}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>

          </div>
          {list.hasNextPage && <Button variant="secondary" isLoading={list.isFetchingNextPage} onClick={() => void list.fetchNextPage()}>Cargar más usuarios</Button>}
        </div>
      </div>
    </ModuleLayout>
  );


  const account = detail.data?.value;
  const sideContent = !selectedId ? null : detail.isPending ? <p className="p-6">Cargando cuenta…</p> : detail.isError ? <p role="alert" className="p-6">{operationError(detail.error)}</p> : account && <div className="flex flex-col h-full bg-gray-50/50 dark:bg-inmo-darkbg font-inter w-full min-h-0">
    <div className="bg-white dark:bg-inmo-darkcard px-6 py-6 border-b border-gray-100 dark:border-inmo-darktertiary flex flex-col gap-4 shrink-0"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-full bg-inmo-accent/10 flex items-center justify-center shadow-sm"><UserCheck className="w-8 h-8 text-inmo-accent" /></div><div><h2 className="font-montserrat font-bold text-xl leading-tight">{account.nombre}</h2><p className="text-xs text-gray-500 mt-1">{account.rol} · {account.estado}</p></div></div><div className="flex flex-col gap-2 mt-2 text-sm text-gray-600 dark:text-gray-300"><p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{account.correo}</p><p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{account.telefono ?? 'Sin teléfono registrado'}</p></div>
    {summary.data?.perfil_publico && <Link to={'/asesores/' + summary.data.asesor_id} className="text-inmo-accent font-bold text-sm">Ver perfil público</Link>}
    </div>
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
      {summary.isError && <p role="alert">{operationError(summary.error)}<button onClick={() => void summary.refetch()} className="text-inmo-accent block">Reintentar</button></p>}
      <div className="bg-white dark:bg-inmo-darkcard rounded-card p-5 border border-gray-100 dark:border-inmo-darktertiary shadow-soft"><h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Resumen de actividad</h3><div className="grid grid-cols-2 gap-4 text-sm">{[['Plan vigente', summary.data?.plan ?? (summary.isPending ? '…' : 'Sin periodo vigente')], ['Propiedades sin retirada', summary.data?.propiedades ?? '—'], ['Miembro desde', summary.data ? new Date(summary.data.creada_at).toLocaleDateString('es-MX') : '—'], ['Último acceso', summary.data?.ultimo_acceso_at ? new Date(summary.data.ultimo_acceso_at).toLocaleString('es-MX') : 'Sin acceso registrado']].map(([label, value]) => <div key={label} className="flex flex-col"><span className="text-xs text-gray-500 mb-1">{label}</span><span className="font-bold">{value}</span></div>)}</div></div>
      {summary.data?.asesor_id && <div className="bg-white dark:bg-inmo-darkcard rounded-card p-5 border border-gray-100 dark:border-inmo-darktertiary shadow-soft"><div className="flex justify-between mb-4"><h3 className="font-bold text-sm uppercase tracking-wider">Inventario reciente</h3><Link to={'/admin/moderacion?asesor=' + summary.data.asesor_id} className="text-xs text-inmo-accent font-bold">Ver todo</Link></div>{summary.data.inventario_reciente.map(property => <Link key={property.id} to={'/admin/moderacion?property=' + property.id} className="flex flex-col p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-inmo-darkbg"><span className="font-bold text-sm truncate">{property.titulo}</span><span className="text-xs text-gray-500">{Number(property.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} · {property.estado}</span></Link>)}{summary.data.inventario_reciente.length === 0 && <p className="text-sm text-gray-500">Sin propiedades.</p>}</div>}
      {summary.data?.baja_permanente ? <p className="text-inmo-danger">Esta cuenta tiene baja permanente y no puede reactivarse.</p> : <div className="space-y-4"><Textarea aria-label="Motivo del cambio de cuenta" value={reason} onChange={event => setReason(event.target.value)} placeholder="Motivo obligatorio" maxLength={1000} /><Button variant="secondary" icon={account.estado === 'ACTIVA' ? <UserMinus className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} disabled={conflict || !reason.trim() || change.isPending || !summary.data} onClick={() => setShowConfirm(true)}>{account.estado === 'ACTIVA' ? 'Suspender' : 'Reactivar'}</Button></div>}
      {conflict && <ConflictNotice current={<p>{detail.data?.value.estado} · versión {detail.data?.value.version}</p>} onReview={async () => { const result = await detail.refetch(); if (result.isError) throw result.error; }} onAccept={() => { setConflict(false); change.reset(); }} />}
      {change.isError && !conflict && <p role="alert">{operationError(change.error)}</p>}{change.isSuccess && <p role="status">Estado actualizado y sesiones revocadas.</p>}
    </div>
  </div>;
  return <><SplitViewLayout isOpen={isOpen} onClose={handleCloseDetail} sideContent={sideContent} mainContent={mainContent} bottomSheetNoPadding bottomSheetHeightMode="fixed-85" desktopNoPadding sideTitle="" /><ConfirmModal isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleStatusChange} title="Confirmar cambio de estado" message="El motivo quedará auditado y se revocarán las sesiones de esta cuenta." confirmText="Confirmar" confirmVariant="accent" /></>;
}
