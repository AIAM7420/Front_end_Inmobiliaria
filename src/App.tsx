import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { Button } from './components/atoms/Button';
import { MainLayout } from './components/templates/MainLayout';
import { NotFoundView } from './components/views/NotFoundView';

const AuthTemplate = lazy(() => import('./components/templates/AuthTemplate').then(m => ({ default: m.AuthTemplate })));
const MapTemplate = lazy(() => import('./components/templates/MapTemplate').then(m => ({ default: m.MapTemplate })));
const FavoritesTemplate = lazy(() => import('./components/templates/FavoritesTemplate').then(m => ({ default: m.FavoritesTemplate })));
const MessagesTemplate = lazy(() => import('./components/templates/MessagesTemplate').then(m => ({ default: m.MessagesTemplate })));
const UIKitTemplate = lazy(() => import('./components/templates/UiKitTemplate').then(m => ({ default: m.UIKitTemplate })));
const AsesorDashboard = lazy(() => import('./components/views/asesor/AsesorOverview').then(m => ({ default: m.AsesorOverview })));
const AsesorInventory = lazy(() => import('./components/views/asesor/AsesorInventoryView').then(m => ({ default: m.AsesorInventoryView })));
const AdminDashboard = lazy(() => import('./components/views/admin/AdminOverview').then(m => ({ default: m.AdminOverview })));
const SplitLandingTemplate = lazy(() => import('./components/templates/SplitLandingTemplate').then(m => ({ default: m.SplitLandingTemplate })));
const PublicProfile = lazy(() => import('./components/templates/PublicProfileTemplate').then(m => ({ default: m.PublicProfileTemplate })));
const AsesorProfile = lazy(() => import('./components/templates/AsesorProfileTemplate').then(m => ({ default: m.AsesorProfileTemplate })));
const AdminProfile = lazy(() => import('./components/templates/AdminProfileTemplate').then(m => ({ default: m.AdminProfileTemplate })));
const AsesorPublicProfile = lazy(() => import('./components/templates/AsesorPublicProfileTemplate').then(m => ({ default: m.AsesorPublicProfileTemplate })));

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

          {/* RUTAS DE PERFIL (PANTALLA COMPLETA) */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['public', 'asesor', 'admin']}>
              <PublicProfile />
            </ProtectedRoute>
          } />
          <Route path="/asesor/profile" element={
            <ProtectedRoute allowedRoles={['asesor']}>
              <AsesorProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin/profile" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/asesores/:id" element={<AsesorPublicProfile />} />

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
            <Route path="/asesor" element={
              <ProtectedRoute allowedRoles={['asesor', 'admin']}>
                <AsesorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/asesor/propiedades" element={
              <ProtectedRoute allowedRoles={['asesor', 'admin']}>
                <AsesorInventory />
              </ProtectedRoute>
            } />
            <Route path="/asesor/mensajes" element={
              <ProtectedRoute allowedRoles={['asesor', 'admin']}>
                <MessagesTemplate />
              </ProtectedRoute>
            } />

            {/* DASHBOARD ADMIN (AHORA USA MAIN LAYOUT) */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* 404 dentro del Layout para mantener la navegación */}
            <Route path="*" element={
              <div className="pt-24 flex-1 h-full">
                <NotFoundView />
              </div>
            } />
          </Route>
          
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