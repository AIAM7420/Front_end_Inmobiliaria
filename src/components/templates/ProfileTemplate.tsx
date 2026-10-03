import { useState } from 'react';
import { User, Shield, CreditCard, FileCheck, Sun, Mail, Phone, Settings } from 'lucide-react';
import { AccountSettings } from '../organisms/AccountSettings';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SplitViewLayout } from './SplitViewLayout';
import { useAppContext } from '../../context/AppContext';
import { useGetMe, useLogout, useUpdateMe } from '../../integrations/backend/hooks/useAuth';
import { getMe } from '../../integrations/backend/auth.service';
import { isVersionConflict, operationError } from '../../integrations/backend/versioning';
import type { Versioned } from '../../integrations/backend/auth.service';
import type { Cuenta } from '../../integrations/backend/types';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Skeleton } from '../atoms/Skeleton';
import { ConflictNotice } from '../molecules/ConflictNotice';
import { AdvisorValidationView } from '../views/asesor/AdvisorValidationView';
import { AdvisorSubscriptionView } from '../views/asesor/AdvisorSubscriptionView';

function AccountEditor({ initial }: { initial: Versioned<Cuenta> }) {
  const [name, setName] = useState(initial.value.nombre);
  const [phone, setPhone] = useState(initial.value.telefono ?? '');
  const [snapshot, setSnapshot] = useState(initial);
  const [conflict, setConflict] = useState(false);
  const update = useUpdateMe();
  return <form className="flex flex-col gap-6 pb-8 px-6 mt-8 font-inter text-sm" onSubmit={async event => {
    event.preventDefault();
    if (conflict) return;
    try {
      const result = await update.mutateAsync({ payload: { nombre: name.trim(), telefono: phone.trim() || null }, etag: snapshot.etag });
      setSnapshot(result);
    } catch (error) { if (isVersionConflict(error)) setConflict(true); }
  }}>
    <div className="flex flex-col items-center justify-center space-y-4"><div className="w-28 h-28 rounded-full bg-gray-300 dark:bg-inmo-darktertiary flex items-center justify-center border-4 border-gray-50 dark:border-inmo-darkbg shadow-sm"><User className="w-14 h-14 text-white dark:text-gray-400" strokeWidth={1.5} /></div></div>
    <div className="bg-white dark:bg-inmo-darkcard rounded-2xl shadow-soft border border-gray-100 dark:border-white/5 overflow-hidden">
      <div className="p-4 flex flex-col gap-2"><label htmlFor="account-name" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre completo</label><Input id="account-name" aria-label="Nombre" leftIcon={<User className="w-5 h-5 text-gray-400" />} wrapperClassName="!bg-gray-50 dark:!bg-inmo-darkbg !shadow-none" value={name} onChange={event => setName(event.target.value)} required minLength={1} maxLength={160} /></div>
      <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" /><div className="p-4 flex flex-col gap-2"><label htmlFor="account-phone" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Teléfono</label><Input id="account-phone" aria-label="Teléfono" leftIcon={<Phone className="w-5 h-5 text-gray-400" />} wrapperClassName="!bg-gray-50 dark:!bg-inmo-darkbg !shadow-none" value={phone} onChange={event => setPhone(event.target.value)} maxLength={32} /></div>
      <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" /><div className="p-4 flex flex-col gap-2"><label htmlFor="account-email" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Correo electrónico</label><Input id="account-email" readOnly value={snapshot.value.correo} leftIcon={<Mail className="w-5 h-5 text-gray-400" />} wrapperClassName="!bg-gray-50 dark:!bg-inmo-darkbg !shadow-none" /></div>
    </div>
    {conflict && <ConflictNotice current={<p>Versión consultada: {snapshot.value.nombre} · {snapshot.value.telefono ?? 'Sin teléfono'}</p>} onReview={async () => {
      const latest = await getMe(); setSnapshot(latest); update.reset();
    }} onAccept={() => setConflict(false)} />}
    <Button type="submit" className="w-full sm:w-1/3 self-center !py-3" disabled={conflict || update.isPending || !name.trim()} isLoading={update.isPending}>Guardar cambios</Button>
    {update.isSuccess && <p role="status" className="text-inmo-success">Perfil actualizado.</p>}
    {update.isError && !conflict && <p role="alert">{operationError(update.error)}</p>}
  </form>;
}
export function ProfileTemplate() {
  const me = useGetMe();
  const { role, toggleTheme, isDarkMode } = useAppContext();
  const logout = useLogout();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [view, setView] = useState(params.get('view') === 'plan' ? 'plan' : 'account');
  const [open, setOpen] = useState(params.get('view') === 'plan');
  const items = [
    { key: 'account', title: 'Información de cuenta', icon: <User /> },
    ...(role === 'asesor' ? [
      { key: 'documents', title: 'Documentación profesional', icon: <FileCheck /> },
      { key: 'plan', title: 'Plan y pagos', icon: <CreditCard /> },
    ] : []),
    { key: 'security', title: 'Seguridad', icon: <Shield /> },
    { key: 'general', title: 'General', icon: <Settings /> },
  ];
  const main = <AccountSettings account={me.data?.value} advisor={role === 'asesor'} view={view} open={open} pending={logout.isPending}
    onSelect={key => { setView(key); setOpen(true); }} onLogout={() => logout.mutate()} />;
  const detail = view === 'documents' ? <AdvisorValidationView embedded /> : view === 'plan' ? <AdvisorSubscriptionView embedded /> : view === 'general' ? <div className="px-6 mt-8 space-y-6 pb-8"><h3 className="font-montserrat font-bold text-xl">General</h3><Button variant="secondary" className="w-full !justify-start gap-3" onClick={toggleTheme}><Sun />{isDarkMode ? 'Usar modo claro' : 'Usar modo oscuro'}</Button></div> : view === 'security'
    ? <div className="p-6 space-y-5"><p>Recibirás un enlace por correo para restablecer tu contraseña.</p><Button onClick={() => navigate('/login?view=recovery')}>Recuperar contraseña</Button></div>
    : me.isLoading ? <Skeleton className="h-64" /> : me.isError ? <p role="alert">No pudimos cargar tu cuenta.</p>
    : me.data ? <AccountEditor key={me.data.value.id} initial={me.data} /> : null;
  return <SplitViewLayout mainContent={main} sideContent={detail} sidePosition="right" sidePanelWidthClass="w-[70%]" mainPanelWidthClass="md:w-[30%]" bottomSheetHeightMode="content" bottomSheetIsHero={false} bottomSheetNoPadding={false} isOpen={open} onClose={() => setOpen(false)} sideTitle={items.find(item => item.key === view)?.title ?? 'Mi cuenta'} />;
}
