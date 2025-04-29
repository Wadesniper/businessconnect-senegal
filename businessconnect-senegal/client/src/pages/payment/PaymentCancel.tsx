import React from 'react';
import { Result, Button, Space } from 'antd';
import { CloseCircleOutlined, HomeOutlined, RedoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledResult = styled(Result)`
  padding: 48px 32px;
  
  .ant-result-icon {
    .anticon {
      font-size: 72px;
      color: #ff4d4f;
    }
  }
`;

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  // Récupérer les informations de la transaction annulée
  const pendingSubscription = localStorage.getItem('pending_subscription')
    ? JSON.parse(localStorage.getItem('pending_subscription')!)
    : null;

  const handleRetry = () => {
    // Rediriger vers la page de tarification
    navigate('/pricing');
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
        icon={<CloseCircleOutlined />}
        title="Paiement annulé"
        subTitle={
          pendingSubscription 
            ? `La souscription à l'abonnement ${pendingSubscription.planType} (${pendingSubscription.amount} FCFA) a été annulée.`
            : "Le processus de paiement a été annulé."
        }
        extra={
          <Space size="middle">
            <Button 
              type="primary" 
              danger
              icon={<RedoOutlined />}
              onClick={handleRetry}
            >
              Réessayer
            </Button>
            <Button
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
            >
              Retour à l'accueil
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default PaymentCancel; 