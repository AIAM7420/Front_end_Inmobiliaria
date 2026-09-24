import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  changeAdminAccountState, getAdminAccount, getAdminAccounts, getAdminProperties, getAdminProperty,
  getAdminReports, getAdminSubscriptions, getAdminAudit, moderateAdminProperty, resolveAdminReport,
} from '../administration.service';
import type { PageParams } from '../administration.service';
import type { Id } from '../types';

export function useGetAdminAccounts(params: PageParams = {}) {
  return useQuery({
    queryKey: ['admin', 'accounts', params],
    queryFn: () => getAdminAccounts(params),
    staleTime: 10_000,
  });
}

export function useGetAdminReports(params: PageParams & { estado?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'reports', params],
    queryFn: () => getAdminReports(params),
    staleTime: 10_000,
  });
}

export function useGetAdminAccount(id: Id) {
  return useQuery({
    queryKey: ['admin', 'account', id], queryFn: () => getAdminAccount(id), enabled: Boolean(id), staleTime: 10_000,
  });
}

export function useChangeAdminAccountState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accion, motivo, etag }: {
      id: Id; accion: 'ACTIVAR' | 'INACTIVAR'; motivo: string; etag: string;
    }) => changeAdminAccountState(id, accion, motivo, etag),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  });
}

export function useResolveAdminReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accion, motivo }: {
      id: Id;
      accion: 'DESCARTAR' | 'PAUSAR_PROPIEDAD' | 'DESACTIVAR_CUENTA' | 'OCULTAR_MENSAJE';
      motivo: string;
    }) => resolveAdminReport(id, accion, motivo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  });
}

export function useGetAdminProperty(id: Id) {
  return useQuery({
    queryKey: ['admin', 'property', id], queryFn: () => getAdminProperty(id), enabled: Boolean(id), staleTime: 10_000,
  });
}

export function useGetAdminProperties(params: PageParams & { estado?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'properties', params], queryFn: () => getAdminProperties(params), staleTime: 10_000,
  });
}

export function useModerateAdminProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accion, motivo, etag }: {
      id: Id; accion: 'PAUSAR' | 'ARCHIVAR'; motivo: string; etag: string;
    }) => moderateAdminProperty(id, accion, motivo, etag),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  });
}

export function useGetAdminSubscriptions(params: PageParams = {}) {
  return useQuery({
    queryKey: ['admin', 'subscriptions', params], queryFn: () => getAdminSubscriptions(params), staleTime: 10_000,
  });
}

export function useGetAdminAudit(params: PageParams = {}) {
  return useQuery({
    queryKey: ['admin', 'audit', params], queryFn: () => getAdminAudit(params), staleTime: 10_000,
  });
}
