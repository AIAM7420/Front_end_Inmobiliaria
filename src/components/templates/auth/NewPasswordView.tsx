import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { AuthHeader } from '../../molecules/AuthHeader';
import { PasswordRules } from '../../molecules/PasswordRules';
import type { AuthView } from './LoginView';

interface NewPasswordViewProps {
  onNavigate: (view: AuthView) => void;
}

export const NewPasswordView: React.FC<NewPasswordViewProps> = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength rules
  const rules = [
    { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { label: 'Al menos una mayúscula', met: /[A-Z]/.test(password) },
    { label: 'Al menos un número', met: /[0-9]/.test(password) },
    { label: 'Al menos un carácter especial', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const allRulesMet = rules.every((rule) => rule.met);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isDisabled = !allRulesMet || !passwordsMatch;

  return (
    <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 justify-center py-10">
      <AuthHeader 
        title="Crea tu nueva contraseña" 
        subtitle="Ingresa y confirma tu nueva contraseña para recuperar tu cuenta." 
      />

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isDisabled) {
            onNavigate('login');
          }
        }}
        className="w-full max-w-sm flex flex-col gap-5 animate-in fade-in -mt-2"
      >
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<KeyRound className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          rightIcon={
            showPassword ? (
              <EyeOff
                className="w-5 h-5 text-gray-400 cursor-pointer"
                strokeWidth={1.5}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                className="w-5 h-5 text-gray-400 cursor-pointer"
                strokeWidth={1.5}
                onClick={() => setShowPassword(true)}
              />
            )
          }
        />

        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<KeyRound className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          rightIcon={
            showConfirmPassword ? (
              <EyeOff
                className="w-5 h-5 text-gray-400 cursor-pointer"
                strokeWidth={1.5}
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <Eye
                className="w-5 h-5 text-gray-400 cursor-pointer"
                strokeWidth={1.5}
                onClick={() => setShowConfirmPassword(true)}
              />
            )
          }
        />

        {/* Password Strength Indicators */}
        <PasswordRules rules={rules} />

        <Button
          type="submit"
          variant="accent"
          className="w-full h-14 mt-2"
          disabled={isDisabled}
          icon={<Save className="w-5 h-5" strokeWidth={2} />}
        >
          Guardar Contraseña
        </Button>
      </form>
    </div>
  );
};
