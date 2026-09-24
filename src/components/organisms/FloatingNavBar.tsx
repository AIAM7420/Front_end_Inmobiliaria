// src/components/organisms/FloatingNavBar.tsx
import React from 'react';
import { Home, Map, Heart, Bot, Send, User, BookOpenText, Building2, CreditCard, ClipboardCheck } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

interface FloatingNavBarProps {
  role?: 'public' | 'asesor' | 'admin';
  activeRoute?: string;
  onNavigate?: (route: string) => void;
  onOpenChatbot?: () => void;
}

const NavButton = ({ route, Icon, activeRoute, onNavigate, badge }: { route: string, Icon: React.ElementType, activeRoute: string, onNavigate?: (r: string) => void, badge?: number | boolean }) => {
  const isActive = activeRoute === route;
  
  return (
    <IconButton 
      onClick={() => onNavigate?.(route)} 
      icon={
        <div className="relative flex items-center justify-center w-full h-full">
          <div className={`relative transition-transform duration-300 ${isActive ? '-translate-y-1.5' : 'translate-y-0'}`}>
            <Icon 
              className="w-6 h-6 md:w-7 md:h-7" 
              strokeWidth={1.75} 
            />
            {badge !== undefined && badge !== false && (
              <span 
                className={`absolute -top-1 -right-1 ${typeof badge === 'number' ? 'px-1 min-w-[16px] h-4 text-[10px] flex items-center justify-center font-bold' : 'w-2.5 h-2.5'} bg-inmo-accent text-white rounded-full border-2 border-white dark:border-inmo-darkbg transition-all duration-300 shadow-sm`}
              >
                {typeof badge === 'number' ? (badge > 99 ? '99+' : badge) : ''}
              </span>
            )}
          </div>
          <div 
            className={`absolute bottom-2 md:bottom-2.5 w-1.5 h-1.5 rounded-full bg-inmo-accent transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isActive ? 'scale-100 opacity-100 delay-150' : 'scale-0 opacity-0 delay-0'}`}
          />
        </div>
      }
      variant="ghost"
      className="!w-12 !h-12 md:!w-14 md:!h-14 !p-0 !rounded-full !bg-transparent !text-inmo-secondary dark:!text-white hover:!bg-white/50 dark:hover:!bg-black/20 !shadow-none"
    />
  );
};

export const FloatingNavBar: React.FC<FloatingNavBarProps> = ({
  role = 'public',
  activeRoute = 'home',
  onNavigate,
  onOpenChatbot
}) => {
  const renderNavItems = () => {
    switch (role) {
      case 'asesor':
        return (
          <>
            <NavButton route="asesor" Icon={Home} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="asesor/propiedades" Icon={Building2} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="asesor/validacion" Icon={ClipboardCheck} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="asesor/mensajes" Icon={Send} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="asesor/suscripcion" Icon={CreditCard} activeRoute={activeRoute} onNavigate={onNavigate} />
          </>
        );
      case 'admin':
        return (
          <>
            <NavButton route="admin" Icon={Home} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="admin/solicitudes" Icon={ClipboardCheck} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="admin/cuentas" Icon={User} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="admin/propiedades" Icon={Building2} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="admin/reportes" Icon={BookOpenText} activeRoute={activeRoute} onNavigate={onNavigate} />
          </>
        );
      case 'public':
      default:
        return (
          <>
            <NavButton route="home" Icon={Home} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="map" Icon={Map} activeRoute={activeRoute} onNavigate={onNavigate} />
            <NavButton route="favorites" Icon={Heart} activeRoute={activeRoute} onNavigate={onNavigate} badge={2} />
            <NavButton route="messages" Icon={Send} activeRoute={activeRoute} onNavigate={onNavigate} badge={true} />
          </>
        );
    }
  };

  const liquidGlassClasses = "bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]";

  return (
    <div className="fixed bottom-6 left-0 right-0 px-6 flex gap-3 justify-center z-40">
      
      {/* Barra de Navegación Dinámica por Rol */}
      <div className={`${liquidGlassClasses} rounded-full h-[64px] flex-1 max-w-[280px] flex items-center justify-around px-2 transition-colors`}>
        {renderNavItems()}
      </div>

      {/* Botón Flotante del Chatbot */}
      <IconButton 
        onClick={onOpenChatbot}
        icon={<Bot className="w-7 h-7 text-inmo-secondary dark:text-white" strokeWidth={1.75} />}
        variant="secondary"
        className={`!w-[64px] !h-[64px] !bg-white/40 dark:!bg-black/40 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 !shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] !rounded-full shrink-0`}
      />

    </div>
  );
};
