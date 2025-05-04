import React from 'react';
import { Route, Navigate, RouteProps, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { message } from 'antd';

interface ProtectedRouteProps extends Omit<RouteProps, 'element'> {
  element: React.ReactElement;
  requiredRole?: string;
  requiresSubscription?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
  requiresSubscription = false,
  ...rest
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    message.warning('Veuillez vous connecter pour accéder à cette page');
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (requiresSubscription && (!user?.subscription || user.subscription.status !== 'active')) {
    message.warning('Cette fonctionnalité est réservée aux abonnés Premium');
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  if (requiredRole && (!user?.role || user.role !== requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute; 