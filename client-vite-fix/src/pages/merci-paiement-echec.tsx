import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const MerciPaiementEchec: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff4d4f 0%, #fff1f0 100%)' }}>
      <Result
        status="error"
        title="Échec du paiement"
        subTitle="Votre paiement n'a pas pu être validé. Veuillez réessayer ou contacter le support si le problème persiste."
        extra={[
          <Button type="primary" key="retry" onClick={() => navigate('/subscription')}>Réessayer</Button>,
          <Button key="support" onClick={() => navigate('/contact')}>Contacter le support</Button>
        ]}
      />
    </div>
  );
};

export default MerciPaiementEchec; 