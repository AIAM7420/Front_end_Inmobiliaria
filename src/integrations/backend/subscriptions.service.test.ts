import { expect, it } from 'vitest';
import { versionedSubscription, type Suscripcion } from './subscriptions.service';
const empty: Suscripcion = { id: null, asesor_id: '123', version_plan_id: null, version_plan_siguiente_id: null, estado: 'SIN_SUSCRIPCION', periodo: null, limite_propiedades: 0, propiedades_en_cupo: 0, capacidad_disponible: 0, renovacion_automatica: false, version: 0 };
it('uses v0 only for the authoritative absent subscription snapshot', () => {
  expect(versionedSubscription(empty)).toEqual({ value: empty, etag: '"v0"' });
  expect(() => versionedSubscription({ ...empty, id: '123' })).toThrow();
  expect(() => versionedSubscription({ ...empty, version: -1 })).toThrow();
});
it('uses the new subscription version after initial plan selection', () => {
  const selected = { ...empty, id: '123', version: 1, version_plan_siguiente_id: '2' };
  expect(versionedSubscription(selected)).toEqual({ value: selected, etag: '"v1"' });
});
