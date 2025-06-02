interface PaymentData {
    amount: number;
    currency: string;
    description: string;
    return_url: string;
    cancel_url: string;
    trans_id: string;
    customer_name: string;
    customer_email: string;
}
interface PaymentResponse {
    success: boolean;
    payment_url?: string;
    message?: string;
}
interface CinetPayPaymentData {
    amount: number;
    customer_name: string;
    customer_surname: string;
    customer_email: string;
    customer_phone_number: string;
    description: string;
}
export declare class CinetPayService {
    private apiKey;
    private apiUrl;
    private siteId;
    constructor();
    createPayment(paymentData: PaymentData): Promise<PaymentResponse>;
    initializePayment(paymentData: CinetPayPaymentData): Promise<{
        transaction_id: string;
        payment_url: string;
    }>;
}
export {};
