import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, Camera, Shield, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { getMe, updateMe, type Versioned } from '../../integrations/backend/auth.service';
import type { Cuenta } from '../../integrations/backend/types';
import { api } from '../../integrations/backend/axios.config';
import { uploadMedia, setAvatar } from '../../integrations/backend/media.service';
import { getProfessionalProfile, updateProfessionalProfile, type PerfilProfesional } from '../../integrations/backend/engagement.service';
import { getPreferences, savePreferences, changePassword, closeAccount, type Preferencias } from '../../integrations/backend/operations.service';
import { isVersionConflict, operationError } from '../../integrations/backend/versioning';
import { ConflictNotice } from '../molecules/ConflictNotice';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Textarea } from '../atoms/Textarea';

const panel = 'px-6 py-8 space-y-6 font-inter text-sm';
const card = 'bg-white dark:bg-inmo-darkcard rounded-2xl shadow-soft border border-gray-100 dark:border-white/5 p-4 space-y-4';

export function ProfileAccountPanel({ initial }: { initial: Versioned<Cuenta> }) {
  const cache = useQueryClient(), { role } = useAppContext();
  const [snapshot, setSnapshot] = useState(initial), [name, setName] = useState(initial.value.nombre), [phone, setPhone] = useState(initial.value.telefono ?? '');
  const [conflict, setConflict] = useState(false), [uploadedId, setUploadedId] = useState<string | null>(null);
  const avatar = useQuery({ queryKey: ['account', 'avatar'], queryFn: async () => (await api.get<{ url: string } | null>('/me/fotografia/url')).data, staleTime: 120_000 });
  const save = useMutation({ mutationFn: async () => { const result = await updateMe({ nombre: name.trim(), telefono: phone.trim() || null }, snapshot.etag); setSnapshot(result); cache.setQueryData(['auth', 'me'], result); } });
  const photo = useMutation({ mutationFn: async (file?: File) => {
    let id = uploadedId;
    if (file) { if (!['image/jpeg', 'image/webp'].includes(file.type)) throw new Error('La fotografía debe ser JPEG o WebP de hasta 5 MB.'); id = (await uploadMedia(file)).id; setUploadedId(id); }
    if (!id) throw new Error('Selecciona una fotografía.');
    await setAvatar(id, snapshot.etag);
    const updated = await getMe(); setSnapshot(updated); cache.setQueryData(['auth', 'me'], updated); setUploadedId(null); await cache.invalidateQueries({ queryKey: ['account', 'avatar'] }); await cache.invalidateQueries({ queryKey: ['advisor', 'public'] });
  } });
  const busy = save.isPending || photo.isPending;
  const handle = async (action: () => Promise<unknown>) => { try { await action(); } catch (error) { if (isVersionConflict(error)) setConflict(true); } };
  return <div className={panel}><form className="space-y-6" onSubmit={event => { event.preventDefault(); if (!conflict) void handle(() => save.mutateAsync()); }}>
    <div className="flex flex-col items-center gap-4"><div className="w-28 h-28 rounded-full bg-gray-300 dark:bg-inmo-darktertiary flex items-center justify-center border-4 border-gray-50 dark:border-inmo-darkbg shadow-sm overflow-hidden">{avatar.data?.url ? <img src={avatar.data.url} alt="Mi fotografía" className="w-full h-full object-cover" /> : <User className="w-14 h-14 text-white" strokeWidth={1.5} />}</div>
      <label className="rounded-full px-5 py-3 bg-white dark:bg-inmo-darkcard shadow-soft text-inmo-accent font-bold cursor-pointer flex gap-2 items-center"><Camera className="w-4 h-4" />{photo.isPending ? 'Cargando…' : 'Cambiar fotografía'}<input aria-label="Cambiar fotografía" type="file" accept="image/jpeg,image/webp" className="sr-only" disabled={busy || conflict} onChange={event => { const file = event.target.files?.[0]; if (file) void handle(() => photo.mutateAsync(file)); event.target.value = ''; }} /></label>
      {avatar.isError && <p role="alert">No pudimos consultar tu fotografía.</p>}
    </div>
    <div className={card}><label className="block space-y-2"><span className="text-xs font-bold text-gray-400 uppercase">Nombre completo</span><Input value={name} onChange={event => setName(event.target.value)} required maxLength={160} wrapperClassName="!bg-gray-50 dark:!bg-inmo-darkbg !shadow-none" /></label><label className="block space-y-2"><span className="text-xs font-bold text-gray-400 uppercase">Teléfono</span><Input value={phone} onChange={event => setPhone(event.target.value)} maxLength={32} wrapperClassName="!bg-gray-50 dark:!bg-inmo-darkbg !shadow-none" /></label><label className="block space-y-2"><span className="text-xs font-bold text-gray-400 uppercase">Correo electrónico</span><Input readOnly value={snapshot.value.correo} wrapperClassName="!bg-gray-50 dark:!bg-inmo-darkbg !shadow-none" /></label></div>
    {conflict && <ConflictNotice current={<p>Versión consultada: {snapshot.value.nombre} · {snapshot.value.telefono ?? 'Sin teléfono'}</p>} onReview={async () => { const current = await getMe(); setSnapshot(current); cache.setQueryData(['auth', 'me'], current); }} onAccept={() => { setConflict(false); save.reset(); photo.reset(); }} />}
    {uploadedId && !conflict && <Button type="button" variant="secondary" disabled={busy} onClick={() => void handle(() => photo.mutateAsync(undefined))}>Guardar la fotografía cargada</Button>}
    <Button type="submit" className="w-full sm:w-1/3 mx-auto" disabled={busy || conflict || !name.trim()} isLoading={save.isPending}>Guardar cambios</Button>
    {save.isSuccess && <p role="status" className="text-inmo-success">Perfil actualizado.</p>}{photo.isSuccess && <p role="status" className="text-inmo-success">Fotografía actualizada.</p>}
    {(save.isError || photo.isError) && !conflict && <p role="alert">{operationError(save.error ?? photo.error)}</p>}
  </form>{role === 'asesor' && <ProfessionalProfilePanel />}</div>;
}

