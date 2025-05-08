import React, { useEffect, useState } from 'react';
import { Result, Button, Spin } from 'antd';
import { useRouter } from 'next/router';
import axios from 'axios';

const PaymentReturn: React.FC = () => {
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Ici, on pourrait récupérer un identifiant de transaction dans l'URL si besoin
    // Pour la démo, on simule une vérification côté serveur
    const checkPayment = async () => {
      setLoading(true);
      try {
        // À adapter : appeler une route back-end pour vérifier le statut réel
        // const res = await axios.get(`/api/payment/status?transaction_id=...`);
        // if (res.data.status === 'ACCEPTED') setStatus('success');
        // else setStatus('failed');
        setTimeout(() => {
          setStatus('success'); // Simule un paiement réussi
          setLoading(false);
        }, 2000);
      } catch {
        setStatus('failed');
        setLoading(false);
      }
    };
    checkPayment();
  }, []);

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