import React, { useEffect } from 'react';
import { Result, Button, Space } from 'antd';
import { CheckCircleOutlined, HomeOutlined, FileOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';

const StyledResult = styled(Result)`
  padding: 48px 32px;
  
  .ant-result-icon {
    .anticon {
      font-size: 72px;
      color: #52c41a;
    }
  }
`;

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const ref = searchParams.get('ref');

  useEffect(() => {
    // Vous pouvez ajouter ici une vérification du paiement avec votre backend
    if (token && ref) {
      // Vérifier le statut du paiement
      verifyPayment(token, ref);
    }
  }, [token, ref]);

  const verifyPayment = async (token: string, ref: string) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ token, ref })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la vérification du paiement');
      }

      // Mettre à jour le statut de l'abonnement dans le localStorage ou le state global
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('subscription_status', 'active');
      }
    } catch (error) {
      console.error('Erreur de vérification:', error);
    }
  };

  return (
    <div style={{ 
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f2f5'
    }}>
      <StyledResult
        icon={<CheckCircleOutlined />}
        title="Paiement réussi !"
        subTitle="Votre abonnement a été activé avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités premium."
        extra={
          <Space size="middle">
            <Button 
              type="primary" 
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
            >
              Retour à l'accueil
            </Button>
            <Button
              icon={<FileOutlined />}
              onClick={() => navigate('/account/subscription')}
            >
              Voir mon abonnement
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default PaymentSuccess; 