function ProfessionalProfilePanel() {
  const query = useQuery({ queryKey: ['advisor', 'professional'], queryFn: getProfessionalProfile });
  return query.isPending ? <p role="status">Cargando perfil profesional…</p> : query.isError ? <p role="alert">{operationError(query.error)}</p> : <ProfessionalEditor initial={query.data} />;
}
function ProfessionalEditor({ initial }: { initial: PerfilProfesional }) {
  const cache = useQueryClient(), [snapshot, setSnapshot] = useState(initial), [name, setName] = useState(initial.nombre_comercial ?? ''), [description, setDescription] = useState(initial.descripcion ?? ''), [phone, setPhone] = useState(initial.telefono_profesional ?? ''), [conflict, setConflict] = useState(false);
  const save = useMutation({ mutationFn: () => updateProfessionalProfile({ nombre_comercial: name.trim(), descripcion: description.trim() || null, telefono_profesional: phone.trim() || null }, snapshot.version), onSuccess: value => { setSnapshot(value); cache.setQueryData(['advisor', 'professional'], value); void cache.invalidateQueries({ queryKey: ['advisor', 'public'] }); } });
  return <form className={card} onSubmit={async event => { event.preventDefault(); if (conflict) return; try { await save.mutateAsync(); } catch (error) { if (isVersionConflict(error)) setConflict(true); } }}><h3 className="font-montserrat font-bold text-xl">Perfil público profesional</h3><label className="block space-y-2">Nombre comercial<Input value={name} onChange={event => setName(event.target.value)} maxLength={160} /></label><label className="block space-y-2">Descripción<Textarea value={description} onChange={event => setDescription(event.target.value)} maxLength={4000} /></label><label className="block space-y-2">Teléfono profesional<Input value={phone} onChange={event => setPhone(event.target.value)} maxLength={32} /></label>
    {conflict && <ConflictNotice current={<p>Perfil vigente: {snapshot.nombre_comercial} · {snapshot.descripcion}</p>} onReview={async () => setSnapshot(await getProfessionalProfile())} onAccept={() => { setConflict(false); save.reset(); }} />}
    <Button type="submit" disabled={conflict || !name.trim()} isLoading={save.isPending}>Guardar perfil público</Button>{save.isSuccess && <p role="status">Perfil profesional actualizado.</p>}{save.isError && !conflict && <p role="alert">{operationError(save.error)}</p>}
  </form>;
}

