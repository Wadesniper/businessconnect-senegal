import dotenv from 'dotenv';

dotenv.config();

export const CinetPayConfig = {
  apiKey: process.env.CINETPAY_APIKEY,
  siteId: process.env.CINETPAY_SITE_ID,
  secretKey: process.env.CINETPAY_SECRET_KEY,
  notifyUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.businessconnectsenegal.com/api/payment/notify'
    : 'http://localhost:4000/api/payment/notify',
  returnUrl: process.env.NODE_ENV === 'production'
    ? 'https://businessconnectsenegal.com/payment/success'
    : 'http://localhost:3001/payment/success',
  cancelUrl: process.env.NODE_ENV === 'production'
    ? 'https://businessconnectsenegal.com/payment/cancel'
    : 'http://localhost:3001/payment/cancel'
}; 