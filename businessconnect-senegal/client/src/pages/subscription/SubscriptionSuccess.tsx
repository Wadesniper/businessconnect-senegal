import React, { useEffect, useState } from 'react';
import { Result, Button, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { subscriptionService } from '../../services/subscriptionService';
import { paymentService } from '../../services/paymentService';

const SubscriptionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!user) {
        setError('Utilisateur non connecté');
        setLoading(false);
        return;
      }

      try {
        // Récupérer le token de paiement depuis l'URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const type = params.get('type') as 'etudiant' | 'annonceur' | 'employeur';

        if (!token || !type) {
          setError('Informations de paiement manquantes');
          setLoading(false);
          return;
        }

        // Vérifier le statut du paiement
        const isPaymentValid = await paymentService.verifyPayment(token);

        if (isPaymentValid) {
          // Créer ou mettre à jour l'abonnement
          await subscriptionService.subscribe(user.id, type);
          setLoading(false);
        } else {
          setError('Le paiement n\'a pas pu être validé');
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement:', error);
        setError('Une erreur est survenue lors de la validation du paiement');
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location, user]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <Spin size="large" tip="Vérification du paiement en cours..." />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Échec du paiement"
        subTitle={error}
        extra={[
          <Button type="primary" key="console" onClick={() => navigate('/subscription')}>
            Retourner aux abonnements
          </Button>
        ]}
      />
    );
  }

  return (
    <Result
      status="success"
      title="Paiement réussi !"
      subTitle="Votre abonnement a été activé avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités premium."
      extra={[
        <Button type="primary" key="console" onClick={() => navigate('/dashboard')}>
          Aller au tableau de bord
        </Button>,
        <Button key="subscription" onClick={() => navigate('/subscription')}>
          Voir mon abonnement
        </Button>
      ]}
    />
  );
};

export default SubscriptionSuccess; 