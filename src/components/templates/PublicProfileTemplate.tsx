import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, LogOut, Camera, Shield, ChevronRight, Settings, HelpCircle, UserCircle2, Calendar, AlertTriangle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { IconButton } from '../atoms/IconButton';
import { useAppContext } from '../../context/AppContext';
import { SplitViewLayout } from '../templates/SplitViewLayout';

type ActiveView = 'root' | 'account' | 'general' | 'security' | 'support' | 'delete';

export const PublicProfileTemplate = () => {
  const navigate = useNavigate();
  const { logout } = useAppContext();
  const [activeView, setActiveView] = useState<ActiveView>('root');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeDetail = () => setActiveView('root');

  const renderDetailContent = () => {
    switch (activeView) {
      case 'account':
        return (
          <div className="flex flex-col gap-8 pb-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center space-y-4 mt-8">
              <div className="relative cursor-pointer group">
                <div className="w-32 h-32 rounded-full bg-inmo-accent/10 flex items-center justify-center overflow-hidden border-4 border-white dark:border-inmo-darkbg shadow-sm">
                  <UserCircle2 className="w-20 h-20 text-inmo-accent/50" strokeWidth={1} />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <Button variant="text" className="!text-inmo-accent font-bold">Cambiar foto de perfil</Button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-5 px-6 mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Nombre Completo</label>
                <Input leftIcon={<User className="w-6 h-6 text-gray-400" />} defaultValue="Ana López" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Edad</label>
                <Input leftIcon={<Calendar className="w-6 h-6 text-gray-400" />} defaultValue="32" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 pl-4">Correo Electrónico</label>
                <Input type="email" leftIcon={<Mail className="w-6 h-6 text-gray-400" />} defaultValue="ana.lopez@ejemplo.com" />
              </div>
            </div>

            <div className="flex justify-center mt-8 px-6">
              <Button onClick={closeDetail} className="w-full">Guardar Cambios</Button>
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
              Estás a punto de eliminar tu cuenta de forma permanente. Toda tu información, propiedades guardadas y configuraciones serán borradas y no podrán ser recuperadas.
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
      case 'account': return 'Cuenta';
      case 'security': return 'Seguridad';
      case 'general': return 'General';
      case 'support': return 'Soporte';
      case 'delete': return 'Dar de baja';
      default: return 'Detalle';
    }
  };

  const renderMainContent = () => (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-inmo-darkbg pb-24 font-inter">
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
          <h2 className="font-bold text-lg text-inmo-secondary dark:text-white ml-2">Cuenta</h2>
          <div 
            onClick={() => setActiveView('account')}
            className={`flex items-center justify-between bg-white dark:bg-inmo-darkcard rounded-2xl p-4 shadow-sm cursor-pointer transition-all active:scale-[0.98] border ${
              activeView === 'account' ? 'border-inmo-accent ring-2 ring-inmo-accent/20' : 'border-transparent dark:border-white/5 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-inmo-accent/10 flex items-center justify-center border-2 border-white dark:border-inmo-darkbg overflow-hidden shrink-0">
                <span className="text-xl font-montserrat font-bold text-inmo-accent">AL</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-inmo-secondary dark:text-white">Ana López</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Información personal</span>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform ${activeView === 'account' ? 'text-inmo-accent' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg text-inmo-secondary dark:text-white ml-2">Ajustes</h2>
          <div className="bg-white dark:bg-inmo-darkcard rounded-2xl shadow-sm border border-transparent dark:border-white/5 overflow-hidden flex flex-col">
            
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
      onClose={closeDetail}
      onBack={closeDetail}
      sideTitle={getDetailTitle()}
      sidePosition="right"
      sidePanelWidthClass="w-[70%]"
      mainPanelWidthClass="md:w-[30%]"
      bottomSheetHeightMode="content"
      bottomSheetIsHero={false}
      bottomSheetNoPadding={false}
      mainContent={renderMainContent()}
      sideContent={activeView !== 'root' ? renderDetailContent() : null}
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
