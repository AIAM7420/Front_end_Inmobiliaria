import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, LogOut, Camera, Shield, ChevronRight, Settings, HelpCircle, UserCircle2, Calendar, AlertTriangle, Trash2, FileText, CheckCircle2, AlertCircle, Clock, CreditCard, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { IconButton } from '../atoms/IconButton';
import { useAppContext } from '../../context/AppContext';
import { SplitViewLayout } from '../templates/SplitViewLayout';

type ActiveView = 'root' | 'account' | 'documents' | 'plan' | 'general' | 'security' | 'support' | 'delete';

export const AsesorProfileTemplate = () => {
  const navigate = useNavigate();
  const { logout } = useAppContext();
  const [activeView, setActiveView] = useState<ActiveView>('root');
  const previousView = useRef<ActiveView>('account');

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
    { id: 'ine', name: 'Identificación Oficial (INE / Pasaporte)', status: 'verified', statusText: 'Verificado', preview: 'https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=400&auto=format&fit=crop' },
    { id: 'rfc', name: 'Constancia de Situación Fiscal', status: 'pending', statusText: 'En Revisión', preview: null },
    { id: 'licencia', name: 'Licencia Inmobiliaria (Opcional)', status: 'missing', statusText: 'Faltante', preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=400&auto=format&fit=crop' },
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
                <div className="w-32 h-32 rounded-full bg-inmo-secondary flex items-center justify-center overflow-hidden border-4 border-white dark:border-inmo-darkbg shadow-sm">
                  <span className="text-4xl font-montserrat font-bold text-white">RE</span>
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-inmo-accent text-white flex items-center justify-center border-2 border-white dark:border-inmo-darkbg shadow-sm" title="Agente Verificado">
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
          <div className="flex flex-col gap-6 pb-8 animate-in fade-in zoom-in-95 duration-300 px-6 mt-8">
            <h3 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white mb-2">Suscripción Profesional</h3>
            
            {/* Tarjeta de Suscripción Mejorada */}
            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-8 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col gap-8 relative overflow-hidden">
              {/* Decoración sutil */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-inmo-accent/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-start justify-between relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Plan Actual</span>
                  <h4 className="font-montserrat font-black text-4xl text-inmo-secondary dark:text-white">PRO <span className="text-inmo-accent">500</span></h4>
                </div>
                <div className="px-4 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold text-sm rounded-full border border-green-200 dark:border-green-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Activo
                </div>
              </div>

              {/* Barra de Consumo Circular / Detallada */}
              <div className="flex flex-col gap-3 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-inmo-secondary dark:text-white">Capacidad de Publicaciones</span>
                  <span className="text-sm font-bold text-gray-500"><span className="text-inmo-secondary dark:text-white text-lg">12</span> / 15</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-inmo-darkbg h-3 rounded-full overflow-hidden">
                  <div className="bg-inmo-accent h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '80%' }}></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Has utilizado el 80% de tu límite. Aún puedes publicar 3 propiedades más este mes.</p>
              </div>

              <div className="flex items-center gap-4 relative z-10 mt-2">
                <Button className="flex-1 !py-3">Mejorar a PRO 800</Button>
                <Button variant="secondary" className="flex-1 !py-3 !border-gray-200 dark:!border-inmo-darktertiary">Ver Facturación</Button>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="flex flex-col gap-6 pb-8 animate-in fade-in zoom-in-95 duration-300 px-6 mt-8">
            <h3 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white mb-2">Cambiar Contraseña</h3>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Contraseña Actual</label>
                <Input type="password" leftIcon={<Lock className="w-6 h-6 text-gray-400" />} placeholder="••••••••" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Nueva Contraseña</label>
                <Input type="password" leftIcon={<Lock className="w-6 h-6 text-gray-400" />} placeholder="••••••••" />
              </div>
              <Button onClick={closeDetail} className="w-full mt-4">Actualizar Contraseña</Button>
            </div>
          </div>
        );
      case 'delete':
        return (
          <div className="flex flex-col gap-6 pb-8 animate-in fade-in zoom-in-95 duration-300 px-6 mt-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white">Dar de baja cuenta</h3>
            <p className="text-gray-500 leading-relaxed">
              Estás a punto de eliminar tu cuenta de forma permanente. Tus publicaciones serán dadas de baja automáticamente y perderás el acceso a tu historial.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Escribe "ELIMINAR" para confirmar</label>
              <Input placeholder="ELIMINAR" />
            </div>
            <Button onClick={closeDetail} variant="secondary" className="w-full mt-6 !text-red-500 !border-red-500 hover:!bg-red-50">Confirmar Baja</Button>
          </div>
        );
      default:
        return (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Esta sección está en construcción.
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
            className={`flex items-center justify-between bg-white dark:bg-inmo-darkcard rounded-2xl p-4 shadow-sm cursor-pointer transition-all active:scale-[0.98] border ${
              activeView === 'account' ? 'border-inmo-accent ring-2 ring-inmo-accent/20' : 'border-transparent dark:border-white/5 hover:shadow-md'
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
          <div className="bg-white dark:bg-inmo-darkcard rounded-2xl shadow-sm border border-transparent dark:border-white/5 overflow-hidden flex flex-col">
            
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
