import { useState } from 'react';
import { Home, Map, Heart, Send, User, Building2, MoreHorizontal } from 'lucide-react';
import { navigationFor } from '../../navigation';
import { Button } from '../atoms/Button';
import { BottomSheet } from './BottomSheet';
import { ChatbotAvatar } from '../atoms/ChatbotAvatar';
interface FloatingNavBarProps {
  role?: 'public' | 'asesor' | 'admin'; activeRoute?: string; isAuthenticated?: boolean;
  onNavigate?: (route: string) => void; onOpenChatbot?: () => void; hideChatbot?: boolean;
}
const glass = 'bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm';
const iconFor = (id: string) => id === 'map' ? Map : id === 'favorites' ? Heart : id.includes('mensajes') || id === 'messages' ? Send : id.includes('asesores') ? User : id === 'inmuebles' || id.includes('propiedades') ? Building2 : Home;
export function FloatingNavBar({ role = 'public', activeRoute = 'home', isAuthenticated = false, onNavigate, onOpenChatbot, hideChatbot = false }: FloatingNavBarProps) {
  const [more, setMore] = useState(false);
  const items = navigationFor(role, isAuthenticated), primary = role === 'admin' ? items.slice(0, 4) : items;
  const go = (id: string) => { setMore(false); onNavigate?.(id); };
  return <>
    <nav aria-label="Navegación principal móvil" className="fixed bottom-6 left-0 right-0 px-4 flex gap-3 justify-center z-40">
      <div className={glass + ' rounded-full h-[64px] flex-1 max-w-[400px] flex items-center justify-around px-1'}>
        {primary.map(item => { const Icon = iconFor(item.id), active = activeRoute === item.id; return <Button key={item.id} variant="ghost" aria-current={active ? 'page' : undefined} onClick={() => go(item.id)} className="!p-1 !h-full !min-w-0 !rounded-full flex-1 !bg-transparent"><span className={'flex flex-col items-center gap-1 ' + (active ? 'text-inmo-secondary dark:text-white' : 'text-gray-500')}><Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} /><span className="text-[9px] font-medium whitespace-nowrap">{item.label}</span></span></Button>; })}
        {role === 'admin' && <Button variant="ghost" aria-label="Más opciones administrativas" aria-expanded={more} onClick={() => setMore(true)} className="!p-1 !h-full !bg-transparent"><span className="flex flex-col items-center gap-1 text-gray-500"><MoreHorizontal className="w-5 h-5" /><span className="text-[9px]">Más</span></span></Button>}
      </div>
      <div
        inert={hideChatbot} aria-hidden={hideChatbot}
        className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${
          hideChatbot
            ? 'w-0 opacity-0 scale-0 pointer-events-none -mr-3'
            : 'w-[64px] opacity-100 scale-100'
        }`}
      >
        <button
          type="button"
          aria-label="Abrir asistente"
          onClick={onOpenChatbot}
          className="group relative w-[64px] h-[64px] rounded-full p-0 flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-inmo-accent"
        >
          <ChatbotAvatar className="w-full h-full pointer-events-none drop-shadow-sm" />
        </button>
      </div>
    </nav>
    {more && <BottomSheet isOpen onClose={() => setMore(false)} title="Administración"><div className="grid gap-3 pb-8">{items.slice(4).map(item => <Button key={item.id} variant="secondary" className="w-full !justify-start" onClick={() => go(item.id)}>{item.label}</Button>)}</div></BottomSheet>}
  </>;
}
