import { IUser } from '../models/User';
export declare const isSubscriptionActive: (user: IUser) => boolean;
export declare const getSubscriptionDetails: (user: IUser) => {
    isActive: boolean;
    type: "etudiant" | "annonceur" | "recruteur";
    status: "active" | "expired";
    expiresAt: any;
    autoRenew: any;
};
