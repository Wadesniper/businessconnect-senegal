import React, { useEffect, useState } from 'react';
import { Layout, Typography, Spin, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 24px;
  text-align: center;
`;

declare global {
  interface Window {
    CinetPay: any;
  }
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const planId = searchParams.get('plan');

        if (!planId) {
          message.error('Plan non spécifié');
          navigate('/subscription');
          return;
        }

        if (!user) {
          message.error('Veuillez vous connecter pour continuer');
          navigate('/auth/login');
          return;
        }

        // Configuration CinetPay
        const cinetpay = new window.CinetPay({
          apikey: 'YOUR_CINETPAY_API_KEY',
          site_id: 'YOUR_SITE_ID',
          notify_url: 'https://businessconnectsenegal.com/api/payment/notify',
          return_url: 'https://businessconnectsenegal.com/payment/success',
          cancel_url: 'https://businessconnectsenegal.com/payment/cancel',
          mode: 'PRODUCTION'
        });

        // Montant en fonction du plan
        const amounts = {
          basic: 0,
          premium: 5000,
          business: 15000
        };

        const amount = amounts[planId as keyof typeof amounts];

        // Initialisation du paiement
        cinetpay.setConfig({
          amount: amount,
          currency: 'XOF',
          channels: 'ALL',
          description: `Abonnement BusinessConnect - Plan ${planId}`,
          customer_name: user.firstName || '',
          customer_surname: user.lastName || '',
          customer_email: user.email,
          customer_phone_number: user.phone || '',
          customer_address: user.address || '',
          customer_city: user.city || '',
          customer_country: 'SN',
          customer_state: user.state || '',
          customer_zip_code: user.zipCode || ''
        });

        // Démarrage du paiement
        cinetpay.getCheckout({
          onClose: () => {
            navigate('/subscription');
          },
          onLoad: () => {
            setLoading(false);
          },
          onError: (error: any) => {
            console.error('Erreur CinetPay:', error);
            message.error('Une erreur est survenue lors du paiement');
            navigate('/subscription');
          }
        });

      } catch (error) {
        console.error('Erreur:', error);
        message.error('Une erreur est survenue');
        navigate('/subscription');
      }
    };

    // Chargement du script CinetPay
    const script = document.createElement('script');
    script.src = 'https://cdn.cinetpay.com/v2/cinetpay.js';
    script.async = true;
    script.onload = () => {
      initializePayment();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [location, navigate, user]);

  return (
    <StyledLayout>
      <Container>
        {loading ? (
          <>
            <Spin size="large" />
            <Title level={3} style={{ marginTop: 24 }}>
              Initialisation du paiement...
            </Title>
            <Text type="secondary">
              Veuillez patienter pendant que nous préparons votre transaction
            </Text>
          </>
        ) : (
          <div id="cinetpay-payment-button" />
        )}
      </Container>
    </StyledLayout>
  );
};

export default PaymentPage; 