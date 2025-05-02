"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionDetails = exports.SUBSCRIPTION_FEATURES = exports.SUBSCRIPTION_PRICES = void 0;
exports.SUBSCRIPTION_PRICES = {
    etudiant: 1000,
    annonceur: 5000,
    recruteur: 9000
};
exports.SUBSCRIPTION_FEATURES = {
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
const getSubscriptionDetails = (type) => {
    return {
        type,
        price: exports.SUBSCRIPTION_PRICES[type],
        features: exports.SUBSCRIPTION_FEATURES[type]
    };
};
exports.getSubscriptionDetails = getSubscriptionDetails;
//# sourceMappingURL=subscription.js.map