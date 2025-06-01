import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const PaymentReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');

  useEffect(() => {
    const transactionId = searchParams.get('transaction_id');
    const status = searchParams.get('status');
    
    // Simuler la vérification du statut de paiement
    setTimeout(() => {
      if (status === 'ACCEPTED' || status === 'success') {
        setPaymentStatus('success');
      } else if (status === 'CANCELLED' || status === 'failed') {
        setPaymentStatus('failed');
      } else {
        setPaymentStatus('failed'); // Par défaut, considérer comme échoué
      }
      setLoading(false);
    }, 2000);
  }, [searchParams]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} />} />
        <p style={{ marginTop: 20, fontSize: 18 }}>Vérification du paiement en cours...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '50px 20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {paymentStatus === 'success' && (
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            status="success"
            title="Paiement réussi !"
            subTitle="Votre abonnement a été activé avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités premium de BusinessConnect Sénégal."
            extra={[
              <Button type="primary" key="dashboard" onClick={() => navigate('/dashboard')}>
                Aller au tableau de bord
              </Button>,
              <Button key="subscription" onClick={() => navigate('/subscription')}>
                Voir mes abonnements
              </Button>
            ]}
          />
        )}

        {paymentStatus === 'failed' && (
          <Result
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            status="error"
            title="Paiement échoué"
            subTitle="Une erreur s'est produite lors du traitement de votre paiement. Veuillez réessayer ou contacter le support."
            extra={[
              <Button type="primary" key="retry" onClick={() => navigate('/subscription')}>
                Réessayer le paiement
              </Button>,
              <Button key="dashboard" onClick={() => navigate('/dashboard')}>
                Retour au tableau de bord
              </Button>
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentReturnPage; 