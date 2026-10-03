import { useState } from 'react';
import { Button } from '../atoms/Button';
export function ConflictNotice({ onReview, onAccept, current }: { onReview: () => Promise<unknown>; onAccept?: () => void; current?: React.ReactNode }) {
  const [reviewed, setReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  return <div role="alert" className="rounded-2xl bg-inmo-warning/10 border border-inmo-warning/30 p-4 space-y-3 font-inter text-sm">
    <p>Los datos cambiaron mientras editabas. Tu formulario se conserva. Consulta la versión actual y revisa tus cambios antes de guardar otra vez.</p>
    {current}
    <Button variant="secondary" isLoading={loading} onClick={async () => {
      setLoading(true); setFailure(false);
      try { await onReview(); setReviewed(true); } catch { setFailure(true); } finally { setLoading(false); }
    }}>Revisar versión actual</Button>
    {reviewed && onAccept && <Button onClick={onAccept}>He revisado; conservar mis cambios</Button>}
    {failure && <p>No pudimos consultar la versión actual. Intenta nuevamente.</p>}
  </div>;
}
