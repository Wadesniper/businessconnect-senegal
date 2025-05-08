import React from 'react';
import { Card } from 'antd';
import { useSubscription } from '../../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

const JobsPage: React.FC = () => {
  const { hasActiveSubscription, loading } = useSubscription();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !hasActiveSubscription) {
      navigate('/subscription', { replace: true });
    }
  }, [loading, hasActiveSubscription, navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 100 }}>Chargement...</div>;
  }

  return (
    <Card style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Liste des offres d'emploi</h1>
      <p>Cette page affichera la liste des offres d'emploi.</p>
    </Card>
  );
};

export default JobsPage; 