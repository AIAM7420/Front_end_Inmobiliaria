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
      features: ['Hasta 10 propiedades', 'Soporte estándar', 'Estadísticas básicas'],
      notIncluded: ['Destacar propiedades', 'Herramientas IA'],
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
      features: ['Hasta 15 propiedades', 'Soporte prioritario', 'Estadísticas avanzadas', 'Destacar 3 propiedades'],
      notIncluded: ['Herramientas IA'],
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
      features: ['Hasta 20 propiedades', 'Soporte 24/7', 'Estadísticas avanzadas', 'Destacar 10 propiedades', 'Herramientas IA exclusivas'],
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
      <div className="flex flex-col gap-6 pb-8 animate-in fade-in zoom-in-95 duration-300 px-6 mt-8">
        
        {/* Header */}
        <div>
          <button onClick={() => setStep('plans')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-inmo-secondary dark:hover:text-white transition-colors mb-6">
            <ArrowRight className="w-4 h-4 rotate-180" /> Volver a planes
          </button>
          <h3 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white mb-2">Completar Suscripción</h3>
          <p className="font-inter text-sm text-gray-500 dark:text-gray-400">Estás a un paso de actualizar tu plan. Revisa tu orden antes de proceder al pago seguro.</p>
        </div>

        {/* Receipt Card */}
        <div className="bg-white dark:bg-inmo-darkcard rounded-2xl shadow-soft border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="text-inmo-accent shrink-0">
                {selectedPlan.icon}
              </div>
              <div>
                <p className="font-bold text-sm text-inmo-secondary dark:text-white">Plan {selectedPlan.name}</p>
                <p className="text-xs text-gray-400">Ciclo de facturación mensual</p>
              </div>
            </div>
            <span className="font-montserrat font-black text-lg text-inmo-secondary dark:text-white">
              ${price}
            </span>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />

          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Subtotal</span>
              <span className="font-medium text-inmo-secondary dark:text-white">${price} MXN</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Impuestos</span>
              <span className="text-sm text-gray-400">Se calculan en Stripe</span>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />

          <div className="p-4 bg-gray-50 dark:bg-inmo-darkbg/50 flex justify-between items-center">
            <span className="font-bold text-xs text-gray-400 uppercase tracking-wider">Total a pagar</span>
            <span className="font-montserrat font-black text-2xl text-inmo-accent">
              ${price} <span className="text-sm font-bold text-inmo-accent">MXN</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-2">
          <div className="flex items-center gap-2 opacity-70 order-2 sm:order-1 self-start sm:self-center">
            <Shield className="w-4 h-4 text-gray-500" />
            <span className="font-inter text-xs text-gray-500 font-medium tracking-wide">PAGOS SEGUROS POR</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-[18px] w-auto grayscale dark:grayscale-0 dark:invert ml-1" />
          </div>
          
          <Button 
            variant="accent"
            className="w-full sm:w-auto justify-center !py-3 !px-8 order-1 sm:order-2"
            onClick={confirmCheckout}
            isLoading={isRedirecting}
            icon={!isRedirecting ? <ExternalLink className="w-4 h-4" /> : undefined}
          >
            {isRedirecting ? 'Conectando...' : 'Proceder al pago'}
          </Button>
        </div>

      </div>
    );
  }

  // ─── STEP: Plans Selection ─────────────────────────────────────
  if (step === 'plans') {
    return (
      <div className="flex flex-col gap-8 w-full pb-24 px-6 md:px-8 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
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
                
                                <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{plan.description}</p>
                
                {/* Features */}
                <div className="flex flex-col gap-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-inmo-accent shrink-0 mt-0.5" />
                      <span className="font-inter text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <div key={'not-'+idx} className="flex items-start gap-2 opacity-50">
                      <X className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <span className="font-inter text-sm text-gray-500 dark:text-gray-400 line-through">{feature}</span>
                    </div>
                  ))}
                </div>

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
    <div className="flex flex-col gap-6 pb-8 animate-in fade-in zoom-in-95 duration-300 px-6 mt-8">
      
      <div>
        <h3 className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white mb-2">Suscripción</h3>
        <p className="font-inter text-sm text-gray-500 dark:text-gray-400">Gestiona tu plan actual y mejora tus límites.</p>
      </div>

      {/* ── Plan Actual Card ── */}
      <div className="bg-white dark:bg-inmo-darkcard rounded-2xl shadow-soft border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-lg text-inmo-secondary dark:text-white flex items-center gap-2">
              Plan Básico
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold text-[10px] uppercase tracking-wider border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-3 h-3" /> Activo
              </span>
            </h4>
            <p className="text-xs text-gray-400">Plan gratuito con límites en propiedades y leads.</p>
          </div>
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-inmo-darkbg px-3 py-1 rounded-lg">Mensual</span>
        </div>
        <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <div className="flex flex-col">
              <p className="font-bold text-sm text-inmo-secondary dark:text-white">Propiedades ({usage.properties.used}/{usage.properties.limit})</p>
              <div className="w-32 h-1.5 bg-gray-100 dark:bg-inmo-darktertiary rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-inmo-accent rounded-full" style={{ width: `${propertiesPercent}%` }} />
              </div>
            </div>
          </div>
          {propertiesPercent >= 80 && (
            <span className="text-xs font-bold text-inmo-accent">⚠ {usage.properties.limit - usage.properties.used} restantes</span>
          )}
        </div>
        <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <div className="flex flex-col">
              <p className="font-bold text-sm text-inmo-secondary dark:text-white">Leads ({usage.leads.used}/{usage.leads.limit})</p>
              <div className="w-32 h-1.5 bg-gray-100 dark:bg-inmo-darktertiary rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-inmo-accent rounded-full" style={{ width: `${leadsPercent}%` }} />
              </div>
            </div>
          </div>
          {leadsPercent >= 80 && (
            <span className="text-xs font-bold text-inmo-accent">⚠ {usage.leads.limit - usage.leads.used} restantes</span>
          )}
        </div>
      </div>

      {/* ── Upgrade CTA ── */}
      <div className="bg-inmo-accent rounded-2xl p-6 shadow-glow relative overflow-hidden flex flex-col gap-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <Sparkles className="w-8 h-8 text-white shrink-0" />
          <div>
            <h3 className="font-montserrat font-bold text-base text-white mb-0.5">
              ¿Necesitas más capacidad?
            </h3>
            <p className="font-inter text-xs text-white/90 leading-relaxed">
              Sube de nivel para publicar más propiedades y contactar leads ilimitados.
            </p>
          </div>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => setStep('plans')}
          icon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-1/2 self-center justify-center !py-2.5 text-sm"
        >
          Ver Planes y Precios
        </Button>
      </div>

    </div>
  );
};
