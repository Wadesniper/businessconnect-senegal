import { ISubscription } from '../models/User';
interface PaymentInitiationData {
    type: 'etudiant' | 'annonceur' | 'recruteur';
    customer_name: string;
    customer_surname: string;
    customer_email: string;
    customer_phone_number: string;
    userId: string;
}
export declare class SubscriptionService {
    private paymentService;
    private cinetPayService;
    private readonly SUBSCRIPTION_PRICES;
    private readonly SUBSCRIPTION_DURATION;
    constructor();
    initiateSubscription(data: PaymentInitiationData): Promise<{
        paymentUrl: string;
    }>;
    activateSubscription(userId: string, type: 'etudiant' | 'annonceur' | 'recruteur', paymentId: string): Promise<{
        success: boolean;
        subscription: ISubscription;
    }>;
    checkSubscriptionStatus(userId: string): Promise<{
        isActive: boolean;
        type: string;
        message: string;
        expiryDate?: undefined;
        daysRemaining?: undefined;
    } | {
        isActive: boolean;
        message: string;
        type?: undefined;
        expiryDate?: undefined;
        daysRemaining?: undefined;
    } | {
        isActive: boolean;
        message: string;
        expiryDate: Date;
        type?: undefined;
        daysRemaining?: undefined;
    } | {
        isActive: boolean;
        type: "etudiant" | "annonceur" | "recruteur";
        expiryDate: Date;
        daysRemaining: number;
        message?: undefined;
    }>;
}
export {};
