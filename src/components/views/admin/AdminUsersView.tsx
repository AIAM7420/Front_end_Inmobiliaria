import React, { useState } from 'react';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { ModuleLayout } from '../../templates/ModuleLayout';
import { SearchBar } from '../../molecules/SearchBar';
import { Button } from '../../atoms/Button';
import { IconButton } from '../../atoms/IconButton';
import { 
  UserCheck, UserMinus, CheckCircle2, Clock, AlertCircle, 
  MoreVertical, Mail, Phone, Eye, X, Check, ChevronRight
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { ConfirmModal } from '../../molecules/ConfirmModal';

type UserTab = 'activos' | 'solicitudes' | 'suspendidos';

export const AdminUsersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserTab>('activos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { addToast } = useToast();

  const isOpen = selectedId !== null;

  // Mock data for active users
  const activeUsers = [
    { id: '10', name: 'Roberto Estate', email: 'roberto@estate.com', phone: '+52 55 1234 5678', plan: 'PRO', properties: 12, joined: '2026-01-15', status: 'active', avatar: 'https://i.pravatar.cc/150?u=10' },
    { id: '11', name: 'Ana GÃ³mez', email: 'ana.gomez@gmail.com', phone: '+52 55 8765 4321', plan: 'BÃSICO', properties: 4, joined: '2026-03-22', status: 'active', avatar: 'https://i.pravatar.cc/150?u=11' },
    { id: '12', name: 'Premium Homes MX', email: 'info@premiumhomes.mx', phone: '+52 81 2345 6789', plan: 'Ã‰LITE', properties: 85, joined: '2025-11-05', status: 'active', avatar: 'https://i.pravatar.cc/150?u=12' },
  ];

  const suspendedUsers = [
    { id: '13', name: 'Jorge Real', email: 'jorge.real@outlook.com', phone: '+52 33 1122 3344', plan: 'BÃSICO', properties: 0, joined: '2026-08-10', status: 'suspended', avatar: 'https://i.pravatar.cc/150?u=13' },
  ];

  // Mock data for requests
  const pendingRequests = [
    { id: '1', name: 'Laura MartÃ­nez', email: 'laura.m@example.com', phone: '+52 55 9988 7766', date: '2026-09-24', company: 'Inmobiliaria LM', docs: 'pending', status: 'request' },
    { id: '2', name: 'Carlos DÃ­az', email: 'carlos.diaz@example.com', phone: '+52 81 4455 6677', date: '2026-09-23', company: 'Independiente', docs: 'verified', status: 'request' },
    { id: '3', name: 'Grupo Sur', email: 'contacto@gruposur.mx', phone: '+52 33 5566 7788', date: '2026-09-22', company: 'Agencia', docs: 'missing', status: 'request' },
  ];

  const allUsers = [...activeUsers, ...suspendedUsers, ...pendingRequests];
  const selectedUser = allUsers.find(u => u.id === selectedId);

  const getFilteredUsers = () => {
    let list = [];
    if (activeTab === 'activos') list = activeUsers;
    else if (activeTab === 'solicitudes') list = pendingRequests;
    else list = suspendedUsers;

    if (searchQuery) {
      list = list.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  };

  const displayedUsers = getFilteredUsers();

  const handleCloseDetail = () => {
    setSelectedId(null);
  };

  const handleStatusChange = () => {
    addToast('success', 'Estado actualizado', 'La acciÃ³n se ha completado correctamente.');
    setShowConfirm(false);
    setSelectedId(null);
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
            1,245
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
            892
          </span>
          <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Asesores Activos</span>
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
            {pendingRequests.length}
          </span>
          <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Solicitudes Pendientes</span>
        </div>
      </div>
    </>
  );

  const mainContent = (
    <ModuleLayout
      title="Usuarios de la Plataforma"
      subtitle="Gestiona accesos, planes y verifica las solicitudes de nuevos asesores."
      isFullScreen={true}
      noScroll={true}
      showSearch={false}
      controlsMaxWidthClass="md:hidden"
      actions={
        <div className="flex flex-col gap-3 w-full shrink-0">
          <SearchBar
            placeholder="Buscar por nombre o correo..."
            size="slim"
            className="w-full"
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
          />
          <div className="flex bg-gray-100 dark:bg-inmo-darkbg rounded-lg p-1 w-full shrink-0">
            <button
              onClick={() => { setActiveTab('activos'); setSelectedId(null); }}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'activos' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Activos
            </button>
            <button
              onClick={() => { setActiveTab('solicitudes'); setSelectedId(null); }}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all flex items-center justify-center gap-1 ${activeTab === 'solicitudes' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Solicitudes
              <span className="bg-inmo-accent text-white text-[9px] px-1 rounded-full leading-tight">{pendingRequests.length}</span>
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
      <div className="flex flex-col md:flex-row w-full h-full gap-6 font-inter pb-0 md:pb-6">
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
              placeholder="Buscar por nombre o correo..."
              size="slim"
              className="flex-1 md:flex-none md:w-[350px] min-w-0"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
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
                onClick={() => { setActiveTab('solicitudes'); setSelectedId(null); }}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${activeTab === 'solicitudes' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Solicitudes
                <span className="bg-inmo-accent text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">{pendingRequests.length}</span>
              </button>
              <button
                onClick={() => { setActiveTab('suspendidos'); setSelectedId(null); }}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'suspendidos' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Suspendidos
              </button>
            </div>
          </div>

          {/* Container */}
          <div className="bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-2">
            
            <div className="hidden md:block w-full flex-1 overflow-y-auto overflow-x-auto custom-scrollbar relative">
                <table className={`w-full text-left border-collapse h-fit ${isOpen ? 'min-w-full' : 'min-w-[800px]'}`}>
                <thead className="sticky top-0 z-10 shadow-sm">
                  <tr className="border-b border-gray-100 dark:border-inmo-darktertiary bg-gray-50/95 dark:bg-inmo-darkbg/95 backdrop-blur-md text-inmo-secondary dark:text-gray-300 font-montserrat text-sm">
                    <th className="p-4 font-bold">Usuario</th>
                    {activeTab === 'solicitudes' ? (
                      <>
                        <th className="p-4 font-bold">Fecha</th>
                        <th className="p-4 font-bold">Documentos</th>
                      </>
                    ) : (
                      <>
                        <th className={`p-4 font-bold ${isOpen ? 'hidden' : ''}`}>Plan</th>
                        <th className="p-4 font-bold text-center">Propiedades</th>
                        <th className="p-4 font-bold text-center">Estado</th>
                      </>
                    )}
                    <th className="p-4 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="font-inter">
                  {displayedUsers.map((user: any) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-50 dark:border-inmo-darktertiary hover:bg-gray-50 dark:hover:bg-inmo-darktertiary transition-colors cursor-pointer relative ${selectedId === user.id ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10' : ''}`}
                      onClick={() => setSelectedId(user.id)}
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
                      
                      {activeTab === 'solicitudes' ? (
                        <>
                          <td className="p-4"><span className="text-sm text-gray-600 dark:text-gray-300">{user.date}</span></td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-xs font-bold">
                              {user.docs === 'verified' && <span className="text-inmo-success flex items-center gap-1 bg-inmo-success/10 px-2 py-1 rounded-md"><CheckCircle2 className="w-3.5 h-3.5"/> Completo</span>}
                              {user.docs === 'pending' && <span className="text-inmo-warning flex items-center gap-1 bg-inmo-warning/10 px-2 py-1 rounded-md"><Clock className="w-3.5 h-3.5"/> En revisiÃ³n</span>}
                              {user.docs === 'missing' && <span className="text-inmo-danger flex items-center gap-1 bg-inmo-danger/10 px-2 py-1 rounded-md"><AlertCircle className="w-3.5 h-3.5"/> Incompleto</span>}
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                      
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
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col p-4 gap-4 overflow-y-auto custom-scrollbar">
              {displayedUsers.map((user: any) => (
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
        </div>
      </div>
    </ModuleLayout>
  );

  const sideContent = selectedUser ? (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-inmo-darkbg font-inter w-full">
      {/* Detail Header */}
      <div className="bg-white dark:bg-inmo-darkcard px-6 py-6 border-b border-gray-100 dark:border-inmo-darktertiary flex flex-col gap-4 relative shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {(selectedUser as any).avatar ? (
              <img src={(selectedUser as any).avatar} alt={selectedUser.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-inmo-accent/10 flex items-center justify-center shadow-sm">
                <UserCheck className="w-8 h-8 text-inmo-accent" />
              </div>
            )}
            <div className="flex flex-col">
              <h2 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white leading-tight">{selectedUser.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {selectedUser.status === 'request' ? (
                  <span className="bg-inmo-warning/10 text-inmo-warning px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Solicitud</span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${selectedUser.status === 'active' ? 'bg-inmo-success' : 'bg-inmo-danger'}`} />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {selectedUser.status === 'active' ? 'Activo' : 'Suspendido'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <IconButton
            variant="secondary"
            icon={<X className="w-5 h-5" />}
            className="md:hidden absolute top-4 right-4"
            onClick={handleCloseDetail}
          />
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{selectedUser.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{selectedUser.phone}</span>
          </div>
        </div>
        
        {/* Main Actions */}
        <div className="flex items-center gap-2 mt-2">
          {selectedUser.status === 'request' ? (
            <>
              <Button variant="accent" className="flex-1 !py-2 !px-0 shadow-glow" icon={<Check className="w-4 h-4"/>} onClick={() => setShowConfirm(true)}>Aprobar</Button>
              <Button variant="secondary" className="flex-1 !py-2 !px-0 !text-inmo-danger !border-inmo-danger/20 hover:!bg-inmo-danger/10" icon={<X className="w-4 h-4"/>} onClick={() => setShowConfirm(true)}>Rechazar</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" className="flex-1 !py-2 !px-0" icon={<Eye className="w-4 h-4"/>}>Ver Perfil</Button>
              {selectedUser.status === 'active' ? (
                <Button variant="secondary" className="flex-1 !py-2 !px-0 !text-inmo-danger !border-inmo-danger/20 hover:!bg-inmo-danger/10" icon={<UserMinus className="w-4 h-4"/>} onClick={() => setShowConfirm(true)}>Suspender</Button>
              ) : (
                <Button variant="secondary" className="flex-1 !py-2 !px-0 !text-inmo-success !border-inmo-success/20 hover:!bg-inmo-success/10" icon={<CheckCircle2 className="w-4 h-4"/>} onClick={() => setShowConfirm(true)}>Reactivar</Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Details Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
        
        {selectedUser.status === 'request' ? (
          <>
            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-5 border border-gray-100 dark:border-inmo-darktertiary shadow-soft">
              <h3 className="font-bold text-sm text-inmo-secondary dark:text-white mb-4 uppercase tracking-wider">Estado de VerificaciÃ³n</h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-inmo-success/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-inmo-success" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-inmo-secondary dark:text-white">Identidad Validada</span>
                    <span className="text-xs text-gray-500">INE y comprobante de domicilio aprobados.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-inmo-warning/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-inmo-warning" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-inmo-secondary dark:text-white">CÃ©dula Profesional</span>
                    <span className="text-xs text-gray-500">Documento en revisiÃ³n manual por el equipo.</span>
                    <Button variant="secondary" className="mt-2 w-fit !text-xs !py-1">Ver Documento</Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-5 border border-gray-100 dark:border-inmo-darktertiary shadow-soft">
              <h3 className="font-bold text-sm text-inmo-secondary dark:text-white mb-4 uppercase tracking-wider">Resumen de Actividad</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Plan Actual</span>
                  <span className="font-bold text-inmo-secondary dark:text-white">{(selectedUser as any).plan}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Propiedades</span>
                  <span className="font-bold text-inmo-secondary dark:text-white">{(selectedUser as any).properties} Activas</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Miembro desde</span>
                  <span className="font-bold text-inmo-secondary dark:text-white">{(selectedUser as any).joined}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Ãšltimo acceso</span>
                  <span className="font-bold text-inmo-secondary dark:text-white">Hace 2 horas</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-5 border border-gray-100 dark:border-inmo-darktertiary shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-inmo-secondary dark:text-white uppercase tracking-wider">Inventario Reciente</h3>
                <span className="text-xs text-inmo-accent font-bold cursor-pointer hover:underline">Ver todo</span>
              </div>
              
              <div className="flex flex-col gap-3">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-inmo-darkbg rounded-lg cursor-pointer transition-colors">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0 overflow-hidden">
                      <img src={`https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=150&h=150&random=${i}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-inmo-secondary dark:text-white truncate">Casa en Lomas de AngelÃ³polis</span>
                      <span className="text-xs text-gray-500">$4,500,000 MXN</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  ) : null;

  return (
    <>
      <SplitViewLayout
        isOpen={isOpen}
        onClose={handleCloseDetail}
        sideContent={sideContent}
        mainContent={mainContent}
        bottomSheetNoPadding={true}
        bottomSheetHeightMode="fixed-85"
        desktopNoPadding={true}
        sideTitle=""
      />
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleStatusChange}
        title="Â¿EstÃ¡s seguro?"
        message="Esta acciÃ³n afectarÃ¡ el estado del usuario en la plataforma."
        confirmText="Confirmar AcciÃ³n"
        confirmVariant="accent"
      />
    </>
  );
};
