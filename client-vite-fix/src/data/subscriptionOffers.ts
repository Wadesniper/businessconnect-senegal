export const subscriptionOffers = [
  {
    key: 'student',
    title: "Étudiant / Chercheur d'emploi",
    price: 1000,
    color: '#1890ff',
    features: [
      { label: "Accès aux offres d'emploi", included: true },
      { label: 'Générer votre CV', included: true },
      { label: 'Fiches métiers', included: true },
      { label: 'Accès à +4000 formations', included: true },
      { label: 'Support standard', included: true },
      { label: 'Publier sur la marketplace', included: false },
      { label: "Publier des offres d'emploi", included: false },
    ],
  },
  {
    key: 'annonceur',
    title: 'Annonceur',
    price: 5000,
    color: '#52c41a',
    features: [
      { label: 'Toutes les fonctionnalités Étudiant', included: true },
      { label: 'Visibilité sur la plateforme', included: true },
      { label: 'Badge "Annonceur Vérifié"', included: true },
      { label: 'Support prioritaire', included: true },
      { label: "Publier des offres d'emploi", included: false },
    ],
  },
  {
    key: 'employeur',
    title: 'Recruteur',
    price: 9000,
    color: '#faad14',
    features: [
      { label: 'Toutes les fonctionnalités Étudiant et Annonceur', included: true },
      { label: "Publication d'offres d'emploi", included: true },
      { label: 'Support dédié', included: true },
      { label: 'Visibilité plateforme', included: true },
    ],
    popular: true
  },
]; 