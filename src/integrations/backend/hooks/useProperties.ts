import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authorizePhoto,
  changeAvailability,
  changeCommission,
  changePublication,
  confirmPhoto,
  createProperty,
  getCatalog,
  getInverseMatches,
  getOwnProperties,
  getOwnProperty,
  getOwnPhotos,
  getOwnPhotoUrl,
  getPhotoUrl,
  getPhotos,
  getProperties,
  getProperty,
  updateProperty,
  uploadPhotoDirect,
  trashProperty,
  retireProperty,
  reorderInventory,
  reorderPhotos,
  deletePhoto,
  getSharedCommissions,
} from '../properties.service';
import type { ListPropertiesParams } from '../properties.service';
import type { Id, PropiedadCrear, PropiedadEditar } from '../types';

export function useGetProperties(params: ListPropertiesParams = {}, enabled = true) {
  return useQuery({
    queryKey: ['properties', 'public', params],
    queryFn: () => getProperties(params),
    enabled,
    staleTime: 30_000,
  });
}

export function useGetProperty(id: Id) {
  return useQuery({
    queryKey: ['properties', 'public', id],
    queryFn: () => getProperty(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function useGetCatalog(catalog: string) {
  return useQuery({
    queryKey: ['catalogs', catalog],
    queryFn: () => getCatalog(catalog),
    enabled: Boolean(catalog),
    staleTime: 24 * 60 * 60 * 1_000,
  });
}

export function useGetOwnProperties(params: ListPropertiesParams = {}) {
  return useQuery({
    queryKey: ['properties', 'own', params],
    queryFn: () => getOwnProperties(params),
    staleTime: 10_000,
  });
}

export function useGetOwnProperty(id: Id) {
  return useQuery({
    queryKey: ['properties', 'own', id],
    queryFn: () => getOwnProperty(id),
    enabled: Boolean(id),
    staleTime: 10_000,
  });
}

/** Filter the complete inventory, not just the first page. The API remains paginated. */
export function useGetInventory() {
  return useQuery({
    queryKey: ['properties', 'own', 'inventory'],
    queryFn: async ({ signal }) => {
      const items: import('../types').PropiedadPrivada[] = [];
      const seen = new Set<string>();
      let cursor: string | undefined;
      do {
        signal.throwIfAborted();
        const page = await getOwnProperties({ limit: 100, cursor }, signal);
        items.push(...page.items);
        cursor = page.next_cursor ?? undefined;
        if (cursor && seen.has(cursor)) throw new Error('No pudimos completar el inventario. Vuelve a cargarlo.');
        if (cursor) seen.add(cursor);
      } while (cursor);
      return { items: [...new Map(items.map(item => [item.id, item])).values()], next_cursor: null };
    },
    staleTime: 10_000,
  });
}

export function usePropertyManagement() {
  const client = useQueryClient();
  const invalidate = async (excludedId?: Id) => {
    // Existing signed URLs remain valid when metadata changes. Refetching obsolete
    // photo URLs before the list updates races a successful deletion with a 404.
    await client.invalidateQueries({ queryKey: ['properties'], predicate: query => !['photo-url', 'own-photo-url'].includes(String(query.queryKey[1])) && (!excludedId || !query.queryKey.includes(excludedId)) });
    await client.invalidateQueries({ queryKey: ['shared-commissions'] });
  };
  const retire = useMutation({ mutationFn: ({ id, etag }: { id: Id; etag: string }) => retireProperty(id, etag), onSuccess: async (_result, { id }) => {
    client.setQueriesData<{ items: { id: Id }[] }>({ queryKey: ['properties'] }, value => value && Array.isArray(value.items) ? { ...value, items: value.items.filter(item => item.id !== id) } : value);
    await invalidate(id);
    client.removeQueries({ predicate: query => query.queryKey[0] === 'properties' && query.queryKey.includes(id) });
  } });
  const inventoryOrder = useMutation({ mutationFn: reorderInventory, onSuccess: () => invalidate() });
  const photoOrder = useMutation({ mutationFn: ({ id, ids, etag }: { id: Id; ids: Id[]; etag: string }) => reorderPhotos(id, ids, etag), onSuccess: () => invalidate() });
  const removePhoto = useMutation({ mutationFn: ({ id, photoId, etag }: { id: Id; photoId: Id; etag: string }) => deletePhoto(id, photoId, etag), onSuccess: async (_result, { id, photoId }) => {
    for (const scope of ['photos', 'own-photos']) client.setQueryData<import('../types').Fotografia[]>(['properties', scope, id], photos => photos?.filter(photo => photo.id !== photoId).map((photo, index) => ({ ...photo, posicion: index + 1 })));
    await invalidate();
    for (const scope of ['photo-url', 'own-photo-url']) client.removeQueries({ queryKey: ['properties', scope, id, photoId], exact: true });
  } });
  return { retire, inventoryOrder, photoOrder, removePhoto };
}

export function useSharedCommissions(enabled: boolean) {
  return useQuery({ queryKey: ['shared-commissions'], enabled, queryFn: async () => {
    const items: import('../types').PropiedadComision[] = [];
    const seen = new Set<string>();
    let cursor: string | undefined;
    do {
      const page = await getSharedCommissions({ limit: 100, cursor });
      items.push(...page.items);
      cursor = page.next_cursor ?? undefined;
      if (cursor && seen.has(cursor)) throw new Error('No pudimos completar las comisiones.');
      if (cursor) seen.add(cursor);
    } while (cursor);
    return [...new Map(items.map(item => [item.id, item])).values()];
  } });
}

export function useTrashProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, etag }: { id: Id; etag: string }) => trashProperty(id, etag),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
}

export function useGetOwnPhotoUrl(propertyId: Id, photoId: Id, enabled = true) {
  return useQuery({
    queryKey: ['properties', 'own-photo-url', propertyId, photoId],
    queryFn: () => getOwnPhotoUrl(propertyId, photoId),
    enabled: enabled && Boolean(propertyId && photoId),
    staleTime: 60_000,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PropiedadCrear) => createProperty(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload, etag }: { id: Id; payload: PropiedadEditar; etag: string }) =>
      updateProperty(id, payload, etag),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
}

export function useChangePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accion, etag, visible }: {
      id: Id;
      accion: 'PUBLICAR' | 'PAUSAR' | 'ARCHIVAR' | 'RESTAURAR';
      etag: string;
      visible?: boolean;
    }) => changePublication(id, accion, etag, visible),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
}

