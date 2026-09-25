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
  getPhotoUrl,
  getPhotos,
  getProperties,
  getProperty,
  updateProperty,
  uploadPhotoDirect,
} from '../properties.service';
import type { ListPropertiesParams } from '../properties.service';
import type { Id, PropiedadCrear, PropiedadEditar } from '../types';

export function useGetProperties(params: ListPropertiesParams = {}) {
  return useQuery({
    queryKey: ['properties', 'public', params],
    queryFn: () => getProperties(params),
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
      accion: 'PUBLICAR' | 'PAUSAR' | 'ARCHIVAR';
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
