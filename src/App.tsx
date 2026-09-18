import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { Button } from './components/atoms/Button';
import { MainLayout } from './components/templates/MainLayout';
import { PlaceholderTemplate } from './components/templates/PlaceholderTemplate';

const AuthTemplate = lazy(() => import('./components/templates/AuthTemplate').then(m => ({ default: m.AuthTemplate })));
const MapTemplate = lazy(() => import('./components/templates/MapTemplate').then(m => ({ default: m.MapTemplate })));
const FavoritesTemplate = lazy(() => import('./components/templates/FavoritesTemplate').then(m => ({ default: m.FavoritesTemplate })));
const MessagesTemplate = lazy(() => import('./components/templates/MessagesTemplate').then(m => ({ default: m.MessagesTemplate })));
const UIKitTemplate = lazy(() => import('./components/templates/UiKitTemplate').then(m => ({ default: m.UIKitTemplate })));
const AsesorDashboard = lazy(() => import('./components/views/asesor/AsesorOverview').then(m => ({ default: m.AsesorOverview })));
const AdminDashboard = lazy(() => import('./components/views/admin/AdminOverview').then(m => ({ default: m.AdminOverview })));
const SplitLandingTemplate = lazy(() => import('./components/templates/SplitLandingTemplate').then(m => ({ default: m.SplitLandingTemplate })));

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

// Componente para el Botón Flotante Global (UI Kit)
const FloatingGlobalButton = () => {
  const location = useLocation();
  const isUIKit = location.pathname === '/ui-kit';

  return (
    <Button
      // Si estamos en ui-kit usamos navigate(-1) (o navigate('/')) desde un wrapper,
      // pero como es global, podemos usar un enlace normal o Link.
      // Por simplicidad en este botón, usaremos window.history para ir atrás.
      onClick={() => {
        if (isUIKit) {
          window.history.back();
        } else {
          window.location.href = '/ui-kit';
        }
      }}
      variant="secondary"
      className="fixed bottom-24 right-4 z-[100] !bg-inmo-secondary dark:!bg-inmo-darkcard !text-white !px-4 !py-2 !rounded-full !shadow-lg !font-inter !font-bold !text-sm hover:scale-105 active:scale-95 transition-all !w-auto !h-auto"
    >
      {isUIKit ? 'Ver App' : 'Ver UI Kit'}
    </Button>
  );
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
            element={<AuthTemplate onLogin={(role) => { 
              login(role || 'public'); 
              if (role === 'asesor') {
                navigate('/asesor', { replace: true });
              } else if (role === 'admin') {
                navigate('/admin', { replace: true });
              } else {
                navigate('/', { replace: true }); 
              }
            }} />} 
          />
          <Route path="/ui-kit" element={<UIKitTemplate onNavigate={() => {}} />} />

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

            {/* DASHBOARD ASESOR (AHORA USA MAIN LAYOUT) */}
            <Route path="/asesor/*" element={
              <ProtectedRoute allowedRoles={['asesor', 'admin']}>
                <AsesorDashboard />
              </ProtectedRoute>
            } />

            {/* DASHBOARD ADMIN (AHORA USA MAIN LAYOUT) */}
            <Route path="/admin/*" element={
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