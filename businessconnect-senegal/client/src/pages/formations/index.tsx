import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, message } from 'antd';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';
import { useAuth } from '../../hooks/useAuth';
import { formations } from './data';
import type { Formation } from './types';
import styles from './Formations.module.css';
import { useSubscription } from '../../hooks/useSubscription';

interface User {
  subscription?: {
    status: 'active' | 'inactive' | 'expired';
  };
}

const FormationsPage: React.FC = () => {
  const { user } = useAuth() as { user: User | null };
  const navigate = useNavigate();
  const { hasActiveSubscription, loading } = useSubscription();

  const handleFormationClick = (formation: Formation) => {
    if (!user) {
      message.info('Veuillez vous connecter pour accéder aux formations');
      navigate('/auth/login');
      return;
    }

    if (user.subscription?.status !== 'active') {
      message.info('Abonnez-vous pour accéder aux formations');
      navigate('/subscription');
      return;
    }

    window.open(formation.cursaLink, '_blank');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 100 }}>Chargement...</div>;
  }

  return (
    <div className={styles.container}>
      <Title level={1} className={styles.title}>
        Nos Formations Certifiantes
      </Title>
      <Paragraph className={styles.subtitle}>
        Développez vos compétences professionnelles avec nos formations en ligne
      </Paragraph>
      
      {!user && (
        <div className={styles.warning}>
          <Paragraph type="warning" className={styles.warningText}>
            Connectez-vous et abonnez-vous pour accéder à toutes nos formations
          </Paragraph>
                      </div>
                    )}

      {user && user.subscription?.status !== 'active' && (
        <div className={styles.warning}>
          <Paragraph type="warning" className={styles.warningText}>
            Abonnez-vous pour accéder à toutes nos formations
            </Paragraph>
            <Button 
              type="primary" 
              onClick={() => navigate('/subscription')}
            className={styles.subscribeButton}
            >
              S'abonner maintenant
            </Button>
          </div>
        )}
      
      {!hasActiveSubscription && (
        <div style={{ color: 'red', marginBottom: 20 }}>
          Seuls les abonnés peuvent accéder aux détails des formations et être redirigés vers Cursa.
        </div>
      )}
      
      <div className={styles.grid}>
        {formations.map((formation) => (
          <Card
            key={formation.id}
            className={styles.card}
            title={formation.title}
            hoverable
          >
            <Paragraph className={styles.description}>
              {formation.description}
            </Paragraph>
            <div className={styles.cardFooter}>
              {hasActiveSubscription ? (
                <Button
                  type="primary"
                  onClick={() => handleFormationClick(formation)}
                  className={styles.accessButton}
                >
                  Accéder au cours
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => handleFormationClick(formation)}
                  className={styles.accessButton}
                  disabled
                >
                  S'abonner pour accéder
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FormationsPage; 