import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlignLeft, Building2, CheckCircle2, Hourglass, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Textarea } from '../../atoms/Textarea';
import { FileDropZone } from '../../atoms/FileDropZone';
import { Badge } from '../../atoms/Badge';
import { AuthHeader } from '../../molecules/AuthHeader';
import { StepIndicator } from '../../molecules/StepIndicator';
import { ConflictNotice } from '../../molecules/ConflictNotice';
import { AdvisorSubscriptionView } from '../../views/asesor/AdvisorSubscriptionView';
import { useGetOwnApplication, useResubmitAdvisorApplication, useUploadAdvisorDocument } from '../../../integrations/backend/hooks/useAdvisors';
import { useGetSubscription } from '../../../integrations/backend/hooks/useSubscriptions';
import { useLogout } from '../../../integrations/backend/hooks/useAuth';
import { getProfessionalProfile, updateProfessionalProfile, type PerfilProfesional } from '../../../integrations/backend/engagement.service';
import type { SolicitudAsesor } from '../../../integrations/backend/advisors.service';
import { hasRequiredAdvisorDocuments, needsAdvisorOnboarding, requiredAdvisorDocuments } from '../../../integrations/backend/advisorOnboarding';
import { isVersionConflict, operationError } from '../../../integrations/backend/versioning';

type Step = 'profile' | 'documents' | 'review' | 'payment';
type DocumentCode = 'IDENTIFICACION_OFICIAL' | 'CONSTANCIA_ACTIVIDAD_INMOBILIARIA' | 'CONSTANCIA_SITUACION_FISCAL' | 'LICENCIA_INMOBILIARIA';
const documentLabels: Record<DocumentCode, string> = {
  IDENTIFICACION_OFICIAL: 'Identificación oficial (INE / Pasaporte)',
  CONSTANCIA_ACTIVIDAD_INMOBILIARIA: 'Constancia de actividad inmobiliaria',
  CONSTANCIA_SITUACION_FISCAL: 'Constancia de situación fiscal',
  LICENCIA_INMOBILIARIA: 'Licencia inmobiliaria (opcional)',
};

export function AdvisorOnboardingView() {
  const application = useGetOwnApplication(), subscription = useGetSubscription();
  const profile = useQuery({ queryKey: ['advisor', 'professional'], queryFn: getProfessionalProfile });
  const logout = useLogout(), navigate = useNavigate(), resubmit = useResubmitAdvisorApplication();
  const [requestedStep, setStep] = useState<Step | null>(null);
  const current = application.data?.value;
  const step: Step = current?.estado === 'APROBADA' ? 'payment' : current?.estado === 'RECHAZADA' ? 'review' : requestedStep ?? (current && hasRequiredAdvisorDocuments(current) ? 'review' : 'profile');
  const index = { profile: 0, documents: 1, review: 2, payment: 3 }[step];
  const failure = application.error ?? subscription.error ?? profile.error;
  const refresh = async () => { await Promise.all([application.refetch(), subscription.refetch(), profile.refetch()]); };
  if (current && subscription.data && !needsAdvisorOnboarding(current, subscription.data.value)) return <Navigate to="/asesor" replace />;
  return <main className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 pt-10 text-inmo-secondary dark:text-white font-inter">
    <StepIndicator steps={['Datos', 'Identificación', 'Revisión', 'Pago']} currentStep={index} className="max-w-sm mb-8" />
    {failure ? <section className="w-full max-w-sm flex flex-col gap-5"><AuthHeader title="Completa tu registro de asesor" /><p role="alert">{operationError(failure)}</p><Button onClick={() => void refresh()}>Reintentar consulta</Button></section> : !current || !subscription.data || !profile.data ? <p role="status">Consultando tu expediente y suscripción…</p> : <>
      {step === 'profile' && <><AuthHeader title="Completa tu perfil profesional" subtitle="Necesitamos verificar tu información para habilitar tu cuenta de asesor." /><ProfessionalForm initial={profile.data} onContinue={() => setStep('documents')} /></>}
      {step === 'documents' && <><AuthHeader title="Completa tu perfil profesional" subtitle="Sube tus documentos privados para la revisión del superadministrador." /><DocumentForm key={current.id} application={current} onContinue={() => setStep('review')} onBack={() => setStep('profile')} /></>}
      {step === 'review' && <section className="w-full max-w-sm flex flex-col items-center gap-6 animate-in fade-in">
        <Hourglass className="w-20 h-20 text-inmo-warning animate-pulse" strokeWidth={1.5} />
        <AuthHeader title={current.estado === 'RECHAZADA' ? 'Revisa tu expediente' : 'Tu cuenta está en revisión'} subtitle={current.estado === 'RECHAZADA' ? 'Corrige los documentos según el motivo de revisión y presenta una nueva solicitud.' : 'Tus documentos están recibidos. Falta la aprobación del superadministrador; después podrás activar tu suscripción.'} className="mb-0" />
        <Badge variant={current.estado === 'RECHAZADA' ? 'primary' : 'warning'} text={current.estado === 'RECHAZADA' ? 'Solicitud rechazada' : 'Pendiente de Aprobación'} />
        {current.motivo && <p className="w-full rounded-card p-5 bg-gray-50 dark:bg-inmo-darkcard text-sm whitespace-pre-wrap">{current.motivo}</p>}
        {current.estado === 'RECHAZADA' ? <Button className="w-full h-14" isLoading={resubmit.isPending} onClick={async () => { try { await resubmit.mutateAsync(); setStep('documents'); } catch { /* rendered below */ } }}>Abrir nueva solicitud</Button> : <Button className="w-full h-14" onClick={() => setStep('documents')}>Consultar documentos</Button>}
        {resubmit.isError && <p role="alert" className="text-inmo-danger">{operationError(resubmit.error)}</p>}
      </section>}
      {step === 'payment' && <section className="w-full max-w-4xl"><AuthHeader title="Activa tu cuenta de Asesor" subtitle="Tu expediente está aprobado. Elige tu plan y completa el pago seguro para acceder." /><div className="flex items-center justify-center gap-2 text-inmo-success text-sm"><ShieldCheck className="w-5 h-5" />Identidad verificada por el superadministrador</div><AdvisorSubscriptionView embedded initialStep="plans" /><p className="text-center text-sm text-gray-500">El acceso se habilita cuando el proveedor confirma un periodo pagado. Volver de Stripe no confirma el pago.</p></section>}
      <Button variant="secondary" className="w-full max-w-sm h-14 mt-6" onClick={() => void refresh()}>Actualizar estado</Button>
    </>}
    <Button variant="text" className="mt-6" isLoading={logout.isPending} onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) })}>Cerrar sesión y continuar después</Button>
  </main>;
}

function ProfessionalForm({ initial, onContinue }: { initial: PerfilProfesional; onContinue: () => void }) {
  const cache = useQueryClient(), [snapshot, setSnapshot] = useState(initial);
  const [name, setName] = useState(initial.nombre_comercial ?? ''), [phone, setPhone] = useState(initial.telefono_profesional ?? ''), [description, setDescription] = useState(initial.descripcion ?? '');
  const [conflict, setConflict] = useState(false);
  const save = useMutation({ mutationFn: () => updateProfessionalProfile({ nombre_comercial: name.trim(), telefono_profesional: phone.trim(), descripcion: description.trim() || null }, snapshot.version), onSuccess: value => { setSnapshot(value); cache.setQueryData(['advisor', 'professional'], value); onContinue(); } });
  return <form className="w-full max-w-sm flex flex-col gap-5 animate-in fade-in -mt-2" onSubmit={async event => { event.preventDefault(); if (conflict) return; try { await save.mutateAsync(); } catch (error) { if (isVersionConflict(error)) setConflict(true); } }}>
    <Input required maxLength={150} aria-label="Nombre comercial" placeholder="Nombre comercial" value={name} onChange={event => setName(event.target.value)} leftIcon={<Building2 className="w-5 h-5 text-gray-400" strokeWidth={1.5} />} />
    <Input required type="tel" maxLength={32} aria-label="Teléfono profesional" placeholder="Teléfono profesional" value={phone} onChange={event => setPhone(event.target.value)} leftIcon={<Phone className="w-5 h-5 text-gray-400" strokeWidth={1.5} />} />
    <Textarea maxLength={2000} aria-label="Biografía profesional" placeholder="Biografía profesional" value={description} onChange={event => setDescription(event.target.value)} leftIcon={<AlignLeft className="w-5 h-5 text-gray-400" strokeWidth={1.5} />} className="min-h-[140px]" wrapperClassName="mb-6" />
    {conflict && <ConflictNotice current={<p>Versión vigente: {snapshot.version}</p>} onReview={async () => { const current = await getProfessionalProfile(); setSnapshot(current); cache.setQueryData(['advisor', 'professional'], current); }} onAccept={() => { setConflict(false); save.reset(); }} />}
    {save.isError && !conflict && <p role="alert" className="text-inmo-danger text-sm">{operationError(save.error)}</p>}
    <Button type="submit" className="w-full h-14 mt-8" disabled={conflict} isLoading={save.isPending}>Guardar y subir documentos</Button>
  </form>;
}

function DocumentForm({ application, onContinue, onBack }: { application: SolicitudAsesor; onContinue: () => void; onBack: () => void }) {
  const current = useGetOwnApplication(), upload = useUploadAdvisorDocument();
  const [files, setFiles] = useState<Partial<Record<DocumentCode, File>>>({}), [sending, setSending] = useState(false), [error, setError] = useState('');
  const required = requiredAdvisorDocuments(application);
  const types = [...required, 'LICENCIA_INMOBILIARIA'] as DocumentCode[];
  const received = (type: string) => application.documentos.some(document => document.tipo === type);
  const complete = required.every(type => received(type) || files[type as DocumentCode]);
  async function send() {
    setSending(true); setError('');
    try {
      for (const type of types) if (files[type]) {
        await upload.mutateAsync({ tipo: type, file: files[type]! });
        setFiles(previous => { const next = { ...previous }; delete next[type]; return next; });
      }
      const result = await current.refetch();
      if (!result.data || result.error || !hasRequiredAdvisorDocuments(result.data.value)) throw result.error ?? new Error('Faltan documentos confirmados. Conserva los archivos y vuelve a intentar.');
      onContinue();
    } catch (cause) { setError(operationError(cause)); } finally { setSending(false); }
  }
  return <div className="w-full max-w-sm flex flex-col gap-5 animate-in fade-in -mt-2">
    {types.map(type => <section key={type} className="flex flex-col gap-3"><p className="text-body text-center font-bold">{documentLabels[type]}</p>{received(type) && <p role="status" className="text-inmo-success text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Documento recibido: {application.documentos.filter(document => document.tipo === type).at(-1)?.nombre}</p>}
      {application.estado === 'PENDIENTE' && <fieldset disabled={sending}><FileDropZone disabled={sending} label={'Subir ' + documentLabels[type]} hint="PDF, JPEG o WebP · hasta 5 MB" accept="application/pdf,image/jpeg,image/webp" maxSizeMB={5} onFileSelect={file => setFiles(previous => ({ ...previous, [type]: file }))} onFileRemove={() => setFiles(previous => { const next = { ...previous }; delete next[type]; return next; })} /></fieldset>}
    </section>)}
    {error && <p role="alert" className="text-inmo-danger text-sm">{error}</p>}
    <Button className="w-full h-14 mt-2" disabled={!complete || sending} isLoading={sending} onClick={() => void send()}>{Object.keys(files).length ? 'Enviar documentos para revisión' : 'Consultar revisión'}</Button>
    <Button variant="tertiary" className="w-full h-14" disabled={sending} onClick={onBack}>Anterior</Button>
  </div>;
}
