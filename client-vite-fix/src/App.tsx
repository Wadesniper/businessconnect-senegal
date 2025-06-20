import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProLayout } from '@ant-design/pro-layout';
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
const ForumPage = lazy(() => import('./pages/forum/ForumPage'));
const DiscussionDetail = lazy(() => import('./pages/forum/DiscussionDetail'));
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
const FAQ = lazy(() => import('./pages/help/FAQ'));
const CareersPage = lazy(() => import('./pages/careers'));
import AuthPage from './pages/auth/AuthPage';
const CVPreviewGallery = lazy(() => import('./pages/cv-generator/CVPreviewGallery'));
const MarketplaceModeration = lazy(() => import('./components/admin/MarketplaceModeration'));
const UserItems = lazy(() => import('./components/marketplace/UserItems'));

// ErrorBoundary global
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // Log l'erreur côté client
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color:'red',padding:40}}><h1>Une erreur est survenue</h1><pre>{String(this.state.error)}</pre></div>;
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const { hasActiveSubscription } = useSubscription();
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <ProLayout
          layout="top"
          navTheme="light"
          headerRender={() => <Navbar />}
          footerRender={() => <Footer />}
          contentWidth="Fluid"
          style={{ width: '100vw', maxWidth: '100vw' }}
        >
          <Suspense fallback={<></>}>
            <Routes>
              {/* Pages publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/jobs/:id/postuler" element={<JobApplyPage />} />
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
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/forum/:id" element={<DiscussionDetail />} />
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
            </Routes>
          </Suspense>
        </ProLayout>
      </Router>
    </ErrorBoundary>
  );
};

export default App; 