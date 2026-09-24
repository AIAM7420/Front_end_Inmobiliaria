import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { MainLayout } from './components/templates/MainLayout';
import { PlaceholderTemplate } from './components/templates/PlaceholderTemplate';

const AuthTemplate = lazy(() => import('./components/templates/AuthTemplate').then(m => ({ default: m.AuthTemplate })));
const ConfirmEmail = lazy(() => import('./components/templates/auth/ConfirmEmailView').then(m => ({ default: m.ConfirmEmailView })));
const NewPassword = lazy(() => import('./components/templates/auth/NewPasswordView').then(m => ({ default: m.NewPasswordView })));
const MapTemplate = lazy(() => import('./components/templates/MapTemplate').then(m => ({ default: m.MapTemplate })));
const FavoritesTemplate = lazy(() => import('./components/templates/FavoritesTemplate').then(m => ({ default: m.FavoritesTemplate })));
const MessagesTemplate = lazy(() => import('./components/templates/MessagesTemplate').then(m => ({ default: m.MessagesTemplate })));
const UIKitTemplate = lazy(() => import('./components/templates/UiKitTemplate').then(m => ({ default: m.UIKitTemplate })));
const AsesorDashboard = lazy(() => import('./components/views/asesor/AsesorOverview').then(m => ({ default: m.AsesorOverview })));
const AdvisorValidation = lazy(() => import('./components/views/asesor/AdvisorValidationView').then(m => ({ default: m.AdvisorValidationView })));
const AdvisorSubscription = lazy(() => import('./components/views/asesor/AdvisorSubscriptionView').then(m => ({ default: m.AdvisorSubscriptionView })));
const AdvisorProperties = lazy(() => import('./components/views/asesor/AdvisorPropertiesView').then(m => ({ default: m.AdvisorPropertiesView })));
const PaymentReturn = lazy(() => import('./components/views/asesor/PaymentReturnView').then(m => ({ default: m.PaymentReturnView })));
const AdminDashboard = lazy(() => import('./components/views/admin/AdminOverview').then(m => ({ default: m.AdminOverview })));
const AdminApplications = lazy(() => import('./components/views/admin/AdminOperationsView').then(m => ({ default: m.AdminApplicationsView })));
const AdminAccounts = lazy(() => import('./components/views/admin/AdminOperationsView').then(m => ({ default: m.AdminAccountsView })));
const AdminProperties = lazy(() => import('./components/views/admin/AdminOperationsView').then(m => ({ default: m.AdminPropertiesView })));
const AdminReports = lazy(() => import('./components/views/admin/AdminOperationsView').then(m => ({ default: m.AdminReportsView })));
const AdminFinance = lazy(() => import('./components/views/admin/AdminOperationsView').then(m => ({ default: m.AdminFinanceView })));
const SplitLandingTemplate = lazy(() => import('./components/templates/SplitLandingTemplate').then(m => ({ default: m.SplitLandingTemplate })));
const Profile = lazy(() => import('./components/views/ProfileView').then(m => ({ default: m.ProfileView })));

// Guardia para proteger rutas según el rol
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, role } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Si no tiene permiso, redirigimos a home o a su dashboard respectivo
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Loader de página completo para Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-inmo-darkbg flex items-center justify-center">
    <div className="w-12 h-12 rounded-full border-4 border-inmo-tertiary border-t-inmo-accent animate-spin"></div>
  </div>
);

function AppRoutes() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rutas Públicas */}
          <Route 
            path="/login" 
            element={<AuthTemplate onLogin={(account) => {
              login(account);
              if (account.rol === 'ASESOR') {
                navigate('/asesor', { replace: true });
              } else if (account.rol === 'SUPERADMINISTRADOR') {
                navigate('/admin', { replace: true });
              } else {
                navigate('/', { replace: true }); 
              }
            }} />} 
          />
          <Route path="/ui-kit" element={<UIKitTemplate onNavigate={() => {}} />} />
          <Route path="/confirmar-correo" element={<ConfirmEmail />} />
          <Route path="/restablecer-contrasena" element={<NewPassword onNavigate={() => navigate('/login')} />} />

          {/* RUTAS PUBLICAS (CON LAYOUT) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<SplitLandingTemplate />} />
            <Route path="/map" element={<MapTemplate />} />
            <Route path="/favorites" element={<FavoritesTemplate />} />
            <Route path="/messages" element={
              <ProtectedRoute allowedRoles={['public', 'asesor']}>
                <MessagesTemplate />
              </ProtectedRoute>
            } />

            <Route path="/asesor/mensajes" element={
              <ProtectedRoute allowedRoles={['asesor']}><MessagesTemplate /></ProtectedRoute>
            } />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/asesor/validacion" element={
              <ProtectedRoute allowedRoles={['asesor']}><AdvisorValidation /></ProtectedRoute>
            } />
            <Route path="/asesor/suscripcion" element={
              <ProtectedRoute allowedRoles={['asesor']}><AdvisorSubscription /></ProtectedRoute>
            } />
            <Route path="/pagos/exito" element={<ProtectedRoute allowedRoles={['asesor']}><PaymentReturn /></ProtectedRoute>} />
            <Route path="/pagos/cancelado" element={<ProtectedRoute allowedRoles={['asesor']}><PaymentReturn /></ProtectedRoute>} />
            <Route path="/asesor/propiedades" element={
              <ProtectedRoute allowedRoles={['asesor']}><AdvisorProperties /></ProtectedRoute>
            } />
            <Route path="/asesor" element={
              <ProtectedRoute allowedRoles={['asesor', 'admin']}>
                <AsesorDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/solicitudes" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminApplications /></ProtectedRoute>
            } />
            <Route path="/admin/cuentas" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminAccounts /></ProtectedRoute>
            } />
            <Route path="/admin/propiedades" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminProperties /></ProtectedRoute>
            } />
            <Route path="/admin/reportes" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>
            } />
            <Route path="/admin/finanzas" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminFinance /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route path="*" element={<div className="min-h-screen bg-gray-50 dark:bg-inmo-darkbg flex flex-col"><PlaceholderTemplate type="404" /></div>} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
