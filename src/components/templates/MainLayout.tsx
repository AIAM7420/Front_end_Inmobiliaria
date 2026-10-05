import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { NavHeader } from '../organisms/NavHeader';
import { FloatingNavBar } from '../organisms/FloatingNavBar';
import { GlobalChatbot } from '../organisms/GlobalChatbot';
import { useGetMe, useLogout } from '../../integrations/backend/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../integrations/backend/axios.config';
import { AdvisorAccessGate } from '../organisms/AdvisorAccessGate';
export function MainLayout() {
  return <AdvisorAccessGate><MainLayoutContent /></AdvisorAccessGate>;
}
function MainLayoutContent() {
  const { isDarkMode, toggleTheme, themeError, role, isAuthenticated } = useAppContext();
  const me = useGetMe();
  const logout = useLogout();
  const location = useLocation();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const configuration = useQuery({ queryKey: ['portal', 'configuration'], queryFn: async () => (await api.get<Array<{ clave: string; valor: string }>>('/configuracion/publica')).data, staleTime: 60_000 });
  const portalName = configuration.data?.find(item => item.clave === 'nombre_portal')?.valor;
  const publicNotice = configuration.data?.find(item => item.clave === 'aviso_publico')?.valor;
  useEffect(() => { if (portalName) document.title = portalName; }, [portalName]);
  useEffect(() => {
    const open = () => setChatOpen(true);
    window.addEventListener('open-chatbot', open);
    return () => window.removeEventListener('open-chatbot', open);
  }, []);
  const activeRoute = location.pathname === '/' ? 'home' : location.pathname.slice(1).replace(/\/$/,'');
  const full = activeRoute.startsWith('asesores/') || ['home','inmuebles','map','asesor','asesor/propiedades','admin','admin/asesores','admin/moderacion','admin/solicitudes','admin/reportes','admin/finanzas','profile','asesor/profile','admin/profile','favorites','messages','asesor/mensajes'].includes(activeRoute);
  const account = me.data?.value;
  return <div className="bg-gray-50 dark:bg-inmo-darkbg min-h-screen w-full relative transition-colors overflow-hidden text-inmo-secondary dark:text-white">
    <div className={(activeRoute === 'map' ? 'hidden md:block ' : '') + (full ? 'absolute top-0 w-full pointer-events-none ' : '') + 'pt-3 md:pt-6 z-30'}>
      <NavHeader isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onNavigate={r => navigate(r === 'home' ? '/' : '/' + r)}
        onLogout={() => logout.mutate()} userName={account?.nombre ?? 'Invitado'} userRole={account?.rol ?? 'Visitante'}
        userInitials={account?.nombre.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() ?? 'IN'}
        role={role ?? 'public'} isAuthenticated={isAuthenticated} activeRoute={activeRoute} />
    </div>
    <div className={full ? 'h-[100dvh] overflow-hidden' : 'pb-32'}><Outlet /></div>
    {publicNotice && <aside role="status" className="fixed bottom-28 md:bottom-6 left-4 right-4 md:left-auto md:max-w-md z-40 bg-white dark:bg-inmo-darkcard rounded-2xl shadow-soft p-4 text-sm border border-inmo-accent/10">{publicNotice}</aside>}
    {themeError && <div role="alert" className="fixed bottom-28 left-4 right-4 md:left-auto md:max-w-md z-50 bg-white dark:bg-inmo-darkcard rounded-2xl shadow-soft p-4 text-sm">{themeError}<button type="button" className="block mt-2 text-inmo-accent font-bold" onClick={() => navigate(role === 'asesor' ? '/asesor/profile?view=general' : role === 'admin' ? '/admin/profile?view=general' : '/profile?view=general')}>Revisar preferencias</button></div>}
    <div className="md:hidden"><FloatingNavBar role={role ?? 'public'} activeRoute={activeRoute} isAuthenticated={isAuthenticated} onNavigate={r => navigate(r === 'home' ? '/' : '/' + r)} onOpenChatbot={() => setChatOpen(true)} hideChatbot={role === 'asesor' || role === 'admin'} /></div>
    {role !== 'asesor' && role !== 'admin' && <GlobalChatbot isOpen={chatOpen} onOpen={() => setChatOpen(true)} onClose={() => setChatOpen(false)} />}
  </div>;
}
