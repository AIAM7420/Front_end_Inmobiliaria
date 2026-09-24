import React, { useState } from 'react';
import { ArrowLeft, User, Mail, ShieldAlert, LogOut, Settings, Server, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { IconButton } from '../atoms/IconButton';
import { useAppContext } from '../../context/AppContext';

export const AdminProfileTemplate = () => {
  const navigate = useNavigate();
  const { logout } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-inmo-darkbg pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Fijo */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-inmo-darkcard/80 backdrop-blur-xl border-b border-gray-100 dark:border-inmo-darktertiary px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconButton 
            icon={<ArrowLeft className="w-5 h-5 text-inmo-secondary dark:text-white" />} 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="!p-2 hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary !rounded-full"
          />
          <h1 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">Perfil Admin</h1>
        </div>
        <Button 
          variant={isEditing ? "accent" : "text"} 
          onClick={() => setIsEditing(!isEditing)}
          className={!isEditing ? "!text-inmo-accent" : ""}
        >
          {isEditing ? 'Guardar' : 'Editar'}
        </Button>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-inmo-secondary dark:bg-inmo-darkcard flex items-center justify-center border-4 border-white dark:border-inmo-darkcard shadow-sm">
              <span className="text-3xl font-montserrat font-bold text-white">SA</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-inmo-accent text-white text-caption font-bold border-2 border-white dark:border-inmo-darkcard shadow-sm whitespace-nowrap">
              SUPER ADMIN
            </div>
          </div>
          <div className="text-center mt-2">
            <h2 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white">Admin Principal</h2>
            <p className="font-inter text-sm text-gray-500 dark:text-gray-400">Acceso Total</p>
          </div>
        </div>

        {/* Datos Personales */}
        <div className="bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary p-4 sm:p-5 shadow-sm space-y-4">
          <h3 className="font-montserrat font-bold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Credenciales</h3>
          
          <Input 
            placeholder="Nombre"
            defaultValue="Admin Principal"
            disabled={!isEditing}
          />
          <Input 
            placeholder="Correo Electrónico"
            type="email"
            defaultValue="admin@inmo.mx"
            disabled={true} // El correo del admin no suele cambiar
          />
        </div>

        {/* Accesos Rápidos Admin */}
        <div className="bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary p-4 sm:p-5 shadow-sm space-y-4">
          <h3 className="font-montserrat font-bold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Sistema</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="!h-auto !py-4 flex-col gap-2 !border-gray-200 dark:!border-inmo-darktertiary">
              <Settings className="w-6 h-6 text-gray-500" />
              <span className="text-xs">Configuración</span>
            </Button>
            <Button variant="secondary" className="!h-auto !py-4 flex-col gap-2 !border-gray-200 dark:!border-inmo-darktertiary">
              <Server className="w-6 h-6 text-gray-500" />
              <span className="text-xs">Logs / API</span>
            </Button>
            <Button variant="secondary" className="!h-auto !py-4 flex-col gap-2 !border-gray-200 dark:!border-inmo-darktertiary">
              <ShieldAlert className="w-6 h-6 text-gray-500" />
              <span className="text-xs">Auditoría</span>
            </Button>
            <Button variant="secondary" className="!h-auto !py-4 flex-col gap-2 !border-gray-200 dark:!border-inmo-darktertiary">
              <Database className="w-6 h-6 text-gray-500" />
              <span className="text-xs">Backups</span>
            </Button>
          </div>
        </div>

        {/* Acciones de Peligro */}
        <div className="pt-4 space-y-3">
          <Button 
            variant="secondary" 
            icon={<LogOut className="w-5 h-5" />} 
            className="w-full !text-red-500 !border-red-200 hover:!bg-red-50 dark:hover:!bg-red-950/20"
            onClick={handleLogout}
          >
            Cerrar Sesión Segura
          </Button>
        </div>

      </div>
    </div>
  );
};
