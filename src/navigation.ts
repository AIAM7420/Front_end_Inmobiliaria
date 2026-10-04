/** Shared route inventory; authorization remains enforced by /me and the API. */
export const navigation = {
  public: [{ id: 'home', label: 'Inicio' }, { id: 'map', label: 'Mapa' }, { id: 'favorites', label: 'Favoritos' }, { id: 'messages', label: 'Mensajes' }],
  asesor: [{ id: 'asesor', label: 'Inicio' }, { id: 'inmuebles', label: 'Inmuebles' }, { id: 'map', label: 'Mapa' }, { id: 'asesor/propiedades', label: 'Mi inventario' }, { id: 'asesor/mensajes', label: 'Mensajes' }],
  admin: [{ id: 'admin', label: 'Inicio' }, { id: 'inmuebles', label: 'Inmuebles' }, { id: 'map', label: 'Mapa' }, { id: 'admin/asesores', label: 'Usuarios' }, { id: 'admin/moderacion', label: 'Publicaciones' }, { id: 'admin/finanzas', label: 'Finanzas' }, { id: 'admin/solicitudes', label: 'Autorizaciones' }, { id: 'admin/reportes', label: 'Reportes' }, { id: 'admin/sistema', label: 'Sistema' }],
};
