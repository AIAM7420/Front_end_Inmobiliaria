import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authorizeAdvisorDocument,
  confirmAdvisorDocument,
  decideAdvisorApplication,
  getAdminApplication,
  getAdminApplications,
  getAdminDocumentUrl,
  getOwnAdvisor,
  getOwnApplication,
  registerAdvisor,
  resubmitAdvisorApplication,
  uploadAdvisorDocumentDirect,
} from '../advisors.service';
import type { Id } from '../types';

export function useRegisterAdvisor() {
  return useMutation({ mutationFn: registerAdvisor });
}

export function useGetOwnAdvisor() {
  return useQuery({ queryKey: ['advisor', 'own'], queryFn: getOwnAdvisor, staleTime: 10_000 });
}

export function useGetOwnApplication() {
  return useQuery({ queryKey: ['advisor', 'application'], queryFn: getOwnApplication, staleTime: 10_000 });
}

export function useUploadAdvisorDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tipo, file }: {
      tipo: 'IDENTIFICACION_OFICIAL' | 'CONSTANCIA_ACTIVIDAD_INMOBILIARIA';
      file: File;
    }) => {
      if (file.size < 1 || file.size > 5 * 1024 * 1024 ||
          !['application/pdf', 'image/jpeg', 'image/webp'].includes(file.type)) {
        throw new Error('Usa un PDF, JPEG o WebP de hasta 5 MB.');
      }
      const bytes = await file.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const sha256 = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
      const authorization = await authorizeAdvisorDocument({
        tipo, nombre: file.name, mime: file.type as 'application/pdf' | 'image/jpeg' | 'image/webp',
        tamano_bytes: file.size, sha256,
      });
      await uploadAdvisorDocumentDirect(authorization, file);
      return confirmAdvisorDocument(authorization.comprobante);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['advisor', 'application'] }),
  });
}

export function useResubmitAdvisorApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resubmitAdvisorApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['advisor'] }),
  });
}

export function useGetAdminApplications(params: { limit?: number; cursor?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'applications', params], queryFn: () => getAdminApplications(params), staleTime: 10_000,
  });
}

export function useGetAdminApplication(id: Id) {
  return useQuery({
    queryKey: ['admin', 'application', id], queryFn: () => getAdminApplication(id),
    enabled: Boolean(id), staleTime: 10_000,
  });
}

export function useDecideAdvisorApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision, motivo, etag }: {
      id: Id; decision: 'APROBAR' | 'RECHAZAR'; motivo: string | null; etag: string;
    }) => decideAdvisorApplication(id, decision, motivo, etag),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  });
}

export function useAdminDocumentUrl() {
  return useMutation({ mutationFn: getAdminDocumentUrl });
}
