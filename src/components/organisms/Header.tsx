import React, { useState } from 'react';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';

export interface HeaderProps {
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onNavigate?: (route: string) => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
  userInitials?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode = false,
  onToggleTheme,
  onNavigate,
  onLogout,
  userName = 'Ana López',
  userRole = 'Usuario',
  userInitials = 'AL'
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="sticky top-6 z-30 px-6 w-full pointer-events-none mb-6">
      <header className="relative flex justify-between items-center py-2 px-4 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm rounded-full pointer-events-auto">
        
        {/* Toggle Dark Mode */}
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

        {/* Logotipo */}
        <img
          src="/inmo.png"
          alt="INMO"
          className="h-15 md:h-12 absolute left-1/2 -translate-x-1/2 object-contain transition-all dark:hidden"
        />
        <img
          src="/inmo white.png"
          alt="INMO"
          className="h-15 md:h-12 absolute left-1/2 -translate-x-1/2 object-contain transition-all hidden dark:block"
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
                <span className="text-subtitle-sm">{userName}</span>
                <span className="text-caption capitalize">{userRole}</span>
              </div>
            </div>
            
            <div className="p-2 flex flex-col gap-1">
              <Button 
                onClick={() => {
                  onNavigate?.('profile');
                  setIsUserMenuOpen(false);
                }}
                variant="text"
                className="w-full !justify-start px-4 py-3 !text-sm !font-bold !text-inmo-secondary dark:!text-white hover:!bg-gray-50 dark:hover:!bg-inmo-darkbg !rounded-xl transition-colors !shadow-none"
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
                className="w-full !justify-start px-4 py-3 !text-sm !font-bold !text-red-500 hover:!bg-red-50 dark:hover:!bg-red-950/30 !rounded-xl transition-colors !shadow-none"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
