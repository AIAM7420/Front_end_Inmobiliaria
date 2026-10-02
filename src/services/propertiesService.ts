// ─── Simulated API Service for Properties (No Backend) ───
// Emulates endpoints API-016 through API-020 using in-memory state

import { MOCK_PROPERTIES } from '../data/mockProperties';
import type {
  PropertySummary,
  PropertyDetail,
  PropiedadCrearDTO,
  PropiedadPatchDTO,
  PublicacionDTO,
  PaginatedResponse,
  ApiError,
  PropertyStatus,
} from '../types/property';

// ─── Helpers ───
const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const generateEtag = () => `W/"${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}"`;

const createApiError = (code: string, message: string, status: number): ApiError => ({
  code,
  message,
  status,
});

// ─── In-memory store ───
let store: PropertyDetail[] = MOCK_PROPERTIES.map((p, index) => {
  let status: PropertyStatus = 'Activa';
  if (index % 3 === 1) status = 'Pausada';
  if (index % 3 === 2) status = 'Borrador';
  return {
    ...p,
    status,
    views: Math.floor(Math.random() * 500) + 50,
    messages: Math.floor(Math.random() * 20),
    description: '',
    gallery: [],
    amenities: [],
    etag: generateEtag(),
  };
});

let nextId = 1000;

// ─── API-016: GET /me/propiedades ───
export async function listProperties(
  params?: { search?: string; status?: string; page?: number; pageSize?: number }
): Promise<PaginatedResponse<PropertySummary>> {
  await delay(400 + Math.random() * 300);

  let filtered = [...store];

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
    );
  }

  if (params?.status && params.status !== 'Todos') {
    const statusMap: Record<string, PropertyStatus> = {
      Activas: 'Activa',
      Pausadas: 'Pausada',
      Borradores: 'Borrador',
    };
    const target = statusMap[params.status] || params.status;
    filtered = filtered.filter(p => p.status === target);
  }

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 50;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return {
    data: data.map(({ etag, description, gallery, amenities, ...rest }) => rest),
    total: filtered.length,
    page,
    pageSize,
  };
}

// ─── API-017: GET /me/propiedades/:id ───
export async function getPropertyDetail(id: number): Promise<PropertyDetail> {
  await delay(300 + Math.random() * 200);

  const prop = store.find(p => p.id === id);
  if (!prop) {
    throw createApiError('NOT_FOUND', `Propiedad ${id} no encontrada.`, 404);
  }

  // Simulate ETag header via property field
  return { ...prop };
}

// ─── API-018: POST /propiedades ───
export async function createProperty(dto: PropiedadCrearDTO): Promise<PropertyDetail> {
  await delay(600 + Math.random() * 400);

  const newProp: PropertyDetail = {
    id: ++nextId,
    title: dto.title,
    location: dto.location,
    price: dto.price,
    beds: dto.beds,
    baths: dto.baths,
    sqft: dto.sqft,
    type: dto.type,
    operationType: dto.operationType,
    propertyType: dto.propertyType,
    description: dto.description || '',
    lat: dto.lat,
    lng: dto.lng,
    image: dto.image || '',
    gallery: dto.gallery || [],
    tags: dto.tags || [],
    amenities: dto.amenities || [],
    isFavorite: false,
    status: 'Borrador',
    views: 0,
    messages: 0,
    etag: generateEtag(),
  };

  store = [newProp, ...store];
  return { ...newProp };
}

// ─── API-019: PATCH /me/propiedades/:id ───
export async function updateProperty(
  id: number,
  dto: PropiedadPatchDTO,
  ifMatch: string
): Promise<PropertyDetail> {
  await delay(500 + Math.random() * 300);

  const idx = store.findIndex(p => p.id === id);
  if (idx === -1) {
    throw createApiError('NOT_FOUND', `Propiedad ${id} no encontrada.`, 404);
  }

  const current = store[idx];

  // Simulate If-Match / ETag concurrency check
  if (current.etag !== ifMatch) {
    throw createApiError(
      'VERSION_OBSOLETA',
      'La propiedad fue modificada por otro proceso. Recarga e intenta de nuevo.',
      412
    );
  }

  const updated: PropertyDetail = {
    ...current,
    ...dto,
    tags: dto.tags ?? current.tags,
    gallery: dto.gallery ?? current.gallery,
    amenities: dto.amenities ?? current.amenities,
    etag: generateEtag(), // new version
  };

  store[idx] = updated;
  return { ...updated };
}

// ─── API-020: POST /me/propiedades/:id/publicacion ───
export async function changePropertyStatus(
  id: number,
  dto: PublicacionDTO,
  ifMatch: string
): Promise<PropertyDetail> {
  await delay(400 + Math.random() * 200);

  const idx = store.findIndex(p => p.id === id);
  if (idx === -1) {
    throw createApiError('NOT_FOUND', `Propiedad ${id} no encontrada.`, 404);
  }

  const current = store[idx];

  if (current.etag !== ifMatch) {
    throw createApiError(
      'VERSION_OBSOLETA',
      'La propiedad fue modificada por otro proceso. Recarga e intenta de nuevo.',
      412
    );
  }

  // State machine transitions
  const transitions: Record<PropertyStatus, Record<string, PropertyStatus>> = {
    Activa: { pausar: 'Pausada' },
    Pausada: { activar: 'Activa' },
    Borrador: { activar: 'Activa' },
  };

  const nextStatus = transitions[current.status]?.[dto.accion];
  if (!nextStatus) {
    throw createApiError(
      'TRANSICION_INVALIDA',
      `No se puede "${dto.accion}" una propiedad con estado "${current.status}".`,
      422
    );
  }

  const updated: PropertyDetail = {
    ...current,
    status: nextStatus,
    etag: generateEtag(),
  };

  store[idx] = updated;
  return { ...updated };
}
