import { PropertyForm } from './PropertyForm';
import type { PropiedadCrear } from '../../integrations/backend/types';
export function PropertyCreatorWizard({ onSave, onCancel, pending }: { onSave:(payload:PropiedadCrear,photos?:File[])=>Promise<void>;onCancel:()=>void;pending:boolean }) {
  return <PropertyForm wizard onSave={onSave} onCancel={onCancel} pending={pending} />;
}
