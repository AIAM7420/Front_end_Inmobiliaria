/** IDs BIGINT and monetary decimals are strings in the V1 HTTP contract. */
export type Id = string;
export type Money = string;

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  code: string;
  trace_id: string;
  instance: string;
  detail?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface Pagina<T> {
  items: T[];
  next_cursor: string | null;
}

export interface Cuenta {
  id: Id;
  nombre: string;
  correo: string;
  telefono: string | null;
  rol: 'GENERAL' | 'ASESOR' | 'SUPERADMINISTRADOR';
  estado: 'ACTIVA' | 'INACTIVA';
  version: number;
}

export interface Sesion {
  access_token: string;
  token_type: 'Bearer';
  expires_at: string;
  cuenta: Cuenta;
}

export interface RegistroCuenta {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string | null;
}

export interface InicioSesion {
  correo: string;
  password: string;
}

export interface Aceptada {
  aceptada: true;
}

/** Canonical PropiedadPublica: only the eight required properties are mandatory. */
export interface PropiedadPublica {
  id: Id;
  asesor_id: Id;
  tipo_id: Id;
  operacion_id: Id;
  zona_id: Id;
  titulo: string;
  precio: Money;
  moneda: string;
  descripcion?: string;
  habitaciones?: number;
  banos?: string;
  superficie_terreno?: string | null;
  superficie_construccion?: string | null;
  amenidad_ids?: Id[];
  estado_publicacion?: string;
  visible?: boolean;
  disponible?: boolean;
  comparte_comision?: boolean;
  version?: number;
  actualizada_at?: string;
  colonia?: string | null;
  codigo_postal?: string | null;
  zona_geojson?: Record<string, unknown> | null;
}

export type PaginaPropiedadPublica = Pagina<PropiedadPublica>;

export interface PropiedadPrivada {
  id: Id;
  asesor_id: Id;
  tipo_id: Id;
  operacion_id: Id;
  zona_id: Id;
  titulo: string;
  descripcion: string;
  direccion: string;
  codigo_postal: string | null;
  latitud: string | null;
  longitud: string | null;
  precio: Money;
  moneda: 'MXN';
  habitaciones: number;
  banos: string;
  superficie_terreno: string | null;
  superficie_construccion: string | null;
  amenidad_ids: Id[];
  estado_publicacion: string;
  visible: boolean;
  disponible: boolean;
  motivo_no_disponibilidad: string | null;
  comparte_comision: boolean;
  porcentaje_comision: string | null;
  version: number;
  actualizada_at: string;
}

export interface PropiedadCrear {
  tipo_id: Id;
  operacion_id: Id;
  zona_id: Id;
  titulo: string;
  descripcion: string;
  direccion: string;
  codigo_postal?: string | null;
  latitud?: string | null;
  longitud?: string | null;
  precio: Money;
  moneda: 'MXN';
  habitaciones?: number;
  banos?: string;
  superficie_terreno?: string | null;
  superficie_construccion?: string | null;
  amenidad_ids?: Id[];
}

export type PropiedadEditar = Partial<Omit<PropiedadCrear, 'amenidad_ids'>> & {
  amenidad_ids?: Id[];
};

export interface CatalogoItem {
  id: Id;
  codigo: string;
  nombre: string;
}

export interface Fotografia {
  id: Id;
  posicion: number;
  mime: 'image/jpeg' | 'image/webp';
  tamano_bytes: number;
}

export interface AutorizacionFotografia {
  url: string;
  metodo: 'PUT';
  headers: Record<string, string>;
  comprobante: string;
  expira_at: string;
}

export interface CriteriosBusqueda {
  tipo_id?: Id;
  operacion_id?: Id;
  zona_id?: Id;
  precio_min?: Money;
  precio_max?: Money;
  moneda?: string;
  habitaciones_min?: number;
  banos_min?: string;
  amenidad_ids?: Id[];
}

export interface ChatbotSalida {
  estado: 'RESULTADOS' | 'ACLARACION' | 'SIN_RESULTADOS';
  criterios: {
    tipo_id: Id | null;
    operacion_id: Id | null;
    zona_id: Id | null;
    precio_min: Money | null;
    precio_max: Money | null;
    moneda: string | null;
    habitaciones_min: number | null;
    banos_min: string | null;
    amenidad_ids: Id[];
  };
  aclaracion: string | null;
  resultados: PropiedadPublica[];
}

export type ConversacionCrear =
  | { tipo: 'CLIENTE_ASESOR'; propiedad_id: Id; interes_id?: never; asesor_destino_id?: never }
  | { tipo: 'CLIENTE_ASESOR'; interes_id: Id; propiedad_id?: never; asesor_destino_id?: never }
  | { tipo: 'ASESOR_ASESOR'; asesor_destino_id: Id; propiedad_id?: never; interes_id?: never };

export interface Conversacion {
  id: Id;
  tipo: 'CLIENTE_ASESOR' | 'ASESOR_ASESOR';
  participante_ids: [Id, Id];
  ultima_secuencia: string;
}

export interface Mensaje {
  conversacion_id: Id;
  secuencia: string;
  emisor_id: Id;
  cliente_mensaje_id: string;
  contenido: string;
  persistido_at: string;
}

export interface MensajeCrear {
  cliente_mensaje_id: string;
  contenido: string;
}

export type ChatServerFrame =
  | { type: 'auth.ok'; cuenta_id: Id; expires_at: string }
  | { type: 'message.ack'; mensaje: Mensaje; cliente_mensaje_id: string }
  | { type: 'message.created'; mensaje: Mensaje }
  | { type: 'pong'; nonce: string }
  | { type: 'error'; code: string; trace_id: string; cliente_mensaje_id?: string };

export type ChatClientFrame =
  | { type: 'message.send'; conversacion_id: Id; cliente_mensaje_id: string; contenido: string }
  | { type: 'ping'; nonce: string };
