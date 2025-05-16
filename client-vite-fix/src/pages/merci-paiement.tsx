import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const MerciPaiement: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
      <Result
        status="success"
        title="Merci pour votre paiement !"
        subTitle="Votre transaction a été validée. Votre abonnement sera activé sous peu. Vous recevrez un email de confirmation."
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>Retour à l'accueil</Button>
        ]}
      />
    </div>
  );
};

export default MerciPaiement; 