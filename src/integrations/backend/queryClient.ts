import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        (!axios.isAxiosError(error) || !error.response || error.response.status >= 500) &&
        failureCount < 2,
    },
  },
});
