// src/components/organisms/FloatingNavBar.tsx
import React from 'react';
import { Home, Map, Heart, Bot, Send, User, BookOpenText, Building2, CreditCard, FolderOpen, Astroid } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

interface FloatingNavBarProps {
  role?: 'public' | 'asesor' | 'admin';
  activeRoute?: string;
  onNavigate?: (route: string) => void;
  onOpenChatbot?: () => void;
  hideChatbot?: boolean;
}

const NavButton = ({ route, label, Icon, activeRoute, onNavigate, badge }: { route: string, label: string, Icon: React.ElementType, activeRoute: string, onNavigate?: (r: string) => void, badge?: number | boolean }) => {
  const isActive = activeRoute === route;
  
  return (
    <button 
      onClick={() => onNavigate?.(route)} 
      className="relative flex flex-col items-center justify-center h-full px-2 md:px-3 bg-transparent border-none outline-none cursor-pointer group hover:scale-105 transition-transform"
    >
      <div className={`relative flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-inmo-secondary dark:text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
        <div className={`relative mb-1 transition-transform duration-300 ${isActive ? '-translate-y-0.5' : 'translate-y-0'}`}>
          <Icon 
            className="w-5 h-5 md:w-6 md:h-6" 
            strokeWidth={isActive ? 2.5 : 2} 
          />
          {badge !== undefined && badge !== false && (
            <span 
              className={`absolute -top-1.5 -right-2 ${typeof badge === 'number' ? 'px-1 min-w-[16px] h-4 text-[10px] flex items-center justify-center font-bold' : 'w-2.5 h-2.5'} bg-inmo-accent text-white rounded-full border-2 border-white dark:border-inmo-darkbg transition-all duration-300 shadow-sm`}
            >
              {typeof badge === 'number' ? (badge > 99 ? '99+' : badge) : ''}
            </span>
          )}
        </div>
        <span 
          className={`text-[10px] md:text-xs font-medium transition-all duration-300 ${isActive ? 'font-bold' : ''}`}
        >
          {label}
        </span>
      </div>
    </button>
  );
};

export const FloatingNavBar: React.FC<FloatingNavBarProps> = ({
  role = 'public',
  activeRoute = 'home',
  onNavigate,
  onOpenChatbot,
  hideChatbot = false
}) => {
  const renderNavItems = () => {
    switch (role) {
      case 'asesor':
        return (
          <>
            <NavButton route="asesor" label="Inicio" Icon={Home} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="asesor/propiedades" label="Inmuebles" Icon={Building2} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="asesor/mensajes" label="Mensajes" Icon={Send} activeRoute={activeRoute} onNavigate={onNavigate} badge={3} />
          </>
        );
      case 'admin':
        return (
          <>
            <NavButton route="admin" label="Inicio" Icon={Home} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="admin/asesores" label="Asesores" Icon={User} activeRoute={activeRoute} onNavigate={onNavigate} badge={true} />
            <NavButton route="admin/moderacion" label="Moderación" Icon={BookOpenText} activeRoute={activeRoute} onNavigate={onNavigate} badge={12} />
            <NavButton route="admin/catalogos" label="Catálogos" Icon={FolderOpen} activeRoute={activeRoute} onNavigate={onNavigate} />
          </>
        );
      case 'public':
      default:
        return (
          <>
            <NavButton route="home" label="Inicio" Icon={Home} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="map" label="Mapa" Icon={Map} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="favorites" label="Favoritos" Icon={Heart} activeRoute={activeRoute} onNavigate={onNavigate} badge={2} />
            <NavButton route="messages" label="Mensajes" Icon={Send} activeRoute={activeRoute} onNavigate={onNavigate} badge={true} />
          </>
        );
    }
  };

  const liquidGlassClasses = "bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]";

  return (
    <div className="fixed bottom-6 left-0 right-0 px-6 flex gap-3 justify-center z-40">
      
      {/* Barra de Navegación Dinámica por Rol */}
      <div className={`${liquidGlassClasses} rounded-full h-[64px] flex-1 max-w-[340px] md:max-w-[400px] flex items-center justify-around px-2 transition-colors`}>
        {renderNavItems()}
      </div>

      {/* Botón Flotante del Chatbot */}
      {!hideChatbot && (
        <button 
          onClick={onOpenChatbot}
          className={`relative flex items-center justify-center w-[64px] h-[64px] bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-full shrink-0 cursor-pointer hover:scale-105 transition-transform group outline-none`}
        >
          <div className="relative text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-300 group-hover:scale-110">
            <Astroid className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2} />
          </div>
        </button>
      )}

    </div>
  );
};