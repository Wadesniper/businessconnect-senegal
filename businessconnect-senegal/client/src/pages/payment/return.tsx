import React, { useEffect, useState } from 'react';
import { Result, Button, Spin } from 'antd';
import { useRouter } from 'next/router';
import axios from 'axios';

const PaymentReturn: React.FC = () => {
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkPayment = async () => {
      setLoading(true);
      try {
        const { transaction_id } = router.query;
        if (!transaction_id) {
          setStatus('failed');
          setLoading(false);
          return;
        }
        const res = await axios.get(`/api/payment/status?transaction_id=${transaction_id}`);
        if (res.data.status === 'ACCEPTED') setStatus('success');
        else setStatus('failed');
      } catch {
        setStatus('failed');
      } finally {
        setLoading(false);
      }
    };
    if (router.isReady) checkPayment();
  }, [router.isReady, router.query]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {status === 'success' ? (
        <Result
          status="success"
          title="Paiement validé !"
          subTitle="Votre abonnement est maintenant actif. Merci pour votre confiance."
          extra={[
            <Button type="primary" key="home" onClick={() => router.push('/')}>Retour à l'accueil</Button>
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Paiement échoué"
          subTitle="Votre paiement n'a pas pu être validé. Si vous avez été débité, contactez le support."
          extra={[
            <Button type="primary" key="retry" onClick={() => router.push('/subscription')}>Réessayer</Button>
          ]}
        />
      )}
    </div>
  );
};

export default PaymentReturn; 