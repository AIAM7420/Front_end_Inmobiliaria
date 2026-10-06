import { useSearchParams } from 'react-router-dom';

/** A detail can be loaded directly, independent of the current catalog page. */
export function usePropertySelection() {
  const [params, setParams] = useSearchParams();
  const id = params.get('propiedad') || null;
  const select = (nextId: string | null) => setParams(previous => {
    const next = new URLSearchParams(previous);
    if (nextId) next.set('propiedad', nextId);
    else next.delete('propiedad');
    return next;
  }, { replace: nextId === null });
  return [id, select] as const;
}
