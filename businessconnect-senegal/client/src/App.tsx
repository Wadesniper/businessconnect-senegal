import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SubscriptionPage from './pages/subscription';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentCancel from './pages/payment/PaymentCancel';
import PrivateRoute from './components/PrivateRoute';
import MarketplacePage from './pages/marketplace/MarketplacePage';
import MarketplaceItemPage from './pages/marketplace/MarketplaceItemPage';
import ForumPage from './pages/forum/ForumPage';
import DiscussionDetail from './pages/forum/DiscussionDetail';
import ContactPage from './pages/contact';
import AdminPage from './pages/admin';
import MentionsLegales from './pages/legal/MentionsLegales';
import CGV from './pages/legal/CGV';
import CGU from './pages/legal/CGU';
import Privacy from './pages/legal/Privacy';
import Cookies from './pages/legal/Cookies';
import { authService } from './services/authService';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Navbar />
          <Content>
            <Routes>
              {/* Page d'accueil */}
              <Route path="/" element={<Home />} />

              {/* Routes publiques */}
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/:id" element={<MarketplaceItemPage />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/forum/:id" element={<DiscussionDetail />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Pages légales */}
              <Route path="/legal/mentions-legales" element={<MentionsLegales />} />
              <Route path="/legal/cgv" element={<CGV />} />
              <Route path="/legal/cgu" element={<CGU />} />
              <Route path="/legal/privacy" element={<Privacy />} />
              <Route path="/legal/cookies" element={<Cookies />} />

              {/* Routes protégées */}
              <Route
                path="/marketplace/create"
                element={
                  <PrivateRoute>
                    <MarketplacePage />
                  </PrivateRoute>
                }
              />

              {/* Route d'administration */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />

              {/* Authentification */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              
              {/* Routes protégées */}
              <Route 
                path="/payment/success" 
                element={
                  <PrivateRoute>
                    <PaymentSuccess />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/payment/cancel" 
                element={
                  <PrivateRoute>
                    <PaymentCancel />
                  </PrivateRoute>
                } 
              />

              {/* Page 404 */}
              <Route path="*" element={<div>Page non trouvée</div>} />
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App; 