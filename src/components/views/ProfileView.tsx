import { useState } from 'react';
import { useGetMe, useUpdateMe } from '../../integrations/backend/hooks/useAuth';
import type { Versioned } from '../../integrations/backend/auth.service';
import type { Cuenta } from '../../integrations/backend/types';
import { problemFromError } from '../../integrations/backend/axios.config';
import { Button } from '../atoms/Button';
import { Skeleton } from '../atoms/Skeleton';

export function ProfileView() {
  const me = useGetMe();
  return <main className="mx-auto max-w-3xl px-6 pt-28 pb-32 text-inmo-secondary dark:text-white">
    <h1 className="font-montserrat text-3xl font-bold">Mi perfil</h1>
    {me.isLoading && <Skeleton className="mt-6 h-48" />}
    {me.isError && <p role="alert" className="mt-6">No pudimos cargar tu cuenta. Intenta de nuevo.</p>}
    {me.data && <ProfileForm key={`${me.data.value.id}-${me.data.value.version}`} account={me.data} />}
  </main>;
}

function ProfileForm({ account }: { account: Versioned<Cuenta> }) {
  const update = useUpdateMe();
  const [name, setName] = useState(account.value.nombre);
  const [phone, setPhone] = useState(account.value.telefono ?? '');

  return <form className="mt-6 rounded-card bg-white dark:bg-inmo-darkcard p-6 shadow-soft space-y-4 font-inter text-sm"
      onSubmit={(event) => {
        event.preventDefault();
        update.mutate({ payload: { nombre: name.trim(), telefono: phone.trim() || null }, etag: account.etag });
      }}>
      <p>Correo: {account.value.correo}</p>
      <p>Rol: {account.value.rol} · Estado: {account.value.estado}</p>
      <label className="block">Nombre
        <input className="mt-1 w-full rounded-xl border border-gray-300 bg-transparent p-3" value={name} onChange={(event) => setName(event.target.value)} minLength={1} maxLength={160} required />
      </label>
      <label className="block">Teléfono
        <input className="mt-1 w-full rounded-xl border border-gray-300 bg-transparent p-3" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={32} />
      </label>
      <Button type="submit" isLoading={update.isPending} disabled={update.isPending || !name.trim()} className="px-5 py-3">Guardar cambios</Button>
      {update.isSuccess && <p role="status" className="text-inmo-success">Perfil actualizado.</p>}
      {update.isError && <p role="alert" className="text-inmo-danger">{problemFromError(update.error)?.detail ?? 'No pudimos guardar los cambios. Actualiza la página e intenta de nuevo.'}</p>}
    </form>;
}
