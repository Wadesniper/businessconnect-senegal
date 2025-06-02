export interface CinetPayPaymentResult {
    success: boolean;
    paymentUrl?: string;
    transactionId?: string;
    error?: string;
}
interface PaymentData {
    amount: number;
    currency: string;
    description: string;
    metadata: {
        userId: string;
        subscriptionType: string;
    };
}
export declare class PaymentService {
    private static readonly CINETPAY_BASE_URL;
    private static readonly CINETPAY_API_KEY;
    private static readonly CINETPAY_SITE_ID;
    static initializePayment(amount: number, currency: string, description: string, customerId: string): Promise<CinetPayPaymentResult>;
    static verifyPayment(transactionId: string): Promise<boolean>;
    createPayment(data: PaymentData): Promise<{
        id: string;
        amount: number;
        currency: string;
        status: string;
        paymentUrl: string;
    }>;
}
export {};
