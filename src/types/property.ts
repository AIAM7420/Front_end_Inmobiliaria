// ─── Types & DTOs for Properties Module ───

export type PropertyStatus = 'Activa' | 'Pausada' | 'Borrador';
export type PropertyType = 'casa' | 'departamento' | 'terreno' | 'oficina' | 'local';
export type OperationType = 'venta' | 'renta';
export type TagVariant = 'venta' | 'renta' | 'nuevo' | 'success' | 'secondary' | 'primary';

export interface PropertyTag {
  text: string;
  variant: TagVariant;
}

/** Shape of a property as returned by the listing API (API-016) */
export interface PropertySummary {
  id: number;
  image: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: PropertyType | string;
  operationType?: OperationType;
  lat?: number;
  lng?: number;
  isFavorite?: boolean;
  tags: PropertyTag[];
  status: PropertyStatus;
  views: number;
  messages: number;
}

/** Full detail as returned by API-017 — includes etag */
export interface PropertyDetail extends PropertySummary {
  description?: string;
  propertyType?: string;
  gallery?: string[];
  amenities?: string[];
  etag: string;
}

/** DTO for creating a new property (API-018) */
export interface PropiedadCrearDTO {
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: PropertyType | string;
  operationType?: OperationType;
  propertyType?: string;
  description?: string;
  lat?: number;
  lng?: number;
  image?: string;
  gallery?: string[];
  tags?: PropertyTag[];
  amenities?: string[];
}

/** DTO for patching a property (API-019) */
export interface PropiedadPatchDTO {
  title?: string;
  location?: string;
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  type?: PropertyType | string;
  operationType?: OperationType;
  propertyType?: string;
  description?: string;
  lat?: number;
  lng?: number;
  image?: string;
  gallery?: string[];
  tags?: PropertyTag[];
  amenities?: string[];
}

/** DTO for publishing/state change (API-020) */
export interface PublicacionDTO {
  accion: 'activar' | 'pausar';
}

/** Paginated list response shape */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** API error shape */
export interface ApiError {
  code: string;
  message: string;
  status: number;
}
