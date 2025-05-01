export const SUBSCRIPTION_PRICES = {
  etudiant: 1000,    // 1,000 FCFA / mois
  annonceur: 5000,   // 5,000 FCFA / mois
  recruteur: 9000    // 9,000 FCFA / mois
};

export const SUBSCRIPTION_FEATURES = {
  etudiant: [
    'Accès aux offres d\'emploi',
    'Espace CV personnalisé',
    'Accès au forum',
    'Fiches métiers',
    'Accès aux formations'
  ],
  annonceur: [
    'Publication d\'offres',
    'Visibilité sur la plateforme'
  ],
  recruteur: [
    'Accès complet à la CVthèque',
    'Contact direct avec les candidats'
  ]
};

export type SubscriptionType = 'etudiant' | 'annonceur' | 'recruteur';

export interface Subscription {
  type: SubscriptionType;
  price: number;
  features: string[];
}

export const getSubscriptionDetails = (type: SubscriptionType): Subscription => {
  return {
    type,
    price: SUBSCRIPTION_PRICES[type],
    features: SUBSCRIPTION_FEATURES[type]
  };
}; 