import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiresSubscription?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiresSubscription = false }) => {
  const { user, loading } = useAuth();
  const { hasActiveSubscription, loading: loadingSub } = useSubscription();

  if (loading || (requiresSubscription && loadingSub)) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiresSubscription && !hasActiveSubscription) {
    return <Navigate to="/subscription" replace />;
  }

  return element;
};

export default ProtectedRoute; 