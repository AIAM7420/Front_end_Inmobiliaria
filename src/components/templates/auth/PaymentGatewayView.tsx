import { CreditCard } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { AuthHeader } from '../../molecules/AuthHeader';

interface PaymentGatewayViewProps {
  onLogin: () => void;
}

/** Stripe Checkout must be created by the authenticated billing flow, never simulated in a card form. */
export function PaymentGatewayView({ onLogin }: PaymentGatewayViewProps) {
  return <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 justify-center py-10">
    <AuthHeader title="Activa tu cuenta de asesor" />
    <div className="w-full max-w-sm bg-white dark:bg-inmo-darkcard rounded-card shadow-soft p-6 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 rounded-full bg-inmo-accent/10 text-inmo-accent flex items-center justify-center"><CreditCard className="w-7 h-7" /></div>
      <p className="font-inter text-sm text-gray-600 dark:text-gray-300">Inicia sesión para elegir un plan y continuar al Checkout seguro de Stripe. Esta pantalla no recopila datos de tarjeta ni activa la suscripción por sí sola.</p>
      <Button type="button" onClick={onLogin} className="w-full h-12">Ir al login</Button>
    </div>
  </div>;
}
