const fs = require('fs');
const file = 'src/components/views/asesor/AsesorSubscription.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetRegex = /  if \(step === 'checkout-confirmation' && selectedPlan\) \{[\s\S]*?\n  \}\n\n  \/\/ ─── STEP: Plans/g;

const replacement = `  if (step === 'checkout-confirmation' && selectedPlan) {
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
              <div className="w-10 h-10 rounded-full bg-inmo-accent/10 flex items-center justify-center text-inmo-accent shrink-0">
                {selectedPlan.icon}
              </div>
              <div>
                <p className="font-bold text-sm text-inmo-secondary dark:text-white">Plan {selectedPlan.name}</p>
                <p className="text-xs text-gray-400">Ciclo de facturación mensual</p>
              </div>
            </div>
            <span className="font-montserrat font-black text-lg text-inmo-secondary dark:text-white">
              \${price}
            </span>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />

          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Subtotal</span>
              <span className="font-medium text-inmo-secondary dark:text-white">\${price} MXN</span>
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
              \${price} <span className="text-sm font-bold text-inmo-accent">MXN</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-2">
          <div className="flex items-center gap-2 opacity-50 order-2 sm:order-1 self-start sm:self-center">
            <Shield className="w-4 h-4 text-gray-500" />
            <span className="font-inter text-xs text-gray-500 font-medium tracking-wide">PAGOS SEGUROS POR STRIPE</span>
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

  // ─── STEP: Plans`;

content = content.replace(targetRegex, replacement);

fs.writeFileSync(file, content);
