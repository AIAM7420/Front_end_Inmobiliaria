import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPayment, createPortalSession, getPlans, getSubscription, selectPlan } from '../subscriptions.service';
import type { Id } from '../types';

export function useGetPlans() {
  return useQuery({ queryKey: ['plans'], queryFn: getPlans, staleTime: 60 * 60 * 1_000 });
}

export function useGetSubscription() {
  return useQuery({ queryKey: ['subscription', 'own'], queryFn: getSubscription, staleTime: 10_000 });
}

export function useSelectPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ versionPlanId, etag }: { versionPlanId: Id; etag: string }) => selectPlan(versionPlanId, etag),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscription'] }),
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: ({ versionPlanId, requestId }: { versionPlanId: Id; requestId: string }) =>
      createPayment(versionPlanId, requestId),
  });
}

export function useCreatePortalSession() {
  return useMutation({ mutationFn: createPortalSession });
}
