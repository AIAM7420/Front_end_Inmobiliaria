// ─── React Query hooks for the Properties module ───

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  changePropertyStatus,
} from '../services/propertiesService';
import type {
  PropiedadCrearDTO,
  PropiedadPatchDTO,
  PublicacionDTO,
  ApiError,
} from '../types/property';

// ─── Query keys ───
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: number) => [...propertyKeys.details(), id] as const,
};

// ─── usePropertiesList ───
export function usePropertiesList(filters?: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: propertyKeys.list(filters ?? {}),
    queryFn: () => listProperties(filters),
    staleTime: 30_000,
  });
}

// ─── usePropertyDetail ───
export function usePropertyDetail(id: number | null) {
  return useQuery({
    queryKey: propertyKeys.detail(id!),
    queryFn: () => getPropertyDetail(id!),
    enabled: id !== null && id !== undefined,
    staleTime: 15_000,
  });
}

// ─── useCreateProperty ───
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: PropiedadCrearDTO) => createProperty(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

// ─── useUpdateProperty ───
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: PropiedadPatchDTO; etag: string }) =>
      updateProperty(vars.id, vars.dto, vars.etag),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(vars.id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

// ─── useChangePropertyStatus ───
export function useChangePropertyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: PublicacionDTO; etag: string }) =>
      changePropertyStatus(vars.id, vars.dto, vars.etag),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(vars.id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

/** Helper to check if an error is a 412 VERSION_OBSOLETA */
export function isConflictError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as ApiError).code === 'VERSION_OBSOLETA'
  );
}
