import type { ChatbotSalida, CriteriosBusqueda } from './types';

/** The chatbot interprets the text; the normal search contract supplies pagination. */
export function chatbotCriteria(result?: ChatbotSalida): CriteriosBusqueda {
  if (!result || result.estado !== 'RESULTADOS') return {};
  return Object.fromEntries(Object.entries(result.criterios).filter(([, value]) => value !== null)) as CriteriosBusqueda;
}
