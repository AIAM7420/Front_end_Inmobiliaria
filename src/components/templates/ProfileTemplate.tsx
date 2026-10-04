import { User, Shield, CreditCard, FileCheck, Settings, LifeBuoy, Trash2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AccountSettings } from '../organisms/AccountSettings';
import { ProfileAccountPanel, PreferencesPanel, SecurityPanel } from '../organisms/ProfilePanels';
import { SupportPanel } from '../organisms/SupportPanel';
import { SplitViewLayout } from './SplitViewLayout';
import { useAppContext } from '../../context/AppContext';
import { useGetMe, useLogout } from '../../integrations/backend/hooks/useAuth';
import { Skeleton } from '../atoms/Skeleton';
import { AdvisorValidationView } from '../views/asesor/AdvisorVerificationPanel';
import { AdvisorSubscriptionView } from '../views/asesor/AdvisorSubscriptionView';

export function ProfileTemplate() {
  const me = useGetMe();
  const { role } = useAppContext();
  const logout = useLogout();
  const [params, setParams] = useSearchParams();
  const view = params.get('view') ?? 'account';
  const open = params.has('view');
  const items = [
    { key: 'account', title: 'Información de cuenta', icon: <User /> },
    ...(role === 'asesor' ? [
      { key: 'documents', title: 'Documentación profesional', icon: <FileCheck /> },
      { key: 'plan', title: 'Plan y pagos', icon: <CreditCard /> },
    ] : []),
    { key: 'security', title: 'Seguridad', icon: <Shield /> },
    { key: 'general', title: 'General', icon: <Settings /> },
    { key: 'support', title: 'Ayuda y soporte', icon: <LifeBuoy /> },
    { key: 'close', title: 'Baja permanente', icon: <Trash2 /> },
  ];
  const main = <AccountSettings account={me.data?.value} advisor={role === 'asesor'} view={view} open={open} pending={logout.isPending}
    onSelect={key => { setParams({ view: key }); }} onLogout={() => logout.mutate()} />;
  const detail = view === 'documents' ? <AdvisorValidationView embedded /> : view === 'plan' ? <AdvisorSubscriptionView embedded /> : view === 'general' ? <PreferencesPanel /> : view === 'support' ? <SupportPanel /> : me.isLoading ? <Skeleton className="h-64" /> : me.isError ? <p role="alert" className="p-6">No pudimos cargar tu cuenta.</p> : me.data ? (view === 'security' || view === 'close' ? <SecurityPanel key={view} initial={me.data} permanent={view === 'close'} /> : <ProfileAccountPanel key={me.data.value.id} initial={me.data} />) : null;
  return <SplitViewLayout mainContent={main} sideContent={detail} sidePosition="right" sidePanelWidthClass="w-[70%]" mainPanelWidthClass="md:w-[30%]" bottomSheetHeightMode="content" bottomSheetIsHero={false} bottomSheetNoPadding={false} isOpen={open} onClose={() => setParams({})} sideTitle={items.find(item => item.key === view)?.title ?? 'Mi cuenta'} />;
}
