import React, { useState } from 'react';
import { User, KeyRound, Eye, EyeOff, Briefcase, Shield } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

export type AuthView = 'login' | 'account-type' | 'register' | 'recovery' | 'otp' | 'new-password' | 'advisor-profile' | 'advisor-pending' | 'payment-gateway';

interface LoginFormProps {
  onLogin: (role?: 'public' | 'asesor' | 'admin') => void;
  onNavigate: (view: AuthView) => void;
}

export const LoginForm: React.FC<LoginFormProps> = React.memo(({ onLogin, onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onLogin('public'); }}
      className="w-full max-w-sm flex flex-col gap-5 animate-in fade-in transform-gpu will-change-[opacity,transform] duration-500 ease-out"
    >
      <Input
        placeholder="Usuario, correo o teléfono ..."
        leftIcon={<User className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
      />
      <div className="flex flex-col gap-1">
        <Input
          type={showPassword ? 'text' : 'password'}
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
        <div className="flex justify-start mt-1">
          <Button
            type="button"
            variant="text"
            onClick={() => onNavigate('recovery')}
            className="text-sm pl-4"
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </div>
      </div>
      <div className="flex gap-3 mt-2 w-full">
        <Button 
          type="button" 
          onClick={() => onLogin('public')} 
          variant="accent" 
          className="flex-1 h-14 !justify-center" 
          aria-label="Entrar como Público" 
          icon={<User className="w-6 h-6" strokeWidth={2} />} 
        />
        <Button 
          type="button" 
          onClick={() => onLogin('asesor')} 
          variant="accent" 
          className="flex-1 h-14 !justify-center" 
          aria-label="Entrar como Asesor" 
          icon={<Briefcase className="w-6 h-6" strokeWidth={2} />} 
        />
        <Button 
          type="button" 
          onClick={() => onLogin('admin')} 
          variant="accent" 
          className="flex-1 h-14 !justify-center" 
          aria-label="Entrar como Admin" 
          icon={<Shield className="w-6 h-6" strokeWidth={2} />} 
        />
      </div>
      <div className="flex items-center justify-center gap-1 mt-6">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-inter">¿No tienes cuenta?</span>
        <Button type="button" variant="text" onClick={() => onNavigate('account-type')} className="text-sm font-bold">
          Regístrate aquí
        </Button>
      </div>
    </form>
  );
});
