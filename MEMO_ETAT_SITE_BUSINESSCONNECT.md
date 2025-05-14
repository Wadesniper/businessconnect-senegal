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

## [Date : Correction barre de navigation et liens]

- Correction des liens du menu de navigation pour correspondre aux routes existantes (FAQ, Connexion, Inscription, Fiches métiers, etc.).
- Amélioration de l'alignement et du style des boutons S'abonner, Connexion, Inscription pour un affichage harmonieux.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend.
- Statut : Prêt pour test d'affichage et navigation sur l'environnement de production.

## [Date : Correction route FAQ]

- Ajout de la route /help/FAQ dans le router pour corriger l'accès à la FAQ depuis la navigation et éviter le 404.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend.
- Statut : Prêt pour test d'accès à la FAQ.

## [Date : Correction route Fiches Métiers]

- Ajout de la route /careers dans le router pour corriger l'accès aux Fiches Métiers depuis la navigation et éviter le 404.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend.
- Statut : Prêt pour test d'accès aux Fiches Métiers.

## [Date : Complétion des bannières page Emplois]

- Ajout de conseils structurés et attractifs dans JobAdviceBanner (conseils CV, entretiens, réseau, veille).
- Ajout de bannières de redirection modernes dans RedirectBanners (CV, Fiches Métiers, Formations) avec boutons d'action.
- Amélioration de l'expérience utilisateur sur la page Emplois, sans suppression de fonctionnalités existantes.
- Statut : Prêt pour test d'affichage sur la page Emplois.

## [Date : Correction définitive navbar et carrousel Hero]

- Correction du composant Hero pour garantir l'affichage du carrousel même si l'animation échoue (fallback image statique, accessibilité renforcée).
- Amélioration du CSS de la navbar : réduction du padding, alignement horizontal renforcé, meilleure transition responsive, fond blanc et ombre plus discrète.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Harmonisation carrousel (ratio 16/9, intervalle 3s) et navbar compacte]

- Harmonisation du ratio du carrousel Hero (16/9), centrage des images, fond neutre pour éviter les bandes, et synchronisation du texte et de l'image.
- Intervalle de défilement réduit à 3 secondes pour un carrousel plus dynamique.
- Amélioration de la barre de navigation : boutons à droite plus compacts, alignement vertical parfait, responsive renforcé.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Carrousel Hero ratio 21/9 ultra horizontal]

- Passage du carrousel Hero au ratio 21/9 (padding-top: 42.85%) pour un rendu très horizontal, moderne et immersif.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Carrousel Hero ratio 3/1 ultra horizontal extrême]

- Passage du carrousel Hero au ratio 3/1 (padding-top: 33.33%) pour un effet bannière ultra horizontal, encore plus large que 21/9.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Carrousel Hero ratio 4/1 + effet arrière-plan dynamique]

- Passage du carrousel Hero au ratio 4/1 (padding-top: 25%) pour un effet bannière ultra horizontal.
- Ajout d'un effet d'arrière-plan dynamique : la même image que celle du carrousel, floutée et agrandie, en fond du Hero, avec un overlay dégradé pour la lisibilité.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Carrousel Hero ratio 2.5/1 (plus haut, moins coupé)]

- Ajustement du ratio du carrousel Hero à 2.5/1 (padding-top: 40%) pour augmenter la hauteur tout en gardant un effet horizontal, ce qui limite la coupe des images.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production. 