import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { subscriptionService } from '../../services/subscriptionService';

const PaymentReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const token = searchParams.get('token') || searchParams.get('transaction_id');
    if (!token) {
      setError('Identifiant de transaction manquant.');
      setPaymentStatus('failed');
      setLoading(false);
      return;
    }

    let isMounted = true;
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 8; // 8 x 2s = 16s max

    const verifyPayment = async () => {
      try {
        const response = await subscriptionService.verifyPayment({ token });
        if (!isMounted) return;
        if (response.success) {
          await refreshAuth();
          setPaymentStatus('success');
          setLoading(false);
        } else {
          // Si ce n'est pas la dernière tentative, on attend
          if (attempts < maxAttempts) {
            setRetryCount((c) => c + 1);
          } else {
            setError(
              response.message ||
                "La vérification du paiement a échoué. Si vous avez bien été débité, veuillez vider le cache de votre navigateur ou vous connecter sur un autre appareil pour profiter de votre abonnement. Si le problème persiste, contactez le support à l'adresse contact@businessconnectsenegal.com."
            );
            setPaymentStatus('failed');
            setLoading(false);
          }
        }
      } catch (err: any) {
        if (!isMounted) return;
        if (attempts < maxAttempts) {
          setRetryCount((c) => c + 1);
        } else {
          setError(
            (err.message || 'Une erreur est survenue lors de la vérification de votre paiement.') +
              ' Si vous avez bien été débité, veuillez vider le cache de votre navigateur ou vous connecter sur un autre appareil pour profiter de votre abonnement. Si le problème persiste, contactez le support à l\'adresse contact@businessconnectsenegal.com.'
          );
          setPaymentStatus('failed');
          setLoading(false);
        }
      }
    };

    // Premier check immédiat
    verifyPayment();
    attempts++;

    // Polling toutes les 2 secondes
    interval = setInterval(() => {
      if (paymentStatus === 'success' || paymentStatus === 'failed') {
        clearInterval(interval);
        clearTimeout(timeout);
        return;
      }
      attempts++;
      verifyPayment();
    }, 2000);

    // Timeout au bout de 16 secondes
    timeout = setTimeout(() => {
      clearInterval(interval);
      if (paymentStatus === 'pending') {
        setError(
          "La vérification du paiement a pris trop de temps. Si vous avez bien été débité, veuillez vider le cache de votre navigateur ou vous connecter sur un autre appareil pour profiter de votre abonnement. Si le problème persiste, contactez le support à l'adresse contact@businessconnectsenegal.com."
        );
        setPaymentStatus('failed');
        setLoading(false);
      }
    }, 16000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line
  }, [searchParams, refreshAuth]);

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
        <p style={{ marginTop: 20, fontSize: 18 }}>Vérification du paiement en cours...<br/>Merci de patienter, inutile de rafraîchir la page.</p>
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
                Accéder à mon tableau de bord
              </Button>,
            ]}
          />
        )}

        {(paymentStatus === 'failed' || error) && (
          <Result
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            status="error"
            title="Paiement échoué"
            subTitle={error || "Une erreur s'est produite lors du traitement de votre paiement. Veuillez réessayer ou contacter le support."}
            extra={[
              <Button type="primary" key="retry" onClick={() => navigate('/subscription')}>
                Voir les abonnements
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