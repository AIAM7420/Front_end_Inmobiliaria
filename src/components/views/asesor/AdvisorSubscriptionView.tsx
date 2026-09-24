import { useRef, useState } from 'react';
import { useGetOwnApplication } from '../../../integrations/backend/hooks/useAdvisors';
import { useCreatePayment, useCreatePortalSession, useGetPlans, useGetSubscription, useSelectPlan } from '../../../integrations/backend/hooks/useSubscriptions';
import { problemFromError } from '../../../integrations/backend/axios.config';
import { Button } from '../../atoms/Button';
import { Skeleton } from '../../atoms/Skeleton';

export function AdvisorSubscriptionView() {
  const application = useGetOwnApplication();
  const subscription = useGetSubscription();
  const plans = useGetPlans();
  const select = useSelectPlan();
  const payment = useCreatePayment();
  const portal = useCreatePortalSession();
  const requestIds = useRef<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const [navigationError, setNavigationError] = useState('');
  const current = subscription.data?.value;
  const selected = current?.version_plan_siguiente_id ?? current?.version_plan_id;
  const error = select.error ?? payment.error ?? portal.error;

  async function pay(planId: string) {
    setNotice('');
    setNavigationError('');
    requestIds.current[planId] ??= crypto.randomUUID();
    try {
      const result = await payment.mutateAsync({ versionPlanId: planId, requestId: requestIds.current[planId] });
      if (!result.checkout_url) throw new Error('Stripe no entregó una URL de Checkout.');
      const destination = new URL(result.checkout_url);
      if (destination.protocol !== 'https:') throw new Error('La URL de Checkout no es segura.');
      window.location.assign(destination.href);
    } catch (cause) {
      // Keep the same request ID for a safe retry.
      if (cause instanceof Error && !payment.isError) setNavigationError(cause.message);
    }
  }

  return <main className="mx-auto w-full max-w-5xl px-4 md:px-6 pt-28 pb-32 text-inmo-secondary dark:text-white">
    <h1 className="font-montserrat text-3xl font-bold">Suscripción</h1>
    <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mt-2">La habilitación profesional requiere solicitud aprobada y periodo pagado vigente.</p>
    {subscription.isLoading ? <Skeleton className="h-32 mt-7" /> : subscription.isError
      ? <p role="alert" className="mt-7 rounded-card bg-white dark:bg-inmo-darkcard p-6 font-inter text-sm">No pudimos cargar tu suscripción.</p>
      : <section className="mt-7 rounded-card bg-white dark:bg-inmo-darkcard p-6 shadow-soft font-inter text-sm">
        <p className="font-montserrat text-xl font-bold">Estado: {current?.estado.replaceAll('_', ' ')}</p>
        <p className="mt-2">Plan vigente: {current?.version_plan_id ?? 'Ninguno'} · Siguiente ciclo: {current?.version_plan_siguiente_id ?? 'Sin cambio'}</p>
        <p className="mt-1">Cupo disponible: {current?.capacidad_disponible ?? 0} de {current?.limite_propiedades ?? 0}</p>
        {current?.periodo && <p className="mt-1">Vigente hasta {new Date(current.periodo.fin_at).toLocaleDateString('es-MX')}</p>}
        {current?.estado === 'ACTIVA' && <Button variant="secondary" className="mt-4 px-4 py-2"
          isLoading={portal.isPending} onClick={async () => {
            setNavigationError('');
            try {
              const result = await portal.mutateAsync();
              const url = new URL(result.url);
              if (url.protocol !== 'https:') throw new Error('La URL del portal no es segura.');
              window.location.assign(url.href);
            } catch (cause) {
              if (cause instanceof Error && !portal.isError) setNavigationError(cause.message);
            }
          }}>Administrar en Stripe</Button>}
      </section>}
    {application.data?.value.estado !== 'APROBADA' && <p role="status" className="font-inter text-sm mt-5 rounded-2xl bg-inmo-warning/10 p-4">
      Tu solicitud profesional todavía no está aprobada. Puedes explorar planes, pero no publicar propiedades hasta completar también la validación.
    </p>}
    <h2 className="font-montserrat text-xl font-bold mt-8 mb-4">Planes disponibles</h2>
    {plans.isLoading ? <div className="grid md:grid-cols-3 gap-4"><Skeleton className="h-52" /><Skeleton className="h-52" /><Skeleton className="h-52" /></div>
      : plans.isError ? <p role="alert" className="font-inter text-sm">No pudimos cargar los planes.</p>
        : <div className="grid md:grid-cols-3 gap-4">{plans.data?.map((plan) => <section key={plan.id} className="rounded-card bg-white dark:bg-inmo-darkcard p-6 shadow-soft">
          <h3 className="font-montserrat font-bold text-lg">{plan.nombre}</h3>
          <p className="font-inter text-2xl font-bold mt-3">${Number(plan.precio).toLocaleString('es-MX')} {plan.moneda}</p>
          <p className="font-inter text-sm text-gray-500">Cada {plan.duracion_cantidad} {plan.duracion_unidad.toLowerCase()} · Hasta {plan.limite_propiedades} propiedades</p>
          <ul className="font-inter text-sm mt-4 space-y-1">{plan.beneficios.map((benefit) => <li key={benefit}>• {benefit}</li>)}</ul>
          <Button className="mt-5 w-full py-3" variant={selected === plan.id ? 'secondary' : 'accent'}
            disabled={!subscription.data || select.isPending} onClick={async () => {
              if (!subscription.data) return;
              try { await select.mutateAsync({ versionPlanId: plan.id, etag: subscription.data.etag }); setNotice('Plan seleccionado.'); }
              catch { /* shown below */ }
            }}>{selected === plan.id ? 'Seleccionado' : 'Seleccionar plan'}</Button>
          {selected === plan.id && current?.estado !== 'ACTIVA' && <Button variant="secondary" className="mt-3 w-full py-3"
            isLoading={payment.isPending} onClick={() => { void pay(plan.id); }}>Ir a Checkout</Button>}
        </section>)}</div>}
    {current?.estado === 'ACTIVA' && <p className="font-inter text-xs text-gray-500 mt-4">Un cambio de plan se programa para el siguiente ciclo, sin prorrateo.</p>}
    <p className="font-inter text-xs text-gray-500 mt-2">El retorno del navegador no confirma el pago: espera la conciliación del webhook y actualiza esta página.</p>
    {notice && <p role="status" className="font-inter text-sm text-inmo-success mt-4">{notice}</p>}
    {navigationError && <p role="alert" className="font-inter text-sm text-inmo-danger mt-4">{navigationError}</p>}
    {error && <p role="alert" className="font-inter text-sm text-inmo-danger mt-4">{problemFromError(error)?.detail ?? (error instanceof Error ? error.message : 'La operación no pudo completarse.')}</p>}
  </main>;
}
