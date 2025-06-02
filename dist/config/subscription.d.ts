export declare const SUBSCRIPTION_PRICES: {
    etudiant: number;
    annonceur: number;
    recruteur: number;
};
export declare const SUBSCRIPTION_FEATURES: {
    etudiant: string[];
    annonceur: string[];
    recruteur: string[];
};
export type SubscriptionType = 'etudiant' | 'annonceur' | 'recruteur';
export interface Subscription {
    type: SubscriptionType;
    price: number;
    features: string[];
}
export declare const getSubscriptionDetails: (type: SubscriptionType) => Subscription;
