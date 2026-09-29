import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sun, Moon, MoreVertical, LogOut, Crown, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { SearchBar } from '../molecules/SearchBar';
import { FilterDropdown } from '../molecules/FilterDropdown';
import { useAppContext } from '../../context/AppContext';

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
  subscriptionPlan?: string | null;
}

export const NavHeader: React.FC<NavHeaderProps> = ({
  isDarkMode = false,
  onToggleTheme,
  onNavigate,
  onLogout,
  userName = 'Ana López',
  userRole = 'Usuario',
  userInitials = 'AL',
  activeRoute = 'home',
  role = 'public',
  isAuthenticated = false,
  subscriptionPlan = null
}) => {
  const { globalSearchQuery, setGlobalSearchQuery, setGlobalFilters } = useAppContext();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToTop = () => {
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (val: string) => {
    setGlobalSearchQuery(val);
    if (activeRoute !== 'home' && onNavigate) {
      onNavigate('home');
    }
    scrollToTop();
    setIsMobileSearchOpen(false);
  };

  const handleFilterApply = (filters: any) => {
    setGlobalFilters(filters);
    setIsFiltersOpen(false);
    if (activeRoute !== 'home' && onNavigate) {
      onNavigate('home');
    }
    scrollToTop();
  };

  const headerRef = React.useRef<HTMLDivElement>(null);
  const searchPopoverRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    
    const handleCustomScroll = (e: Event) => {
      const customEvent = e as CustomEvent<{ scrollY: number }>;
      setIsScrolled(customEvent.detail.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('app-scroll', handleCustomScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('app-scroll', handleCustomScroll);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      
      // Si el usuario hace clic en el backdrop del filtro, no queremos cerrar el buscador.
      // El backdrop del filtro tiene la clase "fixed inset-0 z-40" en FilterDropdown.tsx
      // Pero para ser más seguros, podemos revisar si target.closest('.filter-dropdown-content') o algo similar.
      // Para solucionarlo rápido, le daremos una clase especial al dropdown.
      if (target.closest('.filter-dropdown-container') || target.classList.contains('filter-backdrop')) {
        return;
      }

      if (
        headerRef.current && 
        !headerRef.current.contains(target) &&
        searchPopoverRef.current &&
        !searchPopoverRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const navItems = {
    public: [
      { id: 'home', label: 'Inicio' },
      { id: 'map', label: 'Mapa' },
      { id: 'favorites', label: 'Favoritos' },
      { id: 'messages', label: 'Mensajes' },
    ],
    asesor: [
      { id: 'asesor', label: 'Inicio' },
      { id: 'asesor/propiedades', label: 'Inmuebles' },
      { id: 'asesor/mensajes', label: 'Mensajes' },
    ],
    admin: [
      { id: 'admin', label: 'Inicio' },
      { id: 'admin/asesores', label: 'Usuarios' },
      { id: 'admin/moderacion', label: 'Publicaciones' },
      { id: 'admin/catalogos', label: 'Catálogos' },
    ]
  };

  const currentNavItems = navItems[role || 'public'];

  return (
    <div ref={headerRef} className="fixed md:sticky top-3 md:top-6 z-50 md:z-30 px-6 w-full md:mb-6 pointer-events-none">
      
      {/* Backdrops & Modals (Portaled to body to completely escape all stacking contexts) */}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-40 flex items-start justify-center pt-24 px-4 pointer-events-none">
          {/* Mobile Search Popover Wrapper */}
          <div
            ref={searchPopoverRef}
            className={`absolute top-20 w-[calc(100%-3rem)] flex gap-2 items-center z-50 transition-all duration-300 transform origin-top ${
              isMobileSearchOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            {/* Search Bar */}
            <div className="flex-1 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-[32px] p-1.5 h-[52px]">
              <SearchBar 
                value={globalSearchQuery}
                onSubmit={handleSearchSubmit}
                autoFocus={isMobileSearchOpen} 
                placeholder="Buscar..." 
                size="slim" 
                glass={false} 
                className="w-full !h-10 !shadow-none !border-none !bg-transparent dark:!bg-transparent"
              />
            </div>
            
            {/* Filter Button */}
            <div className="relative shrink-0">
              <IconButton 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                icon={<SlidersHorizontal className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />}
                variant="secondary"
                className={`w-[52px] h-[52px] !bg-white/60 dark:!bg-black/60 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] !rounded-full ${isFiltersOpen ? 'text-inmo-accent' : 'text-gray-500 dark:text-gray-400'}`}
              />
              <FilterDropdown 
                isOpen={isFiltersOpen && isMobileSearchOpen} 
                onApply={handleFilterApply} 
                onClose={() => setIsFiltersOpen(false)} 
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      <header className="relative z-50 flex justify-between items-center py-1.5 md:py-2 px-4 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm rounded-full pointer-events-auto">
        
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
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {currentNavItems.map((item: { id: string, label: string }) => {
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className={`
                    relative px-6 py-3 font-inter font-bold text-sm rounded-full
                    transition-colors duration-300 group outline-none
                    ${isActive 
                      ? 'bg-gray-100 dark:bg-white/10 text-inmo-secondary dark:text-white' 
                      : 'bg-transparent text-inmo-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                    }
                  `}
                >
                  {/* Contenedor con más altura para dar espacio a la animación */}
                  <span className="relative block overflow-hidden h-[1.4em] leading-[1.4em]">
                    {/* Texto Original (Se va hacia arriba al hacer hover) */}
                    <span className="block transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">
                      {item.label}
                    </span>
                    {/* Texto Nuevo (Sube desde abajo al hacer hover) */}
                    <span className="absolute inset-0 block transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] translate-y-full group-hover:translate-y-0">
                      {item.label}
                    </span>
                  </span>
                </button>
              );
            })}
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

        {/* User Menu Dropdown & Actions */}
        <div className="relative z-20 flex gap-2 md:gap-3 items-center">
          
          {/* Desktop Floating Search Wrapper */}
          <div className={`hidden md:flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-right ${(activeRoute !== 'map' && (isScrolled || activeRoute !== 'home')) ? 'opacity-100 scale-100 mr-2 pointer-events-auto' : 'opacity-0 scale-95 mr-0 pointer-events-none'}`}>
            <div className={`transition-all duration-500 overflow-hidden ${(activeRoute !== 'map' && (isScrolled || activeRoute !== 'home')) ? 'w-80' : 'w-0'}`}>
              <SearchBar 
                value={globalSearchQuery}
                onSubmit={handleSearchSubmit}
                placeholder="Buscar en cualquier lugar..." 
                size="slim" 
                glass 
                className="w-full !shadow-none border border-gray-200 dark:border-white/10" 
              />
            </div>
            <div className={`relative shrink-0 transition-all duration-500 ${(activeRoute !== 'map' && (isScrolled || activeRoute !== 'home')) ? 'w-[44px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
              <IconButton 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                icon={<SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />}
                variant="secondary"
                className={`w-[44px] h-[44px] !bg-white/40 dark:!bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 !shadow-sm hover:!bg-white/50 dark:hover:!bg-black/30 !rounded-full ${isFiltersOpen ? 'text-inmo-accent' : 'text-gray-500 dark:text-gray-400'}`}
              />
              <FilterDropdown 
                isOpen={isFiltersOpen && !isMobileSearchOpen} 
                onApply={handleFilterApply} 
                onClose={() => setIsFiltersOpen(false)} 
              />
            </div>
          </div>

          {/* Mobile Search Button */}
          <div className="relative md:hidden flex items-center">
            <div className={`transition-all duration-300 overflow-hidden ${(activeRoute !== 'map' && (isScrolled || activeRoute !== 'home') && !isMobileSearchOpen) ? 'opacity-100 scale-100 w-10' : 'opacity-0 scale-50 w-0 pointer-events-none'}`}>
              <IconButton 
                onClick={() => {
                  setIsMobileSearchOpen(!isMobileSearchOpen);
                  setIsUserMenuOpen(false); // Close other menu
                }}
                icon={<Search className="w-5 h-5 text-inmo-secondary dark:text-white" strokeWidth={2.5} />}
                variant="ghost"
                className="hover:!bg-white/50 dark:hover:!bg-white/10 !rounded-full shrink-0"
              />
            </div>
          </div>

          <IconButton 
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsMobileSearchOpen(false); // Close other menu
            }} 
            icon={<MoreVertical className="w-5 h-5 text-inmo-secondary dark:text-white" strokeWidth={2.5} />}
            variant="ghost"
            className="hover:!bg-white/50 dark:hover:!bg-white/10 !rounded-full shrink-0"
          />
          
          <div 
            className={`absolute right-0 top-full mt-4 w-56 bg-white dark:bg-inmo-darkcard rounded-2xl shadow-xl border border-gray-100 dark:border-inmo-darktertiary z-20 overflow-hidden transition-all duration-200 origin-top-right ${
              isUserMenuOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
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
                  {subscriptionPlan && role === 'asesor' && (
                    <Button 
                      onClick={() => {
                        onNavigate?.('asesor/profile?view=plan');
                        setIsUserMenuOpen(false);
                      }}
                      variant="text"
                      icon={<Crown className="w-4 h-4" />}
                      className={`w-full !justify-start px-4 py-3 !text-sm !font-bold !rounded-xl transition-colors !shadow-none border ${
                        subscriptionPlan === 'basic' 
                        ? 'border-transparent !text-gray-600 dark:!text-gray-300 hover:!bg-gray-100 dark:hover:!bg-white/10' 
                        : 'border-inmo-accent/20 !text-inmo-accent bg-inmo-accent/5 hover:!bg-inmo-accent/10'
                      }`}
                    >
                      Plan {subscriptionPlan}
                    </Button>
                  )}
                  <Button 
                    onClick={() => {
                      onNavigate?.(role === 'asesor' ? 'asesor/profile' : role === 'admin' ? 'admin/profile' : 'profile');
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
