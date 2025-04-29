import { message } from 'antd';

interface PaymentRequest {
  amount: number;
  planType: string;
  currency: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const PAYTECH_API_KEY = 'be2b2e9b3a0ed01d69d30dff8a21f05199e2e71968788b4890690d7af56ba32b';
const PAYTECH_API_SECRET = '6860a504cc73992c2e8dc623c7b31d948ef5a4ec2507a0a4771e62755cca9277';

// URLs de PayTech
const PAYTECH_URLS = {
  IPN: 'https://businessconnectsenegal.com/api/subscriptions/ipn',
  SUCCESS: 'https://businessconnectsenegal.com/payment/success',
  CANCEL: 'https://businessconnectsenegal.com/payment/cancel'
};

export const paymentService = {
  async initiatePayment(data: PaymentRequest) {
    try {
      // Construction de l'URL de l'API PayTech
      const payTechApiUrl = 'https://paytech.sn/api/payment/request-payment';
      
      // Préparation des données pour PayTech
      const paymentData = {
        item_name: `Abonnement ${data.planType}`,
        item_price: data.amount,
        currency: 'XOF',
        ref_command: `BC-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        command_name: `Abonnement BusinessConnect - ${data.planType}`,
        env: 'prod', // Mode production activé
        ipn_url: PAYTECH_URLS.IPN,
        success_url: PAYTECH_URLS.SUCCESS,
        cancel_url: PAYTECH_URLS.CANCEL,
        custom_field: JSON.stringify({
          userId: localStorage.getItem('userId'),
          planType: data.planType,
          timestamp: Date.now()
        })
      };

      const response = await fetch(payTechApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': PAYTECH_API_KEY,
          'X-API-SECRET': PAYTECH_API_SECRET
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur PayTech:', errorData);
        throw new Error(errorData.message || 'Erreur lors de l\'initialisation du paiement');
      }

      const responseData = await response.json();
      
      if (responseData.success) {
        // Sauvegarde des informations de la transaction
        localStorage.setItem('pending_subscription', JSON.stringify({
          planType: data.planType,
          amount: data.amount,
          ref: paymentData.ref_command,
          timestamp: Date.now()
        }));
        
        // Redirection vers la page de paiement PayTech
        window.location.href = responseData.redirect_url;
      } else {
        throw new Error(responseData.message || 'Erreur lors de l\'initialisation du paiement');
      }
    } catch (error) {
      console.error('Erreur PayTech:', error);
      message.error('Une erreur est survenue lors de l\'initialisation du paiement');
      throw error;
    }
  },

  getPaymentAmount(planType: string): number {
    const prices = {
      'etudiant-chercheur-emploi': 1000,
      'annonceur': 5000,
      'recruteur': 9000
    };
    return prices[planType as keyof typeof prices] || 1000;
  }
}; 