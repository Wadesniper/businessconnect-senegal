export interface PayTechConfig {
  apiKey: string;
  apiSecret: string;
  apiUrl: string;
  baseUrl: string;
}

export const paytechConfig: PayTechConfig = {
  apiKey: process.env.PAYTECH_API_KEY || '',
  apiSecret: process.env.PAYTECH_API_SECRET || '',
  apiUrl: process.env.PAYTECH_API_URL || 'https://paytech.sn',
  baseUrl: process.env.PAYTECH_BASE_URL || 'https://paytech.sn/api/v1'
}; 