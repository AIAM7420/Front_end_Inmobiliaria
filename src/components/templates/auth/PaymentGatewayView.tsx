import React, { useState, useCallback } from 'react';
import { CreditCard, Calendar, Lock, User, Check, ShieldCheck } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { AuthHeader } from '../../molecules/AuthHeader';

interface PaymentGatewayViewProps {
  onLogin: () => void;
}

export const PaymentGatewayView: React.FC<PaymentGatewayViewProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 2000);
  }, [onLogin]);

  const features = [
    'Publicación ilimitada de propiedades',
    'Dashboard de analíticas',
    'Chat directo con prospectos',
    'Insignia de asesor verificado',
  ];

  return (
    <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 justify-center py-10">
      <AuthHeader title="Activa tu cuenta de Asesor" />

      <div className="w-full max-w-sm flex flex-col gap-6 animate-in fade-in -mt-2">
        {/* Subscription Summary Card */}
        <div className="bg-white dark:bg-inmo-darkcard rounded-card shadow-soft p-6 flex flex-col gap-4">
          <h2 className="text-subtitle">Plan Asesor Premium</h2>
          <p className="text-price">$499.00 MXN/mes</p>

          <ul className="flex flex-col gap-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-inmo-success shrink-0" strokeWidth={2} />
                <span className="text-body text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="w-full flex flex-col gap-5">
          <Input
            placeholder="Número de tarjeta"
            leftIcon={<CreditCard className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="MM/AA"
              leftIcon={<Calendar className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
            />
            <Input
              placeholder="CVV"
              leftIcon={<Lock className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
            />
          </div>

          <Input
            placeholder="Nombre del titular"
            leftIcon={<User className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          />

          <Button
            type="submit"
            variant="accent"
            className="w-full h-14 mt-2"
            isLoading={isLoading}
          >
            Pagar y Activar
          </Button>
        </form>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 mt-1">
          <ShieldCheck className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <span className="text-xs text-gray-400 font-inter">
            Pago seguro. Tus datos están protegidos.
          </span>
        </div>
      </div>
    </div>
  );
};
