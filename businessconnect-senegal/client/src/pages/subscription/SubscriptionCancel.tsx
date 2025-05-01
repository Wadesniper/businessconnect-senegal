import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const SubscriptionCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="warning"
      title="Paiement annulé"
      subTitle="Vous avez annulé le processus de paiement. Vous pouvez réessayer quand vous le souhaitez."
      extra={[
        <Button type="primary" key="subscription" onClick={() => navigate('/subscription')}>
          Retourner aux abonnements
        </Button>,
        <Button key="contact" onClick={() => navigate('/contact')}>
          Nous contacter
        </Button>
      ]}
    />
  );
};

export default SubscriptionCancel; 