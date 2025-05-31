export interface Config {
    NODE_ENV: string;
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_SECURE: boolean;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    SMTP_FROM: string;
    CLIENT_URL: string;
    API_URL: string;
    CINETPAY_APIKEY: string;
    CINETPAY_SITE_ID: string;
    CINETPAY_BASE_URL: string;
    CINETPAY_NOTIFY_URL: string;
    CINETPAY_RETURN_URL: string;
}
export declare const config: Config;
