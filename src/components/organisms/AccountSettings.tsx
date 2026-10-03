import { ArrowLeft, ChevronRight, CreditCard, FileCheck, LogOut, Settings, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Cuenta } from '../../integrations/backend/types';
import { IconButton } from '../atoms/IconButton';

/** The original public/advisor configuration layout, with accessible real actions. */
export function AccountSettings({ account, advisor, view, open, pending, onSelect, onLogout }: {
  account?: Cuenta; advisor: boolean; view: string; open: boolean; pending: boolean;
  onSelect: (view: string) => void; onLogout: () => void;
}) {
  const navigate = useNavigate();
  const initials = account?.nombre.split(' ').filter(Boolean).map(word => word[0]).slice(0, 2).join('').toUpperCase() ?? 'IN';
  const rows = [
    ...(advisor ? [{ key: 'documents', label: 'Expediente y Verificación', icon: <FileCheck className="w-5 h-5 shrink-0" /> },
      { key: 'plan', label: 'Suscripción y pagos', icon: <CreditCard className="w-5 h-5 shrink-0" /> }] : []),
    { key: 'general', label: 'General', icon: <Settings className="w-5 h-5 shrink-0" /> },
    { key: 'security', label: 'Seguridad', icon: <Shield className="w-5 h-5 shrink-0" /> },
  ];
  return <div className="h-full min-h-0 overflow-y-auto overscroll-contain bg-gray-50 dark:bg-inmo-darkbg pb-24 pt-[88px] md:pt-[100px] font-inter">
    <div className="sticky top-0 z-20 bg-gray-50/80 dark:bg-inmo-darkbg/80 backdrop-blur-xl px-4 py-4 flex items-center gap-3">
      <IconButton aria-label="Volver" icon={<ArrowLeft className="w-6 h-6 text-inmo-secondary dark:text-white" strokeWidth={2.5} />} onClick={() => navigate(-1)} variant="ghost" className="!p-1 hover:!bg-gray-200 dark:hover:!bg-inmo-darktertiary !rounded-full" />
      <h1 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white">Configuración</h1>
    </div>
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto space-y-8">
      <div className="space-y-3"><h2 className="font-bold text-lg text-inmo-secondary dark:text-white ml-2">{advisor ? 'Asesor' : account?.rol === 'SUPERADMINISTRADOR' ? 'Administrador' : 'Cuenta'}</h2>
        <button type="button" onClick={() => onSelect('account')} className={`w-full text-left flex items-center justify-between bg-white dark:bg-inmo-darkcard rounded-2xl p-4 ${advisor ? '' : 'shadow-sm'} transition-all active:scale-[0.98] border ${view === 'account' && open ? 'border-inmo-accent ring-2 ring-inmo-accent/20' : 'border-transparent dark:border-white/5 hover:shadow-md'}`}>
          <span className="flex items-center gap-4 min-w-0"><span className={`w-14 h-14 rounded-full ${advisor ? 'bg-gray-300 dark:bg-inmo-darktertiary' : 'bg-inmo-accent/10'} flex items-center justify-center border-2 border-white dark:border-inmo-darkbg overflow-hidden shrink-0`}>
            {advisor ? <User className="w-7 h-7 text-white dark:text-gray-400" strokeWidth={1.5} /> : <span className="text-xl font-montserrat font-bold text-inmo-accent">{initials}</span>}
          </span><span className="flex flex-col min-w-0"><span className="font-bold text-base text-inmo-secondary dark:text-white truncate">{account?.nombre ?? 'Mi cuenta'}</span><span className="text-sm font-medium text-gray-500 dark:text-gray-400">Información personal</span></span></span>
          <ChevronRight className={`w-5 h-5 shrink-0 ${view === 'account' && open ? 'text-inmo-accent' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="space-y-3"><h2 className="font-bold text-lg text-inmo-secondary dark:text-white ml-2">Ajustes</h2>
        <div className={`bg-white dark:bg-inmo-darkcard rounded-2xl ${advisor ? '' : 'shadow-sm'} border border-transparent dark:border-white/5 overflow-hidden flex flex-col`}>
          {rows.map(row => <button type="button" key={row.key} onClick={() => onSelect(row.key)} className={`w-full text-left flex items-center justify-between p-4 border-b border-gray-100 dark:border-inmo-darktertiary transition-colors group border-l-4 ${view === row.key && open ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10 border-l-inmo-accent pl-3' : 'hover:bg-gray-50 dark:hover:bg-inmo-darktertiary active:bg-gray-100 dark:active:bg-inmo-darkbg border-l-transparent'}`}>
            <span className="flex items-center gap-4"><span className="text-inmo-accent/80 group-hover:text-inmo-accent">{row.icon}</span><span className={`font-bold text-body ${view === row.key && open ? 'text-inmo-accent' : 'text-inmo-secondary dark:text-white'}`}>{row.label}</span></span>
            <ChevronRight className={`w-5 h-5 ${view === row.key && open ? 'text-inmo-accent' : 'text-gray-300 dark:text-gray-600'}`} />
          </button>)}
          <button type="button" disabled={pending} onClick={onLogout} className="w-full text-left flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-inmo-darktertiary active:bg-gray-100 dark:active:bg-inmo-darkbg transition-colors disabled:opacity-50"><span className="flex items-center gap-4"><LogOut className="w-5 h-5 text-gray-500 shrink-0" /><span className="font-bold text-body text-gray-500">{pending ? 'Cerrando sesión…' : 'Cerrar sesión'}</span></span></button>
        </div>
      </div>
    </div>
  </div>;
}