export function useChangeAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, disponible, motivo, etag }: { id: Id; disponible: boolean; motivo: string | null; etag: string }) =>
      changeAvailability(id, disponible, motivo, etag),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
}

export function useChangeCommission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comparteComision, porcentaje, etag }: {
      id: Id; comparteComision: boolean; porcentaje: string | null; etag: string;
    }) => changeCommission(id, comparteComision, porcentaje, etag),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
}

export function useAuthorizePhoto() {
  return useMutation({ mutationFn: ({ propertyId, payload }: {
    propertyId: Id;
    payload: { nombre: string; mime: 'image/jpeg' | 'image/webp'; tamano_bytes: number; sha256: string };
  }) => authorizePhoto(propertyId, payload) });
}

export function useConfirmPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ propertyId, comprobante }: { propertyId: Id; comprobante: string }) =>
      confirmPhoto(propertyId, comprobante),
    onSuccess: (_photo, input) => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'photos', input.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties', 'own-photos', input.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties', 'own', input.propertyId] });
    },
  });
}

export function useUploadPropertyPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ propertyId, file }: { propertyId: Id; file: File }) => {
      if (file.size < 1 || file.size > 5 * 1024 * 1024 ||
          !['image/jpeg', 'image/webp'].includes(file.type)) {
        throw new Error('Usa una fotografía JPEG o WebP de hasta 5 MB.');
      }
      const bytes = await file.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const sha256 = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
      const authorization = await authorizePhoto(propertyId, {
        nombre: file.name, mime: file.type as 'image/jpeg' | 'image/webp',
        tamano_bytes: file.size, sha256,
      });
      await uploadPhotoDirect(authorization, file);
      return confirmPhoto(propertyId, authorization.comprobante);
    },
    onSuccess: async (_photo, { propertyId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['properties', 'photos', propertyId] }),
        queryClient.invalidateQueries({ queryKey: ['properties', 'own-photos', propertyId] }),
        queryClient.invalidateQueries({ queryKey: ['properties', 'own'] }),
      ]);
    },
  });
}

export function useGetPhotos(propertyId: Id, enabled = true) {
  return useQuery({
    queryKey: ['properties', 'photos', propertyId],
    queryFn: () => getPhotos(propertyId),
    enabled: enabled && Boolean(propertyId),
    staleTime: 30_000,
  });
}

export function useGetOwnPhotos(propertyId: Id, enabled = true) {
  return useQuery({
    queryKey: ['properties', 'own-photos', propertyId],
    queryFn: () => getOwnPhotos(propertyId),
    enabled: enabled && Boolean(propertyId),
    staleTime: 30_000,
  });
}

export function useGetPhotoUrl(propertyId: Id, photoId: Id, enabled = true) {
  return useQuery({
    queryKey: ['properties', 'photo-url', propertyId, photoId],
    queryFn: () => getPhotoUrl(propertyId, photoId),
    enabled: enabled && Boolean(propertyId && photoId),
    staleTime: 60_000,
  });
}

export function useGetInverseMatches(propertyId: Id, enabled = true) {
  return useQuery({
    queryKey: ['properties', 'inverse-matches', propertyId],
    queryFn: () => getInverseMatches(propertyId),
    enabled: enabled && Boolean(propertyId), staleTime: 30_000,
  });
}
