import { IUser } from '../models/User';
export declare class NotificationService {
    private static transporter;
    static sendEmail(to: string, subject: string, html: string): Promise<void>;
    static sendWelcomeEmail(user: IUser): Promise<void>;
    static sendPasswordResetEmail(user: IUser, resetToken: string): Promise<void>;
    static sendSubscriptionConfirmation(user: IUser, subscriptionType: string): Promise<void>;
}
