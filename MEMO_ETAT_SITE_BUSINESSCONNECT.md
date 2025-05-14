# MEMO ÉTAT SITE BUSINESSCONNECT

## [Date : Correction build Vercel]

- Problème : Le build Vercel échouait à cause d'une dépendance locale non versionnée (@mui/icons-material sous forme de fichier .tgz).
- Correction : Passage à la version officielle NPM ("@mui/icons-material": "^7.1.0") dans package.json.
- Action : Suppression de la référence locale, réinstallation des dépendances, commit et push.
- Impact : Aucun impact sur le backend, aucune suppression de fonctionnalité, le site complet reste inchangé.
- Statut : Prêt pour un nouveau déploiement Vercel.

## [Date : Nettoyage frontend - migration CinetPay]

- Suppression de toutes les références à Paytech dans le frontend (endpoints, textes, commentaires, tests).
- Le paiement passe exclusivement par CinetPay : l'utilisateur est redirigé vers l'interface CinetPay lors de l'abonnement.
- Aucun impact sur le backend, aucune suppression de fonctionnalité métier.
- Statut : frontend 100% CinetPay, prêt pour test et déploiement. 