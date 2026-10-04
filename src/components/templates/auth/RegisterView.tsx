import { useState } from 'react';
import type { FormEvent } from 'react';
import { User, Mail, Phone, KeyRound, DoorOpen, Building2 } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Badge } from '../../atoms/Badge';
import { AuthHeader } from '../../molecules/AuthHeader';
import { StepIndicator } from '../../molecules/StepIndicator';
import { Textarea } from '../../atoms/Textarea';
import { useRegisterAccount } from '../../../integrations/backend/hooks/useAuth';
import { useRegisterAdvisor } from '../../../integrations/backend/hooks/useAdvisors';
import { problemFromError } from '../../../integrations/backend/axios.config';
import { localPilotNoEmail } from '../../../integrations/backend/localPilot';
import type { AuthView } from './LoginView';

interface RegisterViewProps {
  accountType: 'prospecto' | 'asesor';
  onNavigate: (view: AuthView) => void;
}

export function RegisterView({ accountType, onNavigate }: RegisterViewProps) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [nombreComercial, setNombreComercial] = useState('');
  const [telefonoProfesional, setTelefonoProfesional] = useState('');
  const [localError, setLocalError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [professionalStep, setProfessionalStep] = useState(false);
  const [description, setDescription] = useState('');
  const account = useRegisterAccount();
  const advisor = useRegisterAdvisor();
  const pending = account.isPending || advisor.isPending;
  const serverError = problemFromError(account.error ?? advisor.error);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError('');
    if (password !== confirmation) { setLocalError('Las contraseñas no coinciden.'); return; }
    if (accountType === 'asesor' && !professionalStep) { setProfessionalStep(true); return; }
    if (accountType === 'asesor' && (!nombreComercial.trim() || !telefonoProfesional.trim())) {
      setLocalError('Completa los datos profesionales.'); return;
    }
    const cuenta = {
      nombre: nombre.trim(), correo: correo.trim(), password,
      ...(telefono.trim() ? { telefono: telefono.trim() } : {}),
    };
    try {
      if (accountType === 'asesor') {
        await advisor.mutateAsync({ cuenta, nombre_comercial: nombreComercial.trim(), telefono_profesional: telefonoProfesional.trim(), descripcion: description.trim() || null });
      } else {
        await account.mutateAsync(cuenta);
      }
      setRegistered(true);
      setPassword(''); setConfirmation('');
    } catch {
      // RFC 9457 details are rendered below.
    }
  };

  return <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 justify-center py-10">
    {accountType === 'asesor' && <StepIndicator steps={['Cuenta', 'Datos', 'Identificación', 'Pago']} currentStep={professionalStep ? 1 : 0} className="max-w-sm mb-8" />}
    <AuthHeader title={professionalStep ? 'Completa tu perfil profesional' : 'Únete a nosotros'} subtitle={accountType === 'asesor' ? 'Crea tu cuenta, verifica tus documentos y activa tu suscripción antes de acceder como asesor.' : localPilotNoEmail ? 'Piloto local: podrás entrar sin confirmar tu correo' : 'Crea tu cuenta y confirma tu correo para iniciar sesión'}>
      <Badge variant={accountType === 'prospecto' ? 'secondary' : 'primary'} text={accountType === 'prospecto' ? 'Prospecto' : 'Asesor Inmobiliario'} />
    </AuthHeader>
    {registered ? <div role="status" className="w-full max-w-sm bg-gray-50 dark:bg-inmo-darkcard rounded-card p-6 font-inter text-sm text-inmo-secondary dark:text-white">
      {localPilotNoEmail ? 'Cuenta de piloto registrada. Puedes iniciar sesión ahora; el correo no está verificado.' : 'Cuenta registrada. Confirma tu correo antes de iniciar sesión.'}
      {accountType === 'asesor' && <p className="mt-4">Después de confirmar tu correo, inicia sesión para subir tu identificación y constancia fiscal. Continuarás en el registro hasta que el superadministrador apruebe tus documentos y completes el pago.</p>}
      <Button type="button" onClick={() => onNavigate('login')} className="w-full h-12 mt-5">{accountType === 'asesor' ? 'Ya confirmé mi correo: continuar registro' : 'Ir al login'}</Button>
    </div> : <form onSubmit={(event) => { void submit(event); }} className="w-full max-w-sm flex flex-col gap-5 animate-in fade-in">
      {!professionalStep && <><Input required value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Nombre completo" leftIcon={<User className="w-5 h-5 text-gray-400" />} />
      <Input required type="email" value={correo} onChange={(event) => setCorreo(event.target.value)} placeholder="Correo electrónico" leftIcon={<Mail className="w-5 h-5 text-gray-400" />} />
      <Input type="tel" value={telefono} onChange={(event) => setTelefono(event.target.value)} placeholder="Teléfono (opcional)" leftIcon={<Phone className="w-5 h-5 text-gray-400" />} /></>}
      {professionalStep && <>
        <Input required value={nombreComercial} onChange={(event) => setNombreComercial(event.target.value)} placeholder="Nombre comercial" leftIcon={<Building2 className="w-5 h-5 text-gray-400" />} />
        <Input required type="tel" value={telefonoProfesional} onChange={(event) => setTelefonoProfesional(event.target.value)} placeholder="Teléfono profesional" leftIcon={<Phone className="w-5 h-5 text-gray-400" />} />
        <Textarea placeholder="Biografía profesional" value={description} onChange={event => setDescription(event.target.value)} maxLength={2000} className="min-h-[140px]" />
      </>}
      {!professionalStep && <div className="grid grid-cols-2 gap-3">
        <Input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Contraseña" leftIcon={<KeyRound className="w-5 h-5 text-gray-400" />} />
        <Input required minLength={8} type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Confirmar" leftIcon={<KeyRound className="w-5 h-5 text-gray-400" />} />
      </div>}
      {(localError || account.isError || advisor.isError) && <p role="alert" className="font-inter text-sm text-inmo-danger">{localError || serverError?.detail || 'No pudimos registrar la cuenta. Revisa los datos e inténtalo de nuevo.'}</p>}
      <Button type="submit" isLoading={pending} className="w-full h-14 mt-2" icon={<DoorOpen className="w-5 h-5" />}>{accountType === 'asesor' ? professionalStep ? 'Crear cuenta y verificar correo' : 'Comenzar' : 'Registrarme'}</Button>
      {professionalStep && <Button type="button" variant="tertiary" onClick={() => { setProfessionalStep(false); setLocalError(''); }} className="w-full h-14" disabled={pending}>Anterior</Button>}
      <Button type="button" variant="text" onClick={() => onNavigate('login')} className="text-sm font-bold">Volver al login</Button>
    </form>}
  </div>;
}
