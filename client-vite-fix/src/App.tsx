import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProLayout } from '@ant-design/pro-layout';
import { Spin } from 'antd';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useSubscription } from './hooks/useSubscription';
import ScrollToTop from './components/ScrollToTop';
// Lazy load des pages principales
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LoginForm = lazy(() => import('./components/LoginForm'));
const RegisterForm = lazy(() => import('./components/RegisterForm'));
const SubscriptionPage = lazy(() => import('./pages/subscription/SubscriptionPage'));
const PaymentSuccess = lazy(() => import('./pages/payment/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/payment/PaymentCancel'));
const PaymentReturnPage = lazy(() => import('./pages/payment/PaymentReturnPage'));
const MarketplacePage = lazy(() => import('./pages/marketplace/MarketplacePage'));
const MarketplaceItemPage = lazy(() => import('./pages/marketplace/MarketplaceItemPage'));
const ContactPage = lazy(() => import('./pages/contact'));
const MentionsLegales = lazy(() => import('./pages/legal/MentionsLegales'));
const CGV = lazy(() => import('./pages/legal/CGV'));
const CGU = lazy(() => import('./pages/legal/CGU'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const Cookies = lazy(() => import('./pages/legal/Cookies'));
const JobsPage = lazy(() => import('./pages/jobs/JobsPage'));
const FormationsPage = lazy(() => import('./pages/formations/FormationsPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/404'));
const CVGenerator = lazy(() => import('./pages/cv-generator'));
import JobDetailsPage from './pages/jobs/JobDetailsPage';
import JobApplyPage from './pages/jobs/JobApplyPage';
import PublishJobPage from './pages/jobs/PublishJobPage';
import EditJobPage from './pages/jobs/EditJobPage';
const FAQ = lazy(() => import('./pages/help/FAQ'));
const CareersPage = lazy(() => import('./pages/careers'));
import AuthPage from './pages/auth/AuthPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
const CVPreviewGallery = lazy(() => import('./pages/cv-generator/CVPreviewGallery'));
const MarketplaceModeration = lazy(() => import('./components/admin/MarketplaceModeration'));
const UserItems = lazy(() => import('./components/marketplace/UserItems'));
const MyJobsPage = lazy(() => import('./pages/jobs/MyJobsPage'));

// ErrorBoundary global
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    // Intercepter les erreurs de modules dynamiques et les gérer silencieusement
    if (error && typeof error.message === 'string') {
      if (
        error.message.includes('dynamically imported module') ||
        error.message.includes('import()') ||
        error.message.includes('Module not found') ||
        error.message.includes('ChunkLoadError') ||
        error.message.includes('Loading chunk')
      ) {
        console.error('Erreur module dynamique interceptée:', error.message);
        // Ne pas afficher l'erreur à l'utilisateur, juste recharger
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        return { hasError: false, error: null }; // Pas d'erreur affichée
      }
    }
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // Log l'erreur côté client
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          color:'red',
          padding: 40,
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7faff'
        }}>
          <h1 style={{ fontSize: 24, marginBottom: 16 }}>Une erreur est survenue</h1>
          <div style={{ 
            fontSize: 14, 
            color: '#666', 
            marginBottom: 24,
            maxWidth: 400,
            lineHeight: 1.5
          }}>
            {String(this.state.error).includes('ChunkLoadError') || 
             String(this.state.error).includes('Loading chunk') ||
             String(this.state.error).includes('dynamically imported module') ? 
              "Problème de chargement détecté. Cela peut arriver sur mobile." :
              "Une erreur inattendue s'est produite."
            }
          </div>
          <button
            style={{
              marginTop: 24,
              padding: '12px 24px',
              fontSize: 16,
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              marginBottom: 16
            }}
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
          <div style={{marginTop: 16, fontSize: 14, color: '#333', maxWidth: 400}}>
            Si le problème persiste :<br/>
            • Essayez de vider le cache de votre navigateur<br/>
            • Connectez-vous sur un autre appareil<br/>
            • Contactez le support : <b>contact@businessconnectsenegal.com</b>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loader global pour le Suspense
