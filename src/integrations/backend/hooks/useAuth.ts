import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  confirmEmail,
  getMe,
  login,
  logout,
  registerAccount,
  requestPasswordRecovery,
  resetPassword,
  updateMe,
} from '../auth.service';
import { expireSession, getAccessToken, setAccessToken } from '../axios.config';

export function useRegisterAccount() {
  return useMutation({ mutationFn: registerAccount });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setAccessToken(session.access_token);
      queryClient.clear();
      queryClient.setQueryData(['auth', 'me'], {
        value: session.cuenta,
        etag: `"v${session.cuenta.version}"`,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      expireSession();
    },
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    enabled: getAccessToken() !== null,
    staleTime: 15_000,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, etag }: {
      payload: { nombre?: string; telefono?: string | null };
      etag: string;
    }) => updateMe(payload, etag),
    onSuccess: (result) => queryClient.setQueryData(['auth', 'me'], result),
  });
}

export function useConfirmEmail() {
  return useMutation({ mutationFn: confirmEmail });
}

export function useRequestPasswordRecovery() {
  return useMutation({ mutationFn: requestPasswordRecovery });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, nueva_contrasena }: { token: string; nueva_contrasena: string }) =>
      resetPassword(token, nueva_contrasena),
  });
}
