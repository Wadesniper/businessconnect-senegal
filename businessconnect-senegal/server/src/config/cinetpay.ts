import { config } from './index';

export const CinetPayConfig = {
  apiKey: config.CINETPAY_APIKEY,
  siteId: config.CINETPAY_SITE_ID,
  secretKey: config.CINETPAY_SECRET_KEY,
  notifyUrl: `${config.API_URL}/payment/notify`,
  returnUrl: `${config.CLIENT_URL}/payment/success`,
  cancelUrl: `${config.CLIENT_URL}/payment/cancel`,
  mode: 'PRODUCTION'
}; 