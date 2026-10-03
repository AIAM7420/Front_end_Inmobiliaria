import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { NavHeader } from '../organisms/NavHeader';
import { FloatingNavBar } from '../organisms/FloatingNavBar';
import { GlobalChatbot } from '../organisms/GlobalChatbot';
import { useGetMe, useLogout } from '../../integrations/backend/hooks/useAuth';
export function MainLayout() {
  const { isDarkMode, toggleTheme, role, isAuthenticated } = useAppContext();
  const me = useGetMe();
  const logout = useLogout();
  const location = useLocation();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  useEffect(() => {
    const open = () => setChatOpen(true);
    window.addEventListener('open-chatbot', open);
    return () => window.removeEventListener('open-chatbot', open);
  }, []);
  const activeRoute = location.pathname === '/' ? 'home' : location.pathname.slice(1).replace(/\/$/,'');
  const full = ['home','map','asesor','asesor/propiedades','admin','admin/asesores','admin/moderacion','admin/solicitudes','admin/reportes','admin/finanzas','profile','asesor/profile','admin/profile'].includes(activeRoute);
  const account = me.data?.value;
  return <div className="bg-gray-50 dark:bg-inmo-darkbg min-h-screen w-full relative transition-colors overflow-hidden text-inmo-secondary dark:text-white">
    <div className={(activeRoute === 'map' ? 'hidden md:block ' : '') + (full ? 'absolute top-0 w-full pointer-events-none ' : '') + 'pt-3 md:pt-6 z-30'}>
      <NavHeader isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onNavigate={r => navigate(r === 'home' ? '/' : '/' + r)}
        onLogout={() => logout.mutate()} userName={account?.nombre ?? 'Invitado'} userRole={account?.rol ?? 'Visitante'}
        userInitials={account?.nombre.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() ?? 'IN'}
        role={role ?? 'public'} isAuthenticated={isAuthenticated} activeRoute={activeRoute} />
    </div>
    <div className={full ? 'h-[100dvh] overflow-hidden' : 'pb-32'}><Outlet /></div>
    <div className="md:hidden"><FloatingNavBar role={role ?? 'public'} activeRoute={activeRoute} onNavigate={r => navigate(r === 'home' ? '/' : '/' + r)} onOpenChatbot={() => setChatOpen(true)} hideChatbot={role === 'asesor' || role === 'admin'} /></div>
    {role !== 'asesor' && role !== 'admin' && <GlobalChatbot isOpen={chatOpen} onOpen={() => setChatOpen(true)} onClose={() => setChatOpen(false)} />}
  </div>;
}
