import React, { useState } from 'react';
import { CheckCircle2, CreditCard, HelpCircle, ChevronDown, X, Sparkles, Building2, Users, ExternalLink, ArrowRight, Shield, Zap, Crown } from 'lucide-react';
import { Button } from '../../atoms/Button';

type SubscriptionStep = 'overview' | 'plans' | 'checkout-confirmation';

interface PlanData {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  recommended?: boolean;
  features: string[];
  notIncluded: string[];
  stripePriceIdMonthly: string | null;
  stripePriceIdAnnual: string | null;
}

export const AsesorSubscription: React.FC = () => {
  const [step, setStep] = useState<SubscriptionStep>('overview');
  const [billingCycle, setBillingCycle] = useState<'mensual' | 'anual'>('mensual');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // ─── Stripe Integration Handlers ───────────────────────────────
  const handleStripePortal = () => {
    // Redirect to Stripe Customer Portal for billing management
    // fetch('/api/stripe/portal', { method: 'POST' }).then(res => res.json()).then(data => window.location.href = data.url);
    console.log("Redirecting to Stripe Customer Portal...");
  };

  const handleCheckout = (plan: PlanData) => {
    const priceId = billingCycle === 'mensual' ? plan.stripePriceIdMonthly : plan.stripePriceIdAnnual;
    if (!priceId) return;
    
    setSelectedPlan(plan);
    setStep('checkout-confirmation');
  };

  const confirmCheckout = () => {
    if (!selectedPlan) return;
    const priceId = billingCycle === 'mensual' ? selectedPlan.stripePriceIdMonthly : selectedPlan.stripePriceIdAnnual;
    
    setIsRedirecting(true);
    // In production:
    // fetch('/api/stripe/checkout', { method: 'POST', body: JSON.stringify({ priceId }) })
    //   .then(res => res.json())
    //   .then(data => window.location.href = data.url);
    console.log(`Redirecting to Stripe Checkout for: ${priceId}`);
    
    setTimeout(() => setIsRedirecting(false), 2000); // Simulated
  };

  // ─── Mock Data ───────────────────────────────────────────────────
  // Current plan state (would come from API/context in production)
  const currentPlan = 'basic';
  const usage = {
    properties: { used: 4, limit: 10 },
    leads: { used: 8, limit: 50 },
    renewalDate: '1 de octubre, 2026'
  };

  const plans: PlanData[] = [
    {
      id: 'basic',
      name: 'Basic',
      icon: <Shield className="w-5 h-5" />,
      description: 'Cada 1 mes · Hasta 10 propiedades',
      monthlyPrice: '500',
      annualPrice: '500',
      features: [],
      notIncluded: [],
      stripePriceIdMonthly: 'price_monthly_basic',
      stripePriceIdAnnual: null,
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <Zap className="w-5 h-5" />,
      description: 'Cada 1 mes · Hasta 15 propiedades',
      monthlyPrice: '800',
      annualPrice: '800',
      features: [],
      notIncluded: [],
      stripePriceIdMonthly: 'price_monthly_pro',
      stripePriceIdAnnual: null,
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: <Crown className="w-5 h-5" />,
      description: 'Cada 1 mes · Hasta 20 propiedades',
      monthlyPrice: '1,000',
      annualPrice: '1,000',
      features: [],
      notIncluded: [],
      stripePriceIdMonthly: 'price_monthly_premium',
      stripePriceIdAnnual: null,
    }
  ];

  const faqs = [
    { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí. Puedes cancelar o cambiar de plan desde tu portal de facturación. Los cambios aplican al final del ciclo actual.' },
    { q: '¿Cómo funciona el pago anual?', a: 'Se cobra el equivalente a 12 meses con un 20% de descuento. Tienes acceso ininterrumpido durante todo el año.' },
    { q: '¿Mis datos de pago están seguros?', a: 'Totalmente. Los pagos son procesados por Stripe, una de las pasarelas más seguras del mundo. Nosotros nunca almacenamos tu información bancaria.' },
    { q: '¿Qué pasa si alcanzo mi límite?', a: 'Te notificaremos cuando estés cerca. Una vez alcanzado, no podrás publicar nuevas propiedades ni contactar nuevos leads hasta renovar o subir de plan.' }
  ];

  const propertiesPercent = Math.round((usage.properties.used / usage.properties.limit) * 100);
  const leadsPercent = Math.round((usage.leads.used / usage.leads.limit) * 100);

  // ─── STEP: Checkout Confirmation ───────────────────────────────
  if (step === 'checkout-confirmation' && selectedPlan) {
    const price = selectedPlan.monthlyPrice;
    return (
      <div className="h-full overflow-y-auto flex flex-col items-center py-12 px-6 md:px-8 animate-in fade-in zoom-in-95 duration-500 w-full">
        
        {/* Security badge / Lock */}
        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-green-500" />
        </div>

        <h2 className="font-montserrat font-black text-2xl text-inmo-secondary dark:text-white mb-2 text-center">
          Completar Suscripción
        </h2>
        <p className="font-inter text-sm text-gray-500 dark:text-gray-400 text-center mb-8 max-w-md">
          Estás a un paso de actualizar tu plan. Serás redirigido a la pasarela segura de Stripe para procesar tu pago.
        </p>

        {/* Receipt Card */}
        <div className="bg-white dark:bg-inmo-darkcard rounded-3xl p-6 md:p-8 shadow-soft border border-gray-100 dark:border-white/5 w-full max-w-md mb-8">
          <h3 className="font-inter font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Resumen de Orden</h3>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-bold text-inmo-secondary dark:text-white text-lg">Plan {selectedPlan.name}</p>
              <p className="text-sm text-gray-500">Facturación cada 1 mes</p>
            </div>
            <span className="font-montserrat font-black text-xl text-inmo-secondary dark:text-white">
              ${price}
            </span>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-white/5 my-4" />

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="font-medium text-inmo-secondary dark:text-white">${price} MXN</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500">Impuestos</span>
            <span className="text-sm text-gray-400">Calculado en checkout</span>
          </div>

          <div className="bg-gray-50 dark:bg-inmo-darkbg rounded-xl p-4 flex justify-between items-center">
            <span className="font-bold text-inmo-secondary dark:text-white">Total a pagar</span>
            <span className="font-montserrat font-black text-2xl text-inmo-accent">
              ${price} <span className="text-sm font-bold">MXN</span>
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="w-full max-w-md flex flex-col gap-4">
          <Button 
            variant="accent"
            className="w-full justify-center !py-4 text-base !rounded-xl font-bold"
            onClick={confirmCheckout}
            isLoading={isRedirecting}
            icon={!isRedirecting ? <ExternalLink className="w-5 h-5" /> : undefined}
          >
            {isRedirecting ? 'Conectando con Stripe...' : 'Pagar de forma segura'}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-center text-gray-500"
            onClick={() => setStep('plans')}
            disabled={isRedirecting}
          >
            Cancelar y volver a planes
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center gap-2 opacity-50">
          <Shield className="w-4 h-4 text-gray-500" />
          <span className="font-inter text-xs text-gray-500 font-medium tracking-wide">PAGOS SEGUROS ENCRIPTADOS POR STRIPE</span>
        </div>
      </div>
    );
  }

  // ─── STEP: Plans Selection ─────────────────────────────────────
  if (step === 'plans') {
    return (
      <div className="h-full overflow-y-auto flex flex-col gap-8 w-full pb-24 px-6 md:px-8 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Back */}
        <button onClick={() => setStep('overview')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-inmo-secondary dark:hover:text-white transition-colors self-start">
          <ArrowRight className="w-4 h-4 rotate-180" /> Mi plan actual
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="font-montserrat font-black text-2xl text-inmo-secondary dark:text-white mb-2">
            Elige tu Plan
          </h3>
          <p className="font-inter text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Sube de nivel para publicar más propiedades y cerrar más tratos.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="flex flex-col md:flex-row gap-5 w-full max-w-4xl mx-auto items-stretch justify-center">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan;
            const price = plan.monthlyPrice;
            
            return (
              <div 
                key={plan.id}
                className={`flex flex-col bg-white dark:bg-inmo-darkcard rounded-3xl p-8 relative transition-all duration-300 w-full md:w-1/3 ${
                  isCurrentPlan
                  ? 'border border-gray-100 dark:border-white/5 shadow-sm'
                  : 'border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Plan Header */}
                <h4 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white mb-4">{plan.name}</h4>
                
                {/* Price */}
                <div className="mb-2">
                  <span className="font-montserrat font-black text-3xl text-inmo-secondary dark:text-white">
                    ${price} MXN
                  </span>
                </div>
                
                <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{plan.description}</p>
                
                {/* CTA */}
                <div className="mt-auto">
                  <Button 
                    variant={isCurrentPlan ? 'secondary' : 'accent'}
                    className={`w-full justify-center !py-3.5 !rounded-full font-bold ${isCurrentPlan ? '!border-gray-200 !text-inmo-secondary' : ''}`}
                    disabled={isCurrentPlan}
                    onClick={() => handleCheckout(plan)}
                  >
                    {isCurrentPlan ? 'Seleccionado' : 'Seleccionar plan'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <section className="mt-4">
          <div className="flex items-center gap-2.5 mb-5">
            <HelpCircle className="w-6 h-6 text-gray-400" />
            <h3 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">
              Preguntas Frecuentes
            </h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-white/5 rounded-2xl p-4 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${activeFaq === index ? 'ring-2 ring-inmo-accent/20 border-inmo-accent/30' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="flex justify-between items-center gap-4">
                  <h4 className="font-inter font-bold text-sm text-inmo-secondary dark:text-white">{faq.q}</h4>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${activeFaq === index ? 'rotate-180 text-inmo-accent' : 'text-gray-400'}`} />
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${activeFaq === index ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                  <p className="font-inter text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ─── STEP: Overview (Default) ──────────────────────────────────
  return (
    <div className="h-full overflow-y-auto flex flex-col gap-8 w-full pb-24 px-6 md:px-8 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ── Plan Actual Header ── */}
      <section className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold text-xs border border-green-200 dark:border-green-800 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" /> Activo
            </span>
            <h2 className="font-montserrat font-black text-3xl text-inmo-secondary dark:text-white mt-2">
              Plan Básico
            </h2>
            <p className="font-inter text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Plan gratuito con límites en propiedades y leads.
            </p>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleStripePortal}
            icon={<CreditCard className="w-4 h-4" />}
            className="!px-3 !py-2 !text-xs !rounded-xl shrink-0"
          >
            Facturación
          </Button>
        </div>

        {/* Renewal info */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-inmo-darkcard rounded-xl border border-gray-100 dark:border-white/5">
          <span className="font-inter text-xs text-gray-500 dark:text-gray-400">
            Renovación: <span className="font-bold text-inmo-secondary dark:text-white">{usage.renewalDate}</span>
          </span>
        </div>
      </section>

      {/* ── Consumo ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Propiedades */}
        <div className="bg-white dark:bg-inmo-darkcard rounded-2xl p-5 shadow-soft border border-gray-100 dark:border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-gray-400" />
              <div>
                <span className="font-inter font-bold text-sm text-inmo-secondary dark:text-white block leading-tight">Propiedades</span>
                <span className="font-inter text-[11px] text-gray-400">Publicaciones activas</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-montserrat font-black text-2xl text-inmo-secondary dark:text-white leading-none">{usage.properties.used}</span>
              <span className="font-inter font-semibold text-sm text-gray-400">de {usage.properties.limit}</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${propertiesPercent >= 80 ? 'bg-inmo-accent' : 'bg-inmo-accent/70'}`} 
              style={{ width: `${propertiesPercent}%` }} 
            />
          </div>
          {propertiesPercent >= 80 && (
            <p className="font-inter text-xs text-inmo-accent mt-2.5 font-medium">
              ⚠ Te queda {usage.properties.limit - usage.properties.used} propiedad disponible
            </p>
          )}
        </div>

        {/* Leads */}
        <div className="bg-white dark:bg-inmo-darkcard rounded-2xl p-5 shadow-soft border border-gray-100 dark:border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Users className="w-6 h-6 text-gray-400" />
              <div>
                <span className="font-inter font-bold text-sm text-inmo-secondary dark:text-white block leading-tight">Leads</span>
                <span className="font-inter text-[11px] text-gray-400">Contactados este mes</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-montserrat font-black text-2xl text-inmo-secondary dark:text-white leading-none">{usage.leads.used}</span>
              <span className="font-inter font-semibold text-sm text-gray-400">de {usage.leads.limit}</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${leadsPercent >= 80 ? 'bg-inmo-accent' : 'bg-inmo-accent/70'}`}
              style={{ width: `${leadsPercent}%` }} 
            />
          </div>
          {leadsPercent >= 80 && (
            <p className="font-inter text-xs text-inmo-accent mt-2.5 font-medium">
              ⚠ Te quedan {usage.leads.limit - usage.leads.used} leads disponibles
            </p>
          )}
        </div>
      </section>

      {/* ── Upgrade CTA ── */}
      <section className="bg-inmo-accent rounded-3xl p-8 md:p-10 shadow-glow relative overflow-hidden flex items-center min-h-[140px]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="pt-1">
              <h3 className="font-montserrat font-bold text-xl text-white mb-1.5">
                ¿Necesitas más capacidad?
              </h3>
              <p className="font-inter text-sm text-white/90 leading-relaxed max-w-lg">
                Mejora tu plan para publicar más propiedades, contactar leads ilimitados y acceder a potentes herramientas de IA.
              </p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => setStep('plans')}
            icon={<ArrowRight className="w-5 h-5" />}
            className="shrink-0 w-full md:w-auto justify-center !py-3 !px-6"
          >
            Ver Planes
          </Button>
        </div>
      </section>

      {/* ── Billing Quick Actions ── */}
      <section className="flex flex-col gap-3">
        <h3 className="font-montserrat font-bold text-sm text-gray-400 uppercase tracking-wider ml-1">Facturación</h3>
        
        <div 
          onClick={handleStripePortal}
          className="bg-white dark:bg-inmo-darkcard rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group active:scale-[0.98]"
        >
          <CreditCard className="w-6 h-6 text-gray-400 group-hover:text-inmo-accent transition-colors shrink-0" />
          <div className="flex-1">
            <h4 className="font-inter font-bold text-sm text-inmo-secondary dark:text-white">Método de Pago</h4>
            <p className="font-inter text-xs text-gray-400">Gestionar tarjetas y métodos de pago en Stripe</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-inmo-accent transition-colors" />
        </div>

        <div 
          onClick={handleStripePortal}
          className="bg-white dark:bg-inmo-darkcard rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group active:scale-[0.98]"
        >
          <HelpCircle className="w-6 h-6 text-gray-400 group-hover:text-inmo-accent transition-colors shrink-0" />
          <div className="flex-1">
            <h4 className="font-inter font-bold text-sm text-inmo-secondary dark:text-white">Historial y Facturas</h4>
            <p className="font-inter text-xs text-gray-400">Ver recibos y descargar facturas desde Stripe</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-inmo-accent transition-colors" />
        </div>
      </section>

    </div>
  );
};
