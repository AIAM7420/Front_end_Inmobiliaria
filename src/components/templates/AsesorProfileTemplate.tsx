import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, LogOut, Camera, Shield, ChevronRight, Settings, HelpCircle, UserCircle2, Calendar, AlertTriangle, Trash2, FileText, CheckCircle2, AlertCircle, Clock, CreditCard, UploadCloud } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { IconButton } from '../atoms/IconButton';
import { useAppContext } from '../../context/AppContext';
import { SplitViewLayout } from '../templates/SplitViewLayout';
import { AsesorSubscription } from '../views/asesor/AsesorSubscription';

type ActiveView = 'root' | 'account' | 'documents' | 'plan' | 'general' | 'security' | 'support' | 'delete';

export const AsesorProfileTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAppContext();
  
  // Extract ?view= from query params
  const searchParams = new URLSearchParams(location.search);
  const initialView = (searchParams.get('view') as ActiveView) || 'root';

  const [activeView, setActiveView] = useState<ActiveView>(initialView);
  const previousView = useRef<ActiveView>('account');

  // Sync state if URL changes (e.g. clicking the badge from another tab in the profile)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const view = searchParams.get('view') as ActiveView;
    if (view) {
      setActiveView(view);
    }
  }, [location.search]);

  useEffect(() => {
    if (activeView !== 'root') previousView.current = activeView;
  }, [activeView]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeDetail = () => setActiveView('root');

  // Estado de los documentos (Mock)
  const documents = [
    { id: 'ine', name: 'Identificación Oficial (INE / Pasaporte)', status: 'missing', statusText: 'Faltante', preview: null },
    { id: 'rfc', name: 'Constancia de Situación Fiscal', status: 'missing', statusText: 'Faltante', preview: null },
    { id: 'licencia', name: 'Licencia Inmobiliaria (Opcional)', status: 'missing', statusText: 'Faltante', preview: null },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'verified': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const renderDetailContent = () => {
    const viewToRender = activeView === 'root' ? previousView.current : activeView;
    switch (viewToRender) {
      case 'account':
        return (
          <div className="flex flex-col gap-8 pb-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center space-y-4 mt-8">
              <div className="relative cursor-pointer group">
                <div className="w-32 h-32 rounded-full bg-inmo-secondary flex items-center justify-center overflow-hidden border-4 border-white dark:border-inmo-darkbg">
                  <span className="text-4xl font-montserrat font-bold text-white">RE</span>
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-inmo-accent text-white flex items-center justify-center border-2 border-white dark:border-inmo-darkbg" title="Agente Verificado">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <Button variant="text" className="!text-inmo-accent font-bold">Cambiar foto de perfil</Button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-5 px-6 mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Nombre Comercial</label>
                <Input leftIcon={<User className="w-6 h-6 text-gray-400" />} defaultValue="Roberto Estate" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Teléfono de Contacto</label>
                <Input type="tel" leftIcon={<User className="w-6 h-6 text-gray-400" />} defaultValue="55 1234 5678" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Correo Profesional</label>
                <Input type="email" leftIcon={<Mail className="w-6 h-6 text-gray-400" />} defaultValue="roberto@estate.com" />
              </div>
            </div>

            <div className="flex justify-center mt-8 px-6">
              <Button onClick={closeDetail} className="w-full">Guardar Cambios</Button>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="flex flex-col h-full gap-6 pb-8 animate-in fade-in zoom-in-95 duration-300 px-6 mt-8">
            <div>
              <h3 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white mb-2">Expediente</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Arrastra o selecciona tus documentos oficiales. Mantenlos actualizados para conservar tu insignia de verificación activa.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-[400px]">
              {documents.map((doc) => (
                <div key={doc.id} className="flex flex-col gap-3 h-full">
                  <div className={`relative flex-1 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all overflow-hidden group cursor-pointer ${
                    doc.preview 
                      ? 'border-transparent shadow-sm' 
                      : 'border-gray-200 dark:border-inmo-darktertiary hover:border-inmo-accent hover:bg-inmo-accent/5 dark:hover:bg-inmo-accent/10'
                  }`}>
                    
                    {/* Preview Image Overlay */}
                    {doc.preview && (
                      <div className="absolute inset-0 z-0">
                        <img src={doc.preview} alt={doc.name} className="w-full h-full object-cover opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <span className="font-bold text-white text-sm">Reemplazar</span>
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {!doc.preview && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-transparent flex items-center justify-center text-gray-400 group-hover:text-inmo-accent group-hover:scale-110 transition-all">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-inmo-accent">Subir archivo</span>
                        <span className="text-xs text-gray-400">PDF, JPG o PNG</span>
                      </div>
                    )}

                    {/* Status Badge (Siempre visible en la esquina o abajo) */}
                    <div className="absolute top-4 right-4 z-10">
                      {getStatusIcon(doc.status)}
                    </div>
                    
                    {doc.preview && (
                      <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
                        <span className={`text-caption font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${
                          doc.status === 'verified' ? 'bg-green-500 text-white' : 
                          doc.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {doc.statusText}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-sm text-center text-inmo-secondary dark:text-white px-2 leading-tight">
                    {doc.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'plan':
        return (
          <div className="h-full overflow-hidden flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 mt-8">
            <AsesorSubscription />
          </div>
        );
      case 'security':
        return (
          <div className="flex flex-col gap-6 pb-8 animate-in fade-in zoom-in-95 duration-300 px-6 mt-8">
            <div>
              <h3 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white mb-2">Seguridad</h3>
              <p className="font-inter text-sm text-gray-500 dark:text-gray-400">Actualiza tu contraseña para mantener tu cuenta protegida.</p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Contraseña Actual</label>
                <Input type="password" leftIcon={<Lock className="w-6 h-6 text-gray-400" />} placeholder="••••••••" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Nueva Contraseña</label>
                <Input type="password" leftIcon={<Lock className="w-6 h-6 text-gray-400" />} placeholder="••••••••" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Confirmar Nueva Contraseña</label>
                <Input type="password" leftIcon={<Lock className="w-6 h-6 text-gray-400" />} placeholder="••••••••" />
              </div>
              <Button onClick={closeDetail} className="w-full mt-4">Actualizar Contraseña</Button>
            </div>
          </div>
        );
      case 'general':
        return (
          <div className="flex flex-col gap-6 pb-8 animate-in fade-in zoom-in-95 duration-300 px-6 mt-8">
            <div>
              <h3 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white mb-2">General</h3>
              <p className="font-inter text-sm text-gray-500 dark:text-gray-400">Preferencias generales de tu cuenta.</p>
            </div>
            
            {/* Idioma */}
            <div className="bg-white dark:bg-inmo-darkcard rounded-2xl shadow-soft border border-gray-100 dark:border-white/5 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="font-bold text-sm text-inmo-secondary dark:text-white">Idioma</p>
                    <p className="text-xs text-gray-400">Idioma de la interfaz</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-inmo-darkbg px-3 py-1 rounded-lg">Español (MX)</span>
              </div>
              
              <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />

              {/* Notificaciones por Email */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="font-bold text-sm text-inmo-secondary dark:text-white">Notificaciones por Email</p>
                    <p className="text-xs text-gray-400">Recibir alertas de leads y actualizaciones</p>
                  </div>
                </div>
                <div className="w-11 h-6 rounded-full bg-inmo-accent flex items-center px-0.5 cursor-pointer">
                  <div className="w-5 h-5 rounded-full bg-white translate-x-5 transition-transform" />
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />

              {/* Zona Horaria */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="font-bold text-sm text-inmo-secondary dark:text-white">Zona Horaria</p>
                    <p className="text-xs text-gray-400">Horario de tu ubicación</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-inmo-darkbg px-3 py-1 rounded-lg">UTC-6 (CDMX)</span>
              </div>
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="flex flex-col gap-6 pb-8 animate-in fade-in zoom-in-95 duration-300 px-6 mt-8">
            <div>
              <h3 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white mb-2">Soporte</h3>
              <p className="font-inter text-sm text-gray-500 dark:text-gray-400">¿Necesitas ayuda? Estamos para ti.</p>
            </div>

            {/* Opciones de soporte */}
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-inmo-darkcard rounded-2xl p-5 shadow-soft border border-gray-100 dark:border-white/5 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all group">
                <Mail className="w-6 h-6 text-gray-400 shrink-0 mt-0.5 group-hover:text-inmo-accent transition-colors" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-inmo-secondary dark:text-white mb-1">Correo Electrónico</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Escríbenos y te respondemos en menos de 24 hrs.</p>
                  <span className="text-xs font-bold text-inmo-accent mt-2 inline-block">soporte@inmo.mx</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-2" />
              </div>

              <div className="bg-white dark:bg-inmo-darkcard rounded-2xl p-5 shadow-soft border border-gray-100 dark:border-white/5 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all group">
                <HelpCircle className="w-6 h-6 text-gray-400 shrink-0 mt-0.5 group-hover:text-inmo-accent transition-colors" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-inmo-secondary dark:text-white mb-1">Centro de Ayuda</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Consulta nuestra documentación, guías y tutoriales.</p>
                  <span className="text-xs font-bold text-inmo-accent mt-2 inline-block">Abrir Centro de Ayuda →</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-2" />
              </div>

              <div className="bg-white dark:bg-inmo-darkcard rounded-2xl p-5 shadow-soft border border-gray-100 dark:border-white/5 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all group">
                <AlertTriangle className="w-6 h-6 text-gray-400 shrink-0 mt-0.5 group-hover:text-inmo-accent transition-colors" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-inmo-secondary dark:text-white mb-1">Reportar un Problema</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">¿Algo no funciona? Cuéntanos para solucionarlo rápido.</p>
                  <span className="text-xs font-bold text-inmo-accent mt-2 inline-block">Crear reporte →</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-2" />
              </div>
            </div>

            {/* Versión */}
            <div className="text-center mt-4">
              <p className="font-inter text-xs text-gray-400">INMO v2.0.0 · Hecho con ❤️ en México</p>
            </div>
          </div>
        );
      case 'delete':
        return (
          <div className="flex flex-col gap-6 pb-8 animate-in fade-in zoom-in-95 duration-300 px-6 mt-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white mb-2">Dar de baja cuenta</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-md">
                  Esta acción es <span className="font-bold text-red-500">permanente e irreversible</span>. Tus publicaciones serán dadas de baja automáticamente y perderás el acceso a tu historial.
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4">
              <p className="font-inter text-sm text-red-600 dark:text-red-400 leading-relaxed">
                <span className="font-bold">¿Qué se eliminará?</span> Tu perfil público, todas tus propiedades publicadas, historial de leads, analíticas y datos de facturación.
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Escribe <span className="text-red-500">ELIMINAR</span> para confirmar</label>
              <Input placeholder="ELIMINAR" />
            </div>
            <Button onClick={closeDetail} variant="secondary" className="w-full mt-4 !text-red-500 !border !border-red-300 dark:!border-red-800 hover:!bg-red-50 dark:hover:!bg-red-900/10">Confirmar Baja Permanente</Button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center gap-4 animate-in fade-in zoom-in-95 duration-300 mt-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <Settings className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-inter text-sm">Selecciona una opción del menú para ver su contenido.</p>
          </div>
        );
    }
  };

  const getDetailTitle = () => {
    switch(activeView) {
      case 'account': return 'Cuenta Profesional';
      case 'documents': return 'Expediente';
      case 'plan': return 'Suscripción';
      case 'security': return 'Seguridad';
      case 'general': return 'General';
      case 'support': return 'Soporte';
      case 'delete': return 'Dar de baja';
      default: return 'Detalle';
    }
  };

  const renderMainContent = () => (
    <div className="h-full overflow-y-auto bg-transparent pb-24 font-inter">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-50/80 dark:bg-inmo-darkbg/80 backdrop-blur-xl px-4 py-4 flex items-center gap-3">
        <IconButton 
          icon={<ArrowLeft className="w-6 h-6 text-inmo-secondary dark:text-white" strokeWidth={2.5} />} 
          onClick={() => navigate(-1)} 
          variant="ghost" 
          className="!p-1 hover:!bg-gray-200 dark:hover:!bg-inmo-darktertiary !rounded-full"
        />
        <h1 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white">Configuración</h1>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto space-y-8">
        {/* Account Summary Card */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg text-inmo-secondary dark:text-white ml-2">Asesor</h2>
          <div 
            onClick={() => setActiveView('account')}
            className={`flex items-center justify-between bg-white dark:bg-inmo-darkcard rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98] border ${
              activeView === 'account' ? 'border-inmo-accent ring-2 ring-inmo-accent/20' : 'border-transparent dark:border-white/5 hover:bg-gray-50 dark:hover:bg-inmo-darktertiary'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full bg-inmo-secondary flex items-center justify-center border-2 border-white dark:border-inmo-darkbg overflow-hidden shrink-0">
                <span className="text-xl font-montserrat font-bold text-white">RE</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-inmo-accent text-white flex items-center justify-center border border-white" title="Verificado">
                  <Shield className="w-2.5 h-2.5" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-inmo-secondary dark:text-white flex items-center gap-1.5">
                  Roberto Estate
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Perfil público</span>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform ${activeView === 'account' ? 'text-inmo-accent' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg text-inmo-secondary dark:text-white ml-2">Ajustes</h2>
          <div className="bg-white dark:bg-inmo-darkcard rounded-2xl border border-transparent dark:border-white/5 overflow-hidden flex flex-col">
            
            <SettingRow icon={<FileText />} label="Expediente y Verificación" isActive={activeView === 'documents'} onClick={() => setActiveView('documents')} />
            <SettingRow icon={<CreditCard />} label="Suscripción y Pagos" isActive={activeView === 'plan'} onClick={() => setActiveView('plan')} />
            <SettingRow icon={<Settings />} label="General" isActive={activeView === 'general'} onClick={() => setActiveView('general')} />
            <SettingRow icon={<Shield />} label="Seguridad" isActive={activeView === 'security'} onClick={() => setActiveView('security')} />
            <SettingRow icon={<HelpCircle />} label="Soporte" isActive={activeView === 'support'} onClick={() => setActiveView('support')} />
            
            <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />

            <div 
              onClick={handleLogout}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-inmo-darktertiary active:bg-gray-100 dark:active:bg-inmo-darkbg transition-colors"
            >
              <div className="flex items-center gap-4">
                <LogOut className="w-5 h-5 text-gray-500 shrink-0" />
                <span className="font-bold text-body text-gray-500">Cerrar sesión</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveView('delete')}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 active:bg-red-100 dark:active:bg-red-900/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Trash2 className="w-5 h-5 text-red-500 shrink-0" />
                <span className="font-bold text-body text-red-500">Dar de baja cuenta</span>
              </div>
              <ChevronRight className="w-5 h-5 text-red-300 dark:text-red-500/50 shrink-0" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SplitViewLayout
      isOpen={activeView !== 'root'}
      onBack={closeDetail}
      sideTitle={getDetailTitle()}
      sidePosition="right"
      sidePanelWidthClass="w-[70%]"
      mainPanelWidthClass="md:w-[30%]"
      bottomSheetHeightMode="content"
      bottomSheetIsHero={false}
      bottomSheetNoPadding={false}
      mainContent={renderMainContent()}
      sideContent={renderDetailContent()}
    />
  );
};

// Subcomponent for list rows
const SettingRow = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive?: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-4 border-b border-gray-100 dark:border-inmo-darktertiary cursor-pointer transition-colors group ${
      isActive 
        ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10 border-l-4 border-l-inmo-accent pl-3' 
        : 'hover:bg-gray-50 dark:hover:bg-inmo-darktertiary active:bg-gray-100 dark:active:bg-inmo-darkbg border-l-4 border-l-transparent'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`${isActive ? 'text-inmo-accent' : 'text-inmo-accent/80 group-hover:text-inmo-accent'} transition-colors`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5 shrink-0' })}
      </div>
      <span className={`font-bold text-body ${isActive ? 'text-inmo-accent' : 'text-inmo-secondary dark:text-white'}`}>{label}</span>
    </div>
    <ChevronRight className={`w-5 h-5 transition-transform ${isActive ? 'text-inmo-accent' : 'text-gray-300 dark:text-gray-600'}`} />
  </div>
);
