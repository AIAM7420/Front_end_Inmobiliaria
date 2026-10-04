import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../atoms/Button';
import { AuthHeader } from '../../molecules/AuthHeader';
import { useConfirmEmail } from '../../../integrations/backend/hooks/useAuth';

export function ConfirmEmailView() {
  const [token] = useState(() => new URLSearchParams(window.location.search).get('token'));
  const confirmation = useConfirmEmail();

  useEffect(() => {
    window.history.replaceState(window.history.state, '', window.location.pathname);
  }, []);

  return (
    <main className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center justify-center px-6 py-10">
      <AuthHeader title="Confirma tu correo" subtitle="Termina la activación de tu cuenta antes de iniciar sesión." />
      <div className="w-full max-w-sm flex flex-col gap-5 text-center">
        {!token && <p role="alert" className="text-inmo-danger">El enlace no contiene un token válido. Solicita uno nuevo.</p>}
        {token && !confirmation.isSuccess && (
          <Button type="button" variant="accent" disabled={confirmation.isPending} isLoading={confirmation.isPending} onClick={() => confirmation.mutate(token)}>
            Confirmar correo
          </Button>
        )}
        {confirmation.isSuccess && <p role="status" className="text-gray-700 dark:text-gray-200">Correo confirmado. Ya puedes iniciar sesión.</p>}
        {confirmation.isError && <p role="alert" className="text-inmo-danger">El enlace venció o ya fue utilizado. Solicita uno nuevo.</p>}
        <Link className="text-inmo-accent underline" to="/login">Ir al inicio de sesión</Link>
      </div>
    </main>
  );
}
