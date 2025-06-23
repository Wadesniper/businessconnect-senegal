import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { hasPremiumAccess } from '../utils/premiumAccess';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiresSubscription?: boolean;
  requiresAdmin?: boolean;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiresSubscription = false, requiresAdmin = false, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const { hasActiveSubscription, loading: loadingSub } = useSubscription();

  if (loading || (requiresSubscription && loadingSub)) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiresAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (requiresSubscription && !hasPremiumAccess(user, hasActiveSubscription)) {
    return <Navigate to="/subscription" replace />;
  }

  return element;
};

export default ProtectedRoute; 