import type { SolicitudAsesor } from './advisors.service';
import type { Suscripcion } from './subscriptions.service';

export function requiredAdvisorDocuments(application: SolicitudAsesor): string[] {
  return application.tipos_requeridos ?? ['IDENTIFICACION_OFICIAL', application.requisitos_version === 'V2' ? 'CONSTANCIA_SITUACION_FISCAL' : 'CONSTANCIA_ACTIVIDAD_INMOBILIARIA'];
}

export function hasRequiredAdvisorDocuments(application: SolicitudAsesor): boolean {
  return requiredAdvisorDocuments(application).every(type => application.documentos.some(document => document.tipo === type));
}

export function needsAdvisorOnboarding(application: SolicitudAsesor, subscription: Suscripcion): boolean {
  // A previous paid period means registration was completed. Expiry/grace keep the existing
  // renewal/inventory UX; the backend continues to enforce current publishing eligibility.
  return application.estado !== 'APROBADA' || !subscription.periodo;
}