const GlobalLoader = () => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: '#f7faff'
  }}>
    <Spin size="large" />
    <div style={{ marginTop: 24, fontSize: 18, color: '#1890ff' }}>Chargement...</div>
  </div>
);

const App: React.FC = () => {
  const { hasActiveSubscription } = useSubscription();
  React.useEffect(() => {
    // SUPPRIMER : VersionService qui cause les rechargements automatiques
    // VersionService.start();
    // const checkOnFocus = () => VersionService.check();
    // window.addEventListener('focus', checkOnFocus);
    // document.addEventListener('visibilitychange', () => {
    //   if (document.visibilityState === 'visible') VersionService.check();
    // });
    // return () => {
    //   window.removeEventListener('focus', checkOnFocus);
    //   document.removeEventListener('visibilitychange', checkOnFocus);
    // };
  }, []);
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <ProLayout
        layout="top"
        navTheme="light"
        headerRender={() => <Navbar />}
        footerRender={() => <Footer />}
        contentWidth="Fluid"
        style={{ width: '100vw', maxWidth: '100vw' }}
      >
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            {/* Pages publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/jobs/:id/postuler" element={<JobApplyPage />} />
            <Route 
              path="/jobs/publish" 
              element={
                <ProtectedRoute 
                  element={<PublishJobPage />} 
                  allowedRoles={['admin', 'recruteur']} 
                />
              } 
            />
            <Route 
              path="/jobs/edit/:id" 
              element={
                <ProtectedRoute 
                  element={<EditJobPage />} 
                  allowedRoles={['admin', 'recruteur']} 
                />
              } 
            />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:id" element={<MarketplaceItemPage />} />
            <Route path="/marketplace/create" element={<MarketplacePage />} />
            <Route path="/marketplace/edit/:id" element={<MarketplacePage />} />
            <Route
              path="/marketplace/user/items"
              element={
                <ProtectedRoute element={<UserItems />} />
              }
            />
            <Route
              path="/admin/marketplace/moderation"
              element={
                <ProtectedRoute element={<MarketplaceModeration />} requiresAdmin />
              }
            />
            <Route path="/formations" element={<FormationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cv-generator" element={<CVGenerator isSubscribed={hasActiveSubscription} />} />
            <Route path="/careers" element={<CareersPage />} />

            {/* Pages légales */}
            <Route path="/legal/mentions-legales" element={<MentionsLegales />} />
            <Route path="/legal/cgv" element={<CGV />} />
            <Route path="/legal/cgu" element={<CGU />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/cookies" element={<Cookies />} />

            {/* Routes d'authentification */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/register" element={<Navigate to="/auth" replace />} />

            {/* Routes protégées */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute element={<ProfilePage />} requiresSubscription />
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute element={<Dashboard />} requiresSubscription />
              }
            />
            <Route
              path="/cv-generator/create"
              element={
                <ProtectedRoute element={<CVGenerator />} requiresSubscription />
              }
            />
            <Route
              path="/subscription"
              element={
                <SubscriptionPage />
              }
            />
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute element={<PaymentSuccess />} requiresSubscription />
              }
            />
            <Route
              path="/payment/cancel"
              element={
                <ProtectedRoute element={<PaymentCancel />} requiresSubscription />
              }
            />
            <Route
              path="/payment/return"
              element={<PaymentReturnPage />}
            />

            {/* Page 404 */}
            <Route path="*" element={<NotFoundPage />} />

            {/* New route */}
            <Route path="/help/FAQ" element={<FAQ />} />

            {/* New route */}
            <Route path="/cv-preview/:templateId" element={<CVPreviewGallery />} />

            {/* New route */}
            <Route 
              path="/jobs/my-jobs" 
              element={
                <ProtectedRoute 
                  element={<MyJobsPage />} 
                  allowedRoles={['admin', 'recruteur']} 
                />
              } 
            />
          </Routes>
        </Suspense>
      </ProLayout>
    </ErrorBoundary>
  );
};

export default App; 