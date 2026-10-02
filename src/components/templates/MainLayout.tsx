import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { NavHeader } from '../organisms/NavHeader';
import { FloatingNavBar } from '../organisms/FloatingNavBar';
import { GlobalChatbot } from '../organisms/GlobalChatbot';

export const MainLayout: React.FC = () => {
  const { isDarkMode, toggleTheme, logout, role, isAuthenticated } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isChatOpen, setIsChatOpen] = useState(false);

  React.useEffect(() => {
    const handleOpenChatbot = () => setIsChatOpen(true);
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  // Derivar la ruta activa a partir de la URL
  let activeRoute = location.pathname === '/' ? 'home' : location.pathname.substring(1);
  // Limpiar trailing slashes si existieran
  if (activeRoute.endsWith('/')) {
    activeRoute = activeRoute.slice(0, -1);
  }

  const isFullScreenLayout = ['map', 'home', 'asesor', 'asesor/propiedades', 'admin', 'admin/asesores', 'admin/moderacion', 'messages', 'asesor/mensajes', 'favorites'].includes(activeRoute);

  return (
    <div className="bg-gray-50 dark:bg-inmo-darkbg min-h-screen w-full relative transition-colors overflow-hidden">
      
      {/* 
        HEADER COMÚN
        En layouts full screen, ocultamos el header en móvil para tener pantalla completa.
      */}
      <div className={`${activeRoute === 'map' ? 'hidden md:block' : ''} ${isFullScreenLayout ? "w-full absolute top-0 pt-3 md:pt-6 z-30 pointer-events-none" : "pt-3 md:pt-6"}`}>
        <NavHeader 
          isDarkMode={isDarkMode} 
          onToggleTheme={toggleTheme} 
          onNavigate={(r) => navigate(r === 'home' ? '/' : `/${r}`)} 
          onLogout={() => { logout(); navigate('/'); }} 
          role={role || 'public'}
          isAuthenticated={isAuthenticated}
          activeRoute={activeRoute}
          subscriptionPlan={role === 'asesor' ? 'basic' : null}
        />
      </div>

      {/* AQUÍ SE INYECTAN LAS VISTAS (Landing, Map, Favorites, etc.) */}
      <div className={isFullScreenLayout ? "h-[100dvh] overflow-hidden" : "pt-24 md:pt-0 pb-32"}>
        <Outlet />
      </div>

      {/* FLOATING NAVBAR (MOBILE ONLY) */}
      <div className="md:hidden">
        <FloatingNavBar
          role={role || 'public'}
          activeRoute={activeRoute}
          onOpenChatbot={() => setIsChatOpen(true)}
          onNavigate={(r) => navigate(r === 'home' ? '/' : `/${r}`)}
          hideChatbot={role === 'asesor' || role === 'admin'}
        />
      </div>

      {/* CHATBOT GLOBAL (Solo para usuarios públicos) */}
      {role !== 'asesor' && role !== 'admin' && (
        <GlobalChatbot 
          isOpen={isChatOpen} 
          onOpen={() => setIsChatOpen(true)} 
          onClose={() => setIsChatOpen(false)} 
          hideButton={location.pathname.includes('/messages') || location.pathname.includes('/mensajes') || location.pathname.includes('/asesor/propiedades')}
        />
      )}

    </div>
  );
};
