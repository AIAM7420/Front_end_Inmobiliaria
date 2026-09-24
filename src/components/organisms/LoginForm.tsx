import React, { useState } from 'react';
import { User, KeyRound, Eye, EyeOff, Briefcase, Shield } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

export type AuthView = 'login' | 'account-type' | 'register' | 'recovery' | 'otp' | 'new-password' | 'advisor-profile' | 'advisor-pending' | 'payment-gateway';

interface LoginFormProps {
  onLogin: (role?: 'public' | 'asesor' | 'admin') => void;
  onNavigate: (view: AuthView) => void;
}

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

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

      <div className="relative flex items-center py-2 w-full">
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        <span className="flex-shrink-0 mx-4 text-gray-500 dark:text-gray-400 text-sm font-inter">O continuar con</span>
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
      </div>

      <Button 
        type="button" 
        variant="secondary" 
        className="w-full h-14" 
        icon={<GoogleIcon className="w-6 h-6" />}
        onClick={() => console.log('Mock: Iniciar con Google')}
      >
        Continuar con Google
      </Button>

      <div className="flex items-center justify-center gap-1 mt-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-inter">¿No tienes cuenta?</span>
        <Button type="button" variant="text" onClick={() => onNavigate('account-type')} className="text-sm font-bold">
          Regístrate aquí
        </Button>
      </div>
    </form>
  );
});
