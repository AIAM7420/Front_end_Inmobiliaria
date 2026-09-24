import React, { useState } from 'react';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';

export interface NavHeaderProps {
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onNavigate?: (route: string) => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
  userInitials?: string;
  activeRoute?: string;
  role?: 'public' | 'asesor' | 'admin' | null;
  isAuthenticated?: boolean;
}

export const NavHeader: React.FC<NavHeaderProps> = ({
  isDarkMode = false,
  onToggleTheme,
  onNavigate,
  onLogout,
  userName = 'Invitado',
  userRole = 'Visitante',
  userInitials = 'IN',
  activeRoute = 'home',
  role = 'public',
  isAuthenticated = false
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = {
    public: [
      { id: 'home', label: 'Inicio' },
      { id: 'map', label: 'Mapa' },
      { id: 'favorites', label: 'Favoritos' },
      { id: 'messages', label: 'Mensajes' },
    ],
    asesor: [
      { id: 'asesor', label: 'Inicio' },
      { id: 'asesor/propiedades', label: 'Propiedades' },
      { id: 'asesor/validacion', label: 'Validación' },
      { id: 'asesor/mensajes', label: 'Mensajes' },
      { id: 'asesor/suscripcion', label: 'Suscripción' },
    ],
    admin: [
      { id: 'admin', label: 'Inicio' },
      { id: 'admin/solicitudes', label: 'Solicitudes' },
      { id: 'admin/cuentas', label: 'Cuentas' },
      { id: 'admin/propiedades', label: 'Publicaciones' },
      { id: 'admin/reportes', label: 'Reportes' },
      { id: 'admin/finanzas', label: 'Finanzas' },
    ]
  };

  const currentNavItems = navItems[role || 'public'];

  return (
    <div className="sticky top-6 z-30 px-6 w-full mb-6 pointer-events-none">
      <header className="relative flex justify-between items-center py-2 px-4 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm rounded-full pointer-events-auto">
        
        {/* Toggle Dark Mode & Logotipo (Mobile & Desktop) */}
        <div className="flex items-center gap-4">
          <IconButton 
            onClick={onToggleTheme} 
            icon={isDarkMode ? (
              <Sun className="w-5 h-5 text-inmo-secondary dark:text-white" strokeWidth={2.5} />
            ) : (
              <Moon className="w-5 h-5 text-inmo-secondary dark:text-white" strokeWidth={2.5} />
            )}
            variant="ghost"
            className="relative z-10 hover:!bg-white/50 dark:hover:!bg-white/10 !rounded-full shrink-0"
          />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 ml-4">
            {currentNavItems.map((item: { id: string, label: string }) => (
              <Button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                variant="text"
                className={`!text-sm !font-bold transition-colors !shadow-none !p-0 ${
                  activeRoute === item.id 
                    ? '!text-inmo-accent hover:!text-inmo-accent' 
                    : '!text-inmo-secondary dark:!text-white hover:!text-inmo-accent dark:hover:!text-inmo-accent'
                }`}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Logotipo Centrado (Mobile) / Izquierda-ish en Desktop? */}
        <img
          src="/inmo.png"
          alt="INMO"
          className="h-10 absolute left-1/2 -translate-x-1/2 object-contain transition-all dark:hidden"
        />
        <img
          src="/inmo white.png"
          alt="INMO"
          className="h-10 absolute left-1/2 -translate-x-1/2 object-contain transition-all hidden dark:block"
        />

        {/* User Menu Dropdown */}
        <div className="relative z-20 flex gap-2 items-center">
          <IconButton 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
            icon={<User className="w-5 h-5 text-inmo-secondary dark:text-white" strokeWidth={2.5} />}
            variant="ghost"
            className="hover:!bg-white/50 dark:hover:!bg-white/10 !rounded-full shrink-0"
          />
          
          {isUserMenuOpen && (
            <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
          )}
          
          <div 
            className={`absolute right-0 top-full mt-4 w-56 bg-white dark:bg-inmo-darkcard rounded-2xl shadow-xl border border-gray-100 dark:border-inmo-darktertiary z-20 overflow-hidden transition-all duration-200 origin-top-right ${
              isUserMenuOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
            }`}
          >
            <div className="p-4 border-b border-gray-100 dark:border-inmo-darktertiary flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-inmo-accent/10 flex items-center justify-center text-inmo-accent font-bold">
                {userInitials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-montserrat font-bold text-inmo-secondary dark:text-white">{userName}</span>
                <span className="text-xs font-inter capitalize text-gray-500 dark:text-gray-400">{userRole}</span>
              </div>
            </div>
            
            <div className="p-2 flex flex-col gap-1">
              {!isAuthenticated ? (
                <Button 
                  onClick={() => {
                    onNavigate?.('login');
                    setIsUserMenuOpen(false);
                  }}
                  variant="text"
                  className="w-full !justify-start px-4 py-3 !text-sm !font-normal !text-inmo-secondary dark:!text-white hover:!bg-gray-50 dark:hover:!bg-inmo-darkbg !rounded-xl transition-colors !shadow-none"
                >
                  Iniciar Sesión
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => {
                      onNavigate?.('profile');
                      setIsUserMenuOpen(false);
                    }}
                    variant="text"
                    className="w-full !justify-start px-4 py-3 !text-sm !font-normal !text-inmo-secondary dark:!text-white hover:!bg-gray-50 dark:hover:!bg-inmo-darkbg !rounded-xl transition-colors !shadow-none"
                  >
                    Ver perfil
                  </Button>
                  <Button 
                    onClick={() => {
                      onLogout?.();
                      setIsUserMenuOpen(false);
                    }}
                    variant="text"
                    icon={<LogOut className="w-4 h-4" />}
                    className="w-full !justify-start px-4 py-3 !text-sm !font-normal !text-red-500 hover:!bg-red-50 dark:hover:!bg-red-950/30 !rounded-xl transition-colors !shadow-none"
                  >
                    Cerrar Sesión
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
