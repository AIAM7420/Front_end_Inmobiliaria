import { Link, useLocation } from 'react-router-dom';
import { useGetSubscription } from '../../../integrations/backend/hooks/useSubscriptions';
import { Button } from '../../atoms/Button';
import { Skeleton } from '../../atoms/Skeleton';

export function PaymentReturnView() {
  const success = useLocation().pathname.endsWith('/exito');
  const subscription = useGetSubscription();

  return <main className="min-h-screen bg-white dark:bg-inmo-darkbg px-6 py-28 text-inmo-secondary dark:text-white">
    <section className="mx-auto max-w-xl rounded-card bg-gray-50 dark:bg-inmo-darkcard p-8 shadow-soft">
      <h1 className="font-montserrat text-2xl font-bold">{success ? 'Checkout completado' : 'Checkout cancelado'}</h1>
      <p className="mt-3 font-inter text-sm text-gray-600 dark:text-gray-300">
        {success
          ? 'El regreso de Stripe no confirma el pago. Tu periodo se activará sólo cuando el webhook haya sido conciliado.'
          : 'No se activó ningún periodo por regresar de Checkout. Puedes volver a intentar el pago.'}
      </p>
      {subscription.isLoading && <Skeleton className="mt-5 h-14" />}
      {subscription.isError && <p role="alert" className="mt-5 text-sm text-inmo-danger">No pudimos comprobar el estado actual. Vuelve a consultar tu suscripción.</p>}
      {subscription.data && <p role="status" className="mt-5 font-inter text-sm">Estado actual de la suscripción: {subscription.data.value.estado}</p>}
      <Link to="/asesor/suscripcion"><Button className="mt-6 px-5 py-3">Ver suscripción</Button></Link>
    </section>
  </main>;
}
