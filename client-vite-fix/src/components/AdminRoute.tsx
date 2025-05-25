import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spin } from 'antd';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // On limite le temps d'affichage du loader à 2 secondes max
    // Après, on affiche la page même si la vérification n'est pas finie
    const [timeoutReached, setTimeoutReached] = React.useState(false);
    React.useEffect(() => {
      const timer = setTimeout(() => setTimeoutReached(true), 2000);
      return () => clearTimeout(timer);
    }, []);
    if (!timeoutReached) {
      return <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Vérification administrateur..." /></div>;
    }
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute; 