import { useState } from 'react';
import { useGetOwnApplication, useGetOwnAdvisor, useResubmitAdvisorApplication, useUploadAdvisorDocument } from '../../../integrations/backend/hooks/useAdvisors';
import { problemFromError } from '../../../integrations/backend/axios.config';
import { Button } from '../../atoms/Button';
import { Skeleton } from '../../atoms/Skeleton';

const documentTypes = [
  { code: 'IDENTIFICACION_OFICIAL', label: 'Identificación oficial' },
  { code: 'CONSTANCIA_ACTIVIDAD_INMOBILIARIA', label: 'Constancia de actividad inmobiliaria' },
] as const;

export function AdvisorValidationView() {
  const advisor = useGetOwnAdvisor();
  const application = useGetOwnApplication();
  const upload = useUploadAdvisorDocument();
  const resubmit = useResubmitAdvisorApplication();
  const [notice, setNotice] = useState('');
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const current = application.data?.value;
  const error = upload.error ?? resubmit.error;

  async function sendDocument(tipo: typeof documentTypes[number]['code'], file?: File) {
    if (!file) return;
    setNotice('');
    setUploadingType(tipo);
    try {
      await upload.mutateAsync({ tipo, file });
      setNotice('Documento recibido y confirmado. Queda disponible para revisión.');
    } catch {
      // The error is shown below without exposing the upload URL.
    } finally {
      setUploadingType(null);
    }
  }

  return <main className="mx-auto w-full max-w-5xl px-4 md:px-6 pt-28 pb-32 text-inmo-secondary dark:text-white">
    <h1 className="font-montserrat text-3xl font-bold">Validación profesional</h1>
    <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mt-2">Tu expediente se revisa antes de habilitar funciones profesionales.</p>
    {(advisor.isLoading || application.isLoading) ? <div className="space-y-4 mt-8"><Skeleton className="h-24" /><Skeleton className="h-48" /></div>
      : (advisor.isError || application.isError) ? <section role="alert" className="mt-8 rounded-card bg-white dark:bg-inmo-darkcard p-6 font-inter text-sm">
        No encontramos un expediente de asesor para esta cuenta. Si usas la cuenta sintética del piloto, regístrate como asesor con un correo de prueba nuevo para crear una solicitud real.
      </section>
        : <>
          <section className="mt-8 rounded-card bg-white dark:bg-inmo-darkcard p-6 shadow-soft">
            <p className="font-inter text-sm text-gray-500">{advisor.data?.nombre_comercial}</p>
            <p className="font-montserrat text-xl font-bold mt-2">Solicitud #{current?.id} · {current?.estado}</p>
            {current?.estado === 'RECHAZADA' && <p className="font-inter text-sm mt-3">Puedes abrir una nueva solicitud y volver a cargar los documentos.</p>}
            {current?.estado === 'RECHAZADA' && <Button className="mt-4 px-5 py-3" isLoading={resubmit.isPending}
              onClick={async () => { try { await resubmit.mutateAsync(); setNotice('Nueva solicitud creada.'); } catch { /* shown below */ } }}>
              Reenviar solicitud
            </Button>}
          </section>
          {current?.estado === 'PENDIENTE' && <section className="mt-5 rounded-card bg-white dark:bg-inmo-darkcard p-6 shadow-soft">
            <h2 className="font-montserrat font-bold text-lg">Documentos</h2>
            <p className="font-inter text-sm text-gray-500 mt-2">Sube ambos documentos en PDF, JPEG o WebP, de hasta 5 MB cada uno. Permanecen privados en R2.</p>
            <div className="grid md:grid-cols-2 gap-4 mt-5">
              {documentTypes.map(({ code, label }) => <label key={code} className="rounded-2xl border border-inmo-tertiary dark:border-inmo-darktertiary p-4 font-inter text-sm">
                <span className="block font-bold mb-3">{label}</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.webp,application/pdf,image/jpeg,image/webp"
                  disabled={upload.isPending} className="block w-full text-xs" aria-label={label}
                  onChange={(event) => { void sendDocument(code, event.target.files?.[0]); event.target.value = ''; }} />
                {uploadingType === code && <span className="block mt-2">Subiendo y comprobando…</span>}
              </label>)}
            </div>
            <ul className="mt-5 space-y-2 font-inter text-sm">
              {current.documentos.map((document) => <li key={document.id}>{document.nombre} · {document.estado}</li>)}
            </ul>
          </section>}
        </>}
    {notice && <p role="status" className="mt-5 font-inter text-sm text-inmo-success">{notice}</p>}
    {error && <p role="alert" className="mt-5 font-inter text-sm text-inmo-danger">{problemFromError(error)?.detail ?? (error instanceof Error ? error.message : 'No se pudo completar la operación.')}</p>}
  </main>;
}
