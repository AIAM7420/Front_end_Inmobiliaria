import { useState } from 'react';
import { User, Shield, CreditCard, FileCheck, Sun, LogOut } from 'lucide-react';
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
  return <form className="p-6 space-y-5 font-inter text-sm" onSubmit={async event => {
    event.preventDefault();
    if (conflict) return;
    try {
      const result = await update.mutateAsync({ payload: { nombre: name.trim(), telefono: phone.trim() || null }, etag: snapshot.etag });
      setSnapshot(result);
    } catch (error) { if (isVersionConflict(error)) setConflict(true); }
  }}>
    <div className="mx-auto w-24 h-24 rounded-full bg-inmo-tertiary dark:bg-inmo-darktertiary flex items-center justify-center"><User className="w-12 h-12 text-gray-500" /></div>
    <p>{snapshot.value.correo} · {snapshot.value.rol}</p>
    <Input aria-label="Nombre" value={name} onChange={event => setName(event.target.value)} required minLength={1} maxLength={160} />
    <Input aria-label="Teléfono" value={phone} onChange={event => setPhone(event.target.value)} maxLength={32} />
    {conflict && <ConflictNotice current={<p>Versión consultada: {snapshot.value.nombre} · {snapshot.value.telefono ?? 'Sin teléfono'}</p>} onReview={async () => {
      const latest = await getMe(); setSnapshot(latest); update.reset();
    }} onAccept={() => setConflict(false)} />}
    <Button type="submit" disabled={conflict || update.isPending || !name.trim()} isLoading={update.isPending}>Guardar cambios</Button>
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
  ];
  const main = <main className="pt-[104px] px-6 pb-32 max-w-3xl mx-auto text-inmo-secondary dark:text-white">
    <h1 className="font-montserrat font-bold text-3xl mb-6">Mi perfil</h1>
    <div className="rounded-card bg-white dark:bg-inmo-darkcard shadow-soft p-6 space-y-5">
      <div className="flex items-center gap-4"><div className="rounded-full bg-inmo-accent/10 p-4"><User /></div><div><h2 className="font-montserrat font-bold text-xl">{me.data?.value.nombre ?? 'Mi cuenta'}</h2><p className="text-sm text-gray-500">{me.data?.value.correo}</p></div></div>
      {items.map(item => <Button key={item.key} variant="ghost" className="w-full !justify-start gap-3 p-4" onClick={() => { setView(item.key); setOpen(true); }}>{item.icon}{item.title}</Button>)}
      <Button variant="ghost" className="w-full !justify-start gap-3 p-4" onClick={toggleTheme}><Sun />{isDarkMode ? 'Usar modo claro' : 'Usar modo oscuro'}</Button>
      <Button variant="secondary" className="gap-3" isLoading={logout.isPending} onClick={() => logout.mutate()}><LogOut />Cerrar sesión</Button>
    </div>
  </main>;
  const detail = view === 'documents' ? <AdvisorValidationView embedded /> : view === 'plan' ? <AdvisorSubscriptionView embedded /> : view === 'security'
    ? <div className="p-6 space-y-5"><p>Recibirás un enlace por correo para restablecer tu contraseña.</p><Button onClick={() => navigate('/login?view=recovery')}>Recuperar contraseña</Button></div>
    : me.isLoading ? <Skeleton className="h-64" /> : me.isError ? <p role="alert">No pudimos cargar tu cuenta.</p>
    : me.data ? <AccountEditor key={me.data.value.id} initial={me.data} /> : null;
  return <SplitViewLayout mainContent={main} sideContent={detail} sidePosition="right" isOpen={open} onClose={() => setOpen(false)} sideTitle={items.find(item => item.key === view)?.title ?? 'Mi cuenta'} />;
}
