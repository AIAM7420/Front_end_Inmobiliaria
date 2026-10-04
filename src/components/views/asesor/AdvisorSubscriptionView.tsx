import { useRef, useState } from 'react';
import { ArrowRight, Building2, CheckCircle2, ChevronDown, CreditCard, ExternalLink, HelpCircle, Shield, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useGetOwnApplication } from '../../../integrations/backend/hooks/useAdvisors';
import { useCreatePayment, useCreatePortalSession, useGetPlans, useGetSubscription, useSelectPlan } from '../../../integrations/backend/hooks/useSubscriptions';
import { getHelp } from '../../../integrations/backend/operations.service';
import type { Plan } from '../../../integrations/backend/subscriptions.service';
import { isVersionConflict, operationError } from '../../../integrations/backend/versioning';
import { Button } from '../../atoms/Button';
import { Skeleton } from '../../atoms/Skeleton';
import { ConflictNotice } from '../../molecules/ConflictNotice';

type Step = 'overview' | 'plans' | 'checkout-confirmation';

export function AdvisorSubscriptionView({ embedded = false }: { embedded?: boolean }) {
  const application = useGetOwnApplication(), subscription = useGetSubscription(), plans = useGetPlans();
  const select = useSelectPlan(), payment = useCreatePayment(), portal = useCreatePortalSession();
  const help = useQuery({ queryKey: ['help'], queryFn: getHelp });
  const [step, setStep] = useState<Step>('overview'), [chosen, setChosen] = useState<Plan | null>(null);
  const [notice, setNotice] = useState(''), [navigationError, setNavigationError] = useState(''), [conflict, setConflict] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const requestIds = useRef<Record<string, string>>({});
  const current = subscription.data?.value;
  const active = plans.data?.find(plan => String(plan.id) === String(current?.version_plan_id));
  const scheduled = plans.data?.find(plan => String(plan.id) === String(current?.version_plan_siguiente_id));
  const used = current?.propiedades_en_cupo ?? 0, limit = current?.limite_propiedades ?? 0;
  const percent = limit > 0 ? Math.min(100, Math.round(used / limit * 100)) : 0;
  const error = select.error ?? payment.error ?? portal.error;
  const wrapper = (embedded ? '' : 'mx-auto w-full max-w-5xl pt-28 pb-32 ') + 'text-inmo-secondary dark:text-white font-inter';
  const content = 'flex flex-col gap-6 pb-8 animate-in fade-in zoom-in-95 duration-300 px-6 mt-8';

  async function navigate(url: string | null) {
    if (!url) throw new Error('El proveedor no entregó una URL.');
    const destination = new URL(url);
    if (destination.protocol !== 'https:') throw new Error('La URL del proveedor no es segura.');
    window.location.assign(destination.href);
  }
  async function confirm() {
    if (!chosen || !subscription.data || conflict) return;
    setNotice(''); setNavigationError('');
    try {
      await select.mutateAsync({ versionPlanId: chosen.id, etag: subscription.data.etag });
      if (current?.estado === 'ACTIVA') {
        setNotice('El cambio se aplicará en el siguiente ciclo, sin prorrateo.');
        setStep('overview');
      } else {
        requestIds.current[chosen.id] ??= crypto.randomUUID();
        const result = await payment.mutateAsync({ versionPlanId: chosen.id, requestId: requestIds.current[chosen.id] });
        await navigate(result.checkout_url);
      }
    } catch (cause) {
      if (isVersionConflict(cause)) setConflict(true);
      else if (!select.isError && !payment.isError) setNavigationError(operationError(cause));
    }
  }

  const feedback = <>
    {notice && <p role="status" className="text-sm text-inmo-success">{notice}</p>}
    {navigationError && <p role="alert" className="text-sm text-inmo-danger">{navigationError}</p>}
    {error && !conflict && <p role="alert" className="text-sm text-inmo-danger">{operationError(error)}</p>}
    {conflict && <ConflictNotice current={<p>Plan vigente: {active?.nombre ?? 'Ninguno'} · Siguiente ciclo: {scheduled?.nombre ?? 'Sin cambio'}</p>}
      onReview={async () => { const result = await subscription.refetch(); if (result.error) throw result.error; }}
      onAccept={() => { setConflict(false); select.reset(); }} />}
  </>;
  const loading = subscription.isPending || plans.isPending;
  const failure = subscription.error ?? plans.error;
  if (loading || failure) return <main className={wrapper}><div className={content}>
    <h3 className="font-montserrat font-bold text-xl">Suscripción</h3>
    {loading ? <Skeleton className="h-64 rounded-2xl" /> : <><p role="alert">{operationError(failure)}</p><Button variant="secondary" onClick={() => { void subscription.refetch(); void plans.refetch(); }}>Reintentar</Button></>}
  </div></main>;

  if (step === 'checkout-confirmation' && chosen) return <main className={wrapper}><div className={content}>
    <div><button type="button" onClick={() => setStep('plans')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-inmo-secondary dark:hover:text-white transition-colors mb-6"><ArrowRight className="w-4 h-4 rotate-180" />Volver a planes</button>
      <h3 className="font-montserrat font-bold text-xl mb-2">Completar Suscripción</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{current?.estado === 'ACTIVA' ? 'Revisa el plan del siguiente ciclo antes de guardar el cambio.' : 'Revisa tu orden antes de proceder al pago seguro.'}</p></div>
    <div className="bg-white dark:bg-inmo-darkcard rounded-2xl shadow-soft border border-gray-100 dark:border-white/5 overflow-hidden">
      <div className="flex items-center justify-between p-4"><div className="flex items-center gap-3"><CreditCard className="w-5 h-5 text-inmo-accent" /><div><p className="font-bold text-sm">Plan {chosen.nombre}</p><p className="text-xs text-gray-400">Cada {chosen.duracion_cantidad} {chosen.duracion_unidad.toLowerCase()}</p></div></div><span className="font-montserrat font-black text-lg">${Number(chosen.precio).toLocaleString('es-MX')}</span></div>
      <div className="h-px bg-gray-100 dark:bg-inmo-darktertiary" /><div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between"><span className="text-sm text-gray-500">Precio del plan</span><span>${Number(chosen.precio).toLocaleString('es-MX')} {chosen.moneda}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">Impuestos y total</span><span className="text-sm text-gray-400">Se confirman en Stripe</span></div></div>
      <div className="h-px bg-gray-100 dark:bg-inmo-darktertiary" /><div className="p-4 bg-gray-50 dark:bg-inmo-darkbg/50 flex justify-between items-center"><span className="font-bold text-xs text-gray-400 uppercase tracking-wider">Capacidad</span><span className="font-montserrat font-black text-2xl text-inmo-accent">{chosen.limite_propiedades} <span className="text-sm">propiedades</span></span></div>
    </div>
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-2"><div className="flex items-center gap-2 opacity-70 order-2 sm:order-1 self-start sm:self-center"><Shield className="w-4 h-4 text-gray-500" /><span className="text-xs text-gray-500 font-medium tracking-wide">PAGOS SEGUROS POR STRIPE</span></div>
      <Button variant="accent" className="w-full sm:w-auto justify-center !py-3 !px-8 order-1 sm:order-2" isLoading={select.isPending || payment.isPending} disabled={conflict} onClick={() => void confirm()} icon={<ExternalLink className="w-4 h-4" />}>{current?.estado === 'ACTIVA' ? 'Confirmar cambio de plan' : 'Proceder al pago'}</Button></div>
    <p className="text-xs text-gray-500">El regreso del navegador no confirma el pago: la vigencia cambia después de la confirmación del proveedor.</p>{feedback}
  </div></main>;

  if (step === 'plans') return <main className={wrapper}><div className="flex flex-col gap-8 w-full pb-24 px-6 md:px-8 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <button type="button" onClick={() => setStep('overview')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-inmo-secondary dark:hover:text-white transition-colors self-start"><ArrowRight className="w-4 h-4 rotate-180" />Mi plan actual</button>
    <div className="text-center mb-8"><h3 className="font-montserrat font-black text-2xl mb-2">Elige tu Plan</h3><p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">Elige la capacidad de publicación que necesitas.</p></div>
    <div className="flex flex-col md:flex-row gap-5 w-full max-w-4xl mx-auto items-stretch justify-center">{plans.data?.map(plan => {
      const isCurrent = String(plan.id) === String(current?.version_plan_id) && current?.estado === 'ACTIVA';
      return <section key={plan.id} className="flex flex-col bg-white dark:bg-inmo-darkcard rounded-3xl p-8 relative transition-all duration-300 w-full md:flex-1 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md">
        <h4 className="font-montserrat font-bold text-xl mb-4">{plan.nombre}</h4><div className="mb-2"><span className="font-montserrat font-black text-3xl">${Number(plan.precio).toLocaleString('es-MX')} {plan.moneda}</span></div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">Cada {plan.duracion_cantidad} {plan.duracion_unidad.toLowerCase()} · Hasta {plan.limite_propiedades} propiedades</p>
        <div className="flex flex-col gap-3 mb-8">{plan.beneficios.map(feature => <div key={feature} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-inmo-accent shrink-0 mt-0.5" /><span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span></div>)}</div>
        <div className="mt-auto"><Button variant={isCurrent ? 'secondary' : 'accent'} className="w-full justify-center !py-3.5 !rounded-full font-bold" disabled={isCurrent || conflict} onClick={() => { setChosen(plan); setStep('checkout-confirmation'); }}>{isCurrent ? 'Seleccionado' : 'Seleccionar plan'}</Button></div>
      </section>;
    })}</div>
    {!plans.data?.length && <p role="status" className="text-sm text-gray-500">No hay planes disponibles.</p>}
    <section className="mt-4"><div className="flex items-center gap-2.5 mb-5"><HelpCircle className="w-6 h-6 text-gray-400" /><h3 className="font-montserrat font-bold text-lg">Ayuda sobre suscripciones</h3></div>
      {help.isError && <p role="alert">{operationError(help.error)}</p>}
      <div className="flex flex-col gap-3">{help.data?.filter(article => article.id === 'pagos' || article.id === 'inventario').map(article => <div key={article.id} className={'bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-white/5 rounded-2xl p-4 transition-all duration-300 shadow-sm hover:shadow-md ' + (activeFaq === article.id ? 'ring-2 ring-inmo-accent/20 border-inmo-accent/30' : '')}>
        <button type="button" aria-expanded={activeFaq === article.id} className="flex w-full text-left justify-between items-center gap-4" onClick={() => setActiveFaq(activeFaq === article.id ? null : article.id)}><h4 className="font-bold text-sm">{article.titulo}</h4><ChevronDown className={'w-4 h-4 shrink-0 transition-transform duration-300 ' + (activeFaq === article.id ? 'rotate-180 text-inmo-accent' : 'text-gray-400')} /></button>
        {activeFaq === article.id && <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-3">{article.contenido}</p>}
      </div>)}</div></section>{feedback}
  </div></main>;

  return <main className={wrapper}><div className={content}>
    <div><h3 className="font-montserrat font-bold text-xl mb-2">Suscripción</h3><p className="text-sm text-gray-500 dark:text-gray-400">Gestiona tu plan actual y mejora tus límites.</p></div>
    <div className="bg-white dark:bg-inmo-darkcard rounded-2xl shadow-soft border border-gray-100 dark:border-white/5 overflow-hidden">
      <div className="flex items-center justify-between p-4"><div className="flex flex-col gap-1"><h4 className="font-bold text-lg flex flex-wrap items-center gap-2">{active?.nombre ?? 'Sin plan vigente'}<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-bold text-[10px] uppercase tracking-wider border border-gray-200 dark:border-white/10"><CheckCircle2 className="w-3 h-3" />{current?.estado.replaceAll('_', ' ')}</span></h4><p className="text-xs text-gray-400">{scheduled ? 'Próximo ciclo: ' + scheduled.nombre : 'Sin cambio de plan programado.'}</p></div>
        {active && <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-inmo-darkbg px-3 py-1 rounded-lg">{active.duracion_cantidad} {active.duracion_unidad.toLowerCase()}</span>}</div>
      <div className="h-px bg-gray-100 dark:bg-inmo-darktertiary" /><div className="flex items-center justify-between p-4"><div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500" /><div><p className="font-bold text-sm">Propiedades ({used}/{limit})</p><div role="progressbar" aria-label="Cupo de propiedades" aria-valuenow={used} aria-valuemin={0} aria-valuemax={limit || 1} className="w-32 h-1.5 bg-gray-100 dark:bg-inmo-darktertiary rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-inmo-accent rounded-full" style={{ width: percent + '%' }} /></div></div></div>
        <span className="text-xs font-bold text-inmo-accent">{current?.capacidad_disponible ?? 0} disponibles</span></div>
      {current?.periodo && <><div className="h-px bg-gray-100 dark:bg-inmo-darktertiary" /><div className="p-4 text-sm text-gray-500">Vigente hasta {new Date(current.periodo.fin_at).toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City' })} · Renovación {current.renovacion_automatica ? 'activada' : 'desactivada'}</div></>}
    </div>
    {current?.estado === 'ACTIVA' && <Button variant="secondary" isLoading={portal.isPending} icon={<ExternalLink className="w-4 h-4" />} onClick={async () => { setNavigationError(''); try { const result = await portal.mutateAsync(); await navigate(result.url); } catch (cause) { setNavigationError(operationError(cause)); } }}>Administrar en Stripe</Button>}
    {application.isError ? <p role="alert">No pudimos consultar tu autorización profesional.</p> : application.data?.value.estado !== 'APROBADA' && <p role="status" className="text-sm rounded-2xl bg-inmo-warning/10 p-4">La publicación requiere expediente aprobado y periodo pagado vigente.</p>}
    <div className="bg-inmo-accent rounded-2xl p-6 shadow-glow relative overflow-hidden flex flex-col gap-4"><div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" /><div className="relative z-10 flex items-center gap-4"><Sparkles className="w-8 h-8 text-white shrink-0" /><div><h3 className="font-montserrat font-bold text-base text-white mb-0.5">¿Necesitas más capacidad?</h3><p className="text-xs text-white/90 leading-relaxed">Consulta los planes para publicar más propiedades.</p></div></div>
      <Button variant="secondary" onClick={() => setStep('plans')} icon={<ArrowRight className="w-4 h-4" />} className="w-full sm:w-1/2 self-center justify-center !py-2.5 text-sm">Ver Planes y Precios</Button></div>{feedback}
  </div></main>;
}
