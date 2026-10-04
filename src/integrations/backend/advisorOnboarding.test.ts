import { describe, expect, it } from 'vitest';
import { hasRequiredAdvisorDocuments, needsAdvisorOnboarding } from './advisorOnboarding';
import type { SolicitudAsesor } from './advisors.service';
import type { Suscripcion } from './subscriptions.service';

const pending: SolicitudAsesor = { id: '1', asesor_id: '1', estado: 'PENDIENTE', requisitos_version: 'V2', documentos: [], version: 1 };
const unpaid: Suscripcion = { id: null, asesor_id: '1', estado: 'SIN_SUSCRIPCION', periodo: null, version_plan_id: null, version_plan_siguiente_id: null, limite_propiedades: 0, propiedades_en_cupo: 0, capacidad_disponible: 0, renovacion_automatica: false, version: 1 };
const paid = { ...unpaid, estado: 'ACTIVA', periodo: { inicio_at: '2026-10-04T00:00:00Z', fin_at: '2026-11-04T00:00:00Z' } };
const document = (tipo: string) => ({ id: tipo, nombre: 'prueba.pdf', mime: 'application/pdf', tamano_bytes: 20, estado: 'PENDIENTE' as const, tipo });

describe('advisor registration access', () => {
  it('blocks a pending advisor even after paying', () => expect(needsAdvisorOnboarding(pending, paid)).toBe(true));
  it('blocks approved but unpaid registration and a checkout with no paid period', () => {
    expect(needsAdvisorOnboarding({ ...pending, estado: 'APROBADA' }, unpaid)).toBe(true);
    expect(needsAdvisorOnboarding({ ...pending, estado: 'APROBADA' }, { ...unpaid, estado: 'PENDIENTE_PAGO' })).toBe(true);
  });
  it('admits approval plus a confirmed period; rejection remains blocked', () => {
    expect(needsAdvisorOnboarding({ ...pending, estado: 'APROBADA' }, paid)).toBe(false);
    expect(needsAdvisorOnboarding({ ...pending, estado: 'RECHAZADA' }, paid)).toBe(true);
  });
  it('preserves access to existing renewal UX while backend restricts expired publishing', () => expect(needsAdvisorOnboarding({ ...pending, estado: 'APROBADA' }, { ...paid, estado: 'VENCIDA' })).toBe(false));
  it('requires tax evidence for V2 and preserves the original V1 requirements', () => {
    const legacy = [document('IDENTIFICACION_OFICIAL'), document('CONSTANCIA_ACTIVIDAD_INMOBILIARIA')];
    expect(hasRequiredAdvisorDocuments({ ...pending, documentos: legacy })).toBe(false);
    expect(hasRequiredAdvisorDocuments({ ...pending, requisitos_version: 'V1', documentos: legacy })).toBe(true);
    expect(hasRequiredAdvisorDocuments({ ...pending, documentos: [document('IDENTIFICACION_OFICIAL'), document('CONSTANCIA_SITUACION_FISCAL')] })).toBe(true);
  });
});