export function PreferencesPanel() {
  const query = useQuery({ queryKey: ['account', 'preferences'], queryFn: getPreferences });
  return query.isPending ? <p className={panel}>Cargando preferencias…</p> : query.isError ? <p className={panel} role="alert">{operationError(query.error)}</p> : <PreferencesEditor initial={query.data} />;
}
function PreferencesEditor({ initial }: { initial: Preferencias }) {
  const cache = useQueryClient(), { applyTheme } = useAppContext();
  const [snapshot, setSnapshot] = useState(initial), [theme, setTheme] = useState(initial.tema), [email, setEmail] = useState(initial.alertas_correo), [conflict, setConflict] = useState(false);
  const save = useMutation({ mutationFn: () => savePreferences({ tema: theme, alertas_correo: email }, snapshot.version), onSuccess: value => { setSnapshot(value); applyTheme(value.tema); cache.setQueryData(['account', 'preferences'], value); } });
  return <form className={panel} onSubmit={async event => { event.preventDefault(); if (conflict) return; try { await save.mutateAsync(); } catch (error) { if (isVersionConflict(error)) setConflict(true); } }}><h3 className="font-montserrat font-bold text-xl">General</h3><label className="block space-y-2">Apariencia<Select value={theme} onChange={event => setTheme(event.target.value as Preferencias['tema'])}><option value="CLARO">Claro</option><option value="OSCURO">Oscuro</option><option value="SISTEMA">Usar apariencia del dispositivo</option></Select></label><label className="flex items-center gap-3 p-4 bg-white dark:bg-inmo-darkcard rounded-2xl shadow-soft"><input type="checkbox" checked={email} onChange={event => setEmail(event.target.checked)} className="accent-inmo-accent" />Alertas de actividad por correo</label><p className="text-gray-500">Español · Hora de Ciudad de México. Los correos de acceso y seguridad se mantienen disponibles.</p>
    {conflict && <ConflictNotice current={<p>Preferencias vigentes: {snapshot.tema} · Correo {snapshot.alertas_correo ? 'activado' : 'desactivado'}</p>} onReview={async () => setSnapshot(await getPreferences())} onAccept={() => { setConflict(false); save.reset(); }} />}
    <Button type="submit" disabled={conflict} isLoading={save.isPending}>Guardar preferencias</Button>{save.isSuccess && <p role="status">Preferencias guardadas.</p>}{save.isError && !conflict && <p role="alert">{operationError(save.error)}</p>}
  </form>;
}

export function SecurityPanel({ initial, permanent = false }: { initial: Versioned<Cuenta>; permanent?: boolean }) {
  const { logout } = useAppContext(), navigate = useNavigate(), cache = useQueryClient();
  const [snapshot, setSnapshot] = useState(initial), [current, setCurrent] = useState(''), [replacement, setReplacement] = useState(''), [confirmation, setConfirmation] = useState(''), [conflict, setConflict] = useState(false);
  const alive = useRef(true); useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const mutation = useMutation({ mutationFn: async () => { if (permanent) await closeAccount(current, confirmation, snapshot.etag); else await changePassword(current, replacement, snapshot.etag); }, onSuccess: () => { logout(); navigate('/login', { replace: true, state: { message: permanent ? 'Tu cuenta fue dada de baja.' : 'Contraseña actualizada. Inicia sesión nuevamente.' } }); } });
  return <form className={panel} onSubmit={async event => { event.preventDefault(); if (conflict) return; try { await mutation.mutateAsync(); } catch (error) { if (alive.current && isVersionConflict(error)) setConflict(true); } }}><h3 className="font-montserrat font-bold text-xl flex gap-2 items-center">{permanent ? <Trash2 /> : <Shield />}{permanent ? 'Baja permanente' : 'Cambiar contraseña'}</h3>
    <p className="text-gray-500">{permanent ? 'Se bloqueará el acceso, se retirarán tus publicaciones y fotografías y se desactivará la renovación. Se conservarán conversaciones, pagos, reportes y auditoría. La baja no se puede revertir desde administración.' : 'Comprueba tu contraseña actual. Este cambio cerrará todas tus sesiones abiertas.'}</p>
    <Input aria-label="Contraseña actual" type="password" autoComplete="current-password" value={current} onChange={event => setCurrent(event.target.value)} placeholder="Contraseña actual" required maxLength={128} />
    {permanent ? <Input aria-label="Confirmación de baja" value={confirmation} onChange={event => setConfirmation(event.target.value)} placeholder="Escribe ELIMINAR MI CUENTA" required /> : <Input aria-label="Nueva contraseña" type="password" autoComplete="new-password" value={replacement} onChange={event => setReplacement(event.target.value)} placeholder="Nueva contraseña" required minLength={8} maxLength={128} />}
    {!permanent && <p className="text-xs text-gray-500">Usa mayúscula, minúscula, número y símbolo; de 8 a 128 caracteres.</p>}
    {conflict && <ConflictNotice current={<p>Cuenta vigente: {snapshot.value.nombre} · versión {snapshot.value.version}</p>} onReview={async () => { const value = await getMe(); setSnapshot(value); cache.setQueryData(['auth', 'me'], value); }} onAccept={() => { setConflict(false); mutation.reset(); }} />}
    <Button type="submit" disabled={conflict || !current || (permanent && confirmation !== 'ELIMINAR MI CUENTA')} isLoading={mutation.isPending}>{permanent ? 'Confirmar baja permanente' : 'Cambiar contraseña'}</Button>
    {mutation.isError && !conflict && <p role="alert">{operationError(mutation.error)}</p>}
  </form>;
}
