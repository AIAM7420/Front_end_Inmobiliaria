import { expect, test } from 'vitest';
import { chatbotCriteria } from './chatbotCriteria';
import type { ChatbotSalida } from './types';

const result: ChatbotSalida = { estado: 'RESULTADOS', aclaracion: null, resultados: [], criterios: { tipo_id: '1', operacion_id: null, zona_id: null, precio_min: null, precio_max: '1000000.00', moneda: 'MXN', habitaciones_min: 0, banos_min: null, amenidad_ids: [] } };
test('pagination preserves interpreted bounds and zero while excluding nullable filters', () => {
  expect(chatbotCriteria(result)).toEqual({ tipo_id: '1', precio_max: '1000000.00', moneda: 'MXN', habitaciones_min: 0, amenidad_ids: [] });
  expect(chatbotCriteria({ ...result, estado: 'ACLARACION' })).toEqual({});
  expect(chatbotCriteria()).toEqual({});
});
