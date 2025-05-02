import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { message } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresSubscription = false 
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    message.warning('Veuillez vous connecter pour accéder à cette page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresSubscription && !(user?.subscription && user.subscription.status === 'active' && new Date(user.subscription.expiresAt) > new Date())) {
    message.warning('Cette fonctionnalité est réservée aux abonnés Premium');
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 