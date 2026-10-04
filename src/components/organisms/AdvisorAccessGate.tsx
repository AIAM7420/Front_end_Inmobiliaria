import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useGetOwnApplication } from '../../integrations/backend/hooks/useAdvisors';
import { useGetSubscription } from '../../integrations/backend/hooks/useSubscriptions';
import { needsAdvisorOnboarding } from '../../integrations/backend/advisorOnboarding';

export function AdvisorAccessGate({ children }: { children: ReactNode }) {
  const { role, isAuthenticated } = useAppContext();
  const enabled = role === 'asesor' && isAuthenticated;
  const application = useGetOwnApplication(enabled), subscription = useGetSubscription(enabled);
  if (!enabled) return children;
  if (application.isError || subscription.isError) return <Navigate to="/registro-asesor" replace />;
  if (!application.data || !subscription.data) return <main role="status" className="min-h-screen flex items-center justify-center bg-white dark:bg-inmo-darkbg text-inmo-secondary dark:text-white">Comprobando tu autorización y suscripción…</main>;
  if (needsAdvisorOnboarding(application.data.value, subscription.data.value)) return <Navigate to="/registro-asesor" replace />;
  return children;
}
