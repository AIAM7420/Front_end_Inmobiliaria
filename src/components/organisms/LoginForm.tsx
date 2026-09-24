import React, { useState } from 'react';
import { User, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { useLogin } from '../../integrations/backend/hooks/useAuth';
import { problemFromError } from '../../integrations/backend/axios.config';
import type { Cuenta } from '../../integrations/backend/types';
import { localPilotNoEmail } from '../../integrations/backend/localPilot';

export type AuthView = 'login' | 'account-type' | 'register' | 'recovery' | 'otp' | 'new-password' | 'advisor-profile' | 'advisor-pending' | 'payment-gateway';

interface LoginFormProps {
  onLogin: (account: Cuenta) => void;
  onNavigate: (view: AuthView) => void;
}

export const LoginForm: React.FC<LoginFormProps> = React.memo(({ onLogin, onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!correo.trim() || !password) return;
    try {
      const session = await login.mutateAsync({ correo: correo.trim(), password });
      onLogin(session.cuenta);
    } catch {
      // Error is displayed inline without exposing the entered credentials.
    }
  };

  return (
    <form
      onSubmit={(event) => { void submit(event); }}
      className="w-full max-w-sm flex flex-col gap-5 animate-in fade-in transform-gpu will-change-[opacity,transform] duration-500 ease-out"
    >
      <Input
        type="email"
        value={correo}
        onChange={(event) => setCorreo(event.target.value)}
        autoComplete="email"
        placeholder="Correo electrónico"
        leftIcon={<User className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
      />
      <div className="flex flex-col gap-1">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Contraseña ..."
          leftIcon={<KeyRound className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          rightIcon={
            showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-400 cursor-pointer" strokeWidth={1.5} onClick={() => setShowPassword(false)} />
            ) : (
              <Eye className="w-5 h-5 text-gray-400 cursor-pointer" strokeWidth={1.5} onClick={() => setShowPassword(true)} />
            )
          }
        />
        {!localPilotNoEmail && <div className="flex justify-start mt-1">
          <Button
            type="button"
            variant="text"
            onClick={() => onNavigate('recovery')}
            className="text-sm pl-4"
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </div>}
      </div>
      {localPilotNoEmail && <p role="status" className="font-inter text-sm text-inmo-secondary dark:text-gray-300">
        Piloto local sin correo: las cuentas no verifican su dirección y la recuperación de contraseña no está disponible. No uses datos personales reales.
      </p>}
      {login.isError && <p role="alert" className="font-inter text-sm text-inmo-danger">
        {problemFromError(login.error)?.detail ?? 'No pudimos iniciar sesión. Verifica tu correo y contraseña.'}
      </p>}
      <Button type="submit" variant="accent" isLoading={login.isPending} disabled={!correo.trim() || !password}
        className="w-full h-14 mt-2" icon={<User className="w-5 h-5" />}>Iniciar sesión</Button>
      <div className="flex items-center justify-center gap-1 mt-6">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-inter">¿No tienes cuenta?</span>
        <Button type="button" variant="text" onClick={() => onNavigate('account-type')} className="text-sm font-bold">
          Regístrate aquí
        </Button>
      </div>
    </form>
  );
});
