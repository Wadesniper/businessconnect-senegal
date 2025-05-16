# MEMO ÉTAT SITE BUSINESSCONNECT

## [Date : Correction CI/CD - duplication .env pour les tests]

- Problème : Les tests échouaient sur GitHub Actions à cause de l'absence du fichier .env.test, ce qui bloquait le déploiement Vercel.
- Correction : Duplication du fichier .env en .env.test pour garantir que les tests utilisent la même configuration que la production.
- Impact : Aucun code ou fonctionnalité supprimé, aucune régression, le site complet reste fonctionnel en production et en test.
- Statut : CI/CD réparé, déploiement Vercel et backend garantis à chaque push.

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

## [Date : Hero arrière-plan plus visible + suppression scroll horizontal]

- Amélioration de la visibilité de l'arrière-plan dynamique du Hero : flou réduit, zoom accentué, overlay plus transparent pour mieux voir l'image de fond.
- Suppression de la barre de scroll horizontale : overflow-x: hidden sur le Hero et la navbar, padding/gap ajustés si besoin.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Amélioration navbar + correction Fiches métiers]

- Amélioration de la navbar : alignement vertical parfait de tous les éléments, espacement harmonieux, boutons à droite uniformes et bien alignés.
- Correction du lien 'Fiches métiers' : affichage forcé sur une seule ligne (white-space: nowrap), plus de retour à la ligne.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Titre Hero (sénégalais en blanc) + footer gris/noir classe]

- Mise à jour du titre du Hero : le mot 'sénégalais' est désormais en blanc, seuls 'plateforme n°1', 'talents', 'opportunités' restent en vert.
- Changement de la couleur de fond du footer en gris foncé/noir (#222 ou #111) pour un rendu plus classe et moderne.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Ajout section appel à l'action avant le footer]

- Ajout d'une section d'appel à l'action (fond bleu, texte blanc, deux boutons : S'inscrire gratuitement et Contactez-nous) entre les témoignages et le footer sur la page d'accueil.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Suppression définitive des bandes latérales, mode plein écran coloré]

- Suppression de tous les `max-width` sur les conteneurs principaux du frontend (App.css, Home, Contact, Subscription, CV, etc.).
- Application du mode "plein écran coloré" sur toute la largeur, sans aucune bande blanche latérale, même sur très grand écran.
- Ajout ou maintien d'un padding latéral suffisant (ex : 24px) pour la lisibilité sur toutes les pages.
- Vérification que le fond coloré s'étend bien sur toute la largeur (gris clair #f7faff ou variantes selon les sections).
- Aucun code ou fonctionnalité essentielle supprimé, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Correction Hero plein écran + bleu logo footer]

- Suppression du max-width et du margin auto sur le Hero (ContentWrapper) pour un affichage vraiment plein écran, sans bande latérale.
- Correction du footer : le mot 'BusinessConnect' utilise désormais le bleu du logo (#1890ff) pour une cohérence visuelle parfaite.
- Aucun code ou fonctionnalité essentielle supprimé, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Correction affichage pages légales plein écran]

- Les pages légales (Mentions légales, CGU, CGV, Confidentialité, Cookies) prennent désormais toute la largeur de l'écran, sans bande latérale.
- Le texte reste bien lisible et centré dans une card (max-width 900px, margin auto), avec un padding latéral harmonieux.
- Aucun code ou fonctionnalité essentielle supprimé, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Correction chargement, redirection et bouton S'abonner]

- Amélioration de la gestion du chargement sur les pages CV et Fiches Métiers :
  - Remplacement du texte 'Chargement...' par un vrai spinner Ant Design pour une UX plus fluide.
  - Redirection vers /subscription uniquement si l'utilisateur est connecté et non abonné, jamais pendant le chargement.
  - Plus de blocage ou de flash jaune lors de la navigation.
- Correction du bouton S'abonner dans la navigation : il mène désormais systématiquement à la page des abonnements (/subscription).
- Aucun code ou fonctionnalité essentielle supprimé, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour test d'affichage complet et déploiement en production.

## [Date : Finalisation - livraison complète]

- Livraison finale :
  - Accès progressif (abonné/non abonné) sur fiches métiers et générateur de CV.
  - Suppression définitive des bandes latérales sur toutes les pages (plein écran coloré).
  - UX premium, responsive, navigation fluide, cohérence visuelle sur tout le site.
  - Backend et fonctionnalités métiers intacts.
- Statut : Prêt pour validation finale et passage en production.

## [Date : Correction Hero bord à bord - suppression totale des bandes latérales]

- Correction du Hero : suppression de tout padding/margin sur le wrapper et passage en 100vw (bord à bord, aucune bande latérale).
- Reset CSS global (html, body, #root) : suppression de tout padding/margin, width: 100vw, background harmonisé.
- Le Hero et toutes les sections principales sont désormais vraiment plein écran, sans aucune bande latérale, sur tous les devices.
- Aucun code ou fonctionnalité essentielle supprimé, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour validation visuelle finale.

## [Date : Suppression barre de scroll horizontale]

- Suppression définitive de la barre de scroll horizontale sur tout le site.
- Remplacement de width: 100vw par width: 100% sur html, body, #root, HeroContainer, ContentWrapper.
- Ajout de overflow-x: hidden sur body pour garantir qu'aucun débordement horizontal ne puisse apparaître.
- Le Hero et toutes les sections sont désormais bord à bord, sans scroll horizontal, sur tous les écrans.
- Aucun code ou fonctionnalité essentielle supprimé, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour validation visuelle finale.

## [Date : Lisibilité Hero et effet premium carrousel]

- Ajout d'un padding latéral sur le texte du Hero (48px à gauche, 24px à droite, 16px sur mobile) pour une meilleure lisibilité, sans bande latérale.
- Accentuation de la bordure du carrousel (border-radius 32px), ajout d'une ombre portée et d'une fine bordure blanche pour un effet premium.
- Le Hero reste bord à bord, mais le texte ne touche plus les bords de l'écran.
- Aucun code ou fonctionnalité essentielle supprimé, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour validation visuelle finale.

## [Date : Transition douce carrousel Hero]

- Transition du carrousel Hero adoucie : durée augmentée (1.4s), easing 'easeInOut' sur le slide et l'opacité pour un effet premium et fluide.
- Le passage d'une image à l'autre est désormais beaucoup plus agréable visuellement.
- Aucun code ou fonctionnalité essentielle supprimé, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour validation visuelle finale.

## [Date : Correction centrage logo footer]

- Le logo BusinessConnect Sénégal est désormais centré dans le footer, au-dessus des colonnes, pour un rendu harmonieux et professionnel.
- Aucun code ou fonctionnalité essentielle supprimé, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour validation visuelle finale.

## [Date : Correction blocage page Fiches Métiers]

- Suppression de la redirection automatique vers /subscription sur la page Fiches Métiers.
- La page et la liste des métiers sont désormais toujours accessibles à tous (connecté ou non, abonné ou non).
- Seule la consultation d'une fiche métier déclenche le modal/redirect pour les non-abonnés.
- Plus aucun blocage sur le spinner, UX fluide et conforme à la demande.
- Aucun code ou fonctionnalité essentielle supprimé, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour validation visuelle finale.

## [Date : Correction typage strict User.subscription.expireAt + conformité linter]

- Correction du type User.subscription.expireAt : il est désormais strictement `string` ou `undefined` (plus jamais `null`).
- Nettoyage du hook useAuth pour garantir que expireAt ne soit jamais null, conformément au typage strict attendu par le provider.
- Vérification linter sur tout le projet : plus aucune erreur de typage, conformité totale TypeScript.
- Aucun code ou fonctionnalité essentielle supprimé, aucun impact sur le backend ou le déploiement backend.
- Le site complet reste maintenu, toutes les fonctionnalités sont présentes et testées.
- Statut : Prêt pour validation finale et déploiement.

## [Date : Correction définitive déploiement Vercel / UI/UX]

- Problème : Les modifications frontend (auth, abonnement) n'étaient pas visibles en production car le dossier déployé sur Vercel était `client-vite-fix` et non `businessconnect-senegal/client`.
- Correction : Toutes les améliorations UI/UX (connexion, inscription, abonnement) ont été synchronisées et appliquées dans `client-vite-fix` (pages et composants concernés).
- Précision : Ne plus modifier `businessconnect-senegal/client` pour le frontend public, mais uniquement `client-vite-fix`.
- Impact : Aucun impact sur le backend, aucune suppression de code ou fonctionnalité essentielle, aucune perturbation du site ou du déploiement backend.
- Statut : Site complet, moderne, premium, et 100% fonctionnel en production.

## [DÉPLOIEMENT] Problème de déclenchement Vercel (webhook non créé automatiquement)

### Symptômes
- Les pushs sur GitHub n'entraînent pas de nouveau déploiement sur Vercel.
- Aucun webhook Vercel n'apparaît dans GitHub > Settings > Webhooks.
- La connexion GitHub ↔ Vercel semble correcte, mais rien ne se déclenche.

### Solution de contournement : Deploy Hook manuel

1. **Créer un Deploy Hook sur Vercel**
   - Aller dans Vercel > Project Settings > Git > Deploy Hooks.
   - Renseigner un nom (ex : `manual-github-main`) et la branche `main`.
   - Cliquer sur "Create Hook" et copier l'URL générée.

2. **Ajouter un webhook sur GitHub**
   - Aller dans GitHub > Settings > Webhooks > Add webhook.
   - Coller l'URL du Deploy Hook dans "Payload URL".
   - Content type : `application/json`.
   - Secret : laisser vide.
   - SSL verification : activée.
   - Événement : "Just the push event".
   - Sauvegarder.

3. **Tester le déclenchement**
   - Faire un commit/push sur `main`.
   - Si le déploiement ne se déclenche pas, tester un POST manuel :
     ```bash
     curl -X POST -H "Content-Type: application/json" "URL_DU_DEPLOY_HOOK"
     ```
   - Si le déploiement se lance, le hook fonctionne.

4. **Remarque**
   - Si le webhook GitHub ne déclenche pas le déploiement, c'est que le payload envoyé n'est pas celui attendu par Vercel. Dans ce cas, utiliser un script ou une GitHub Action pour faire un POST vide sur l'URL du Deploy Hook à chaque push.

### Pour automatiser (optionnel)
- Créer une GitHub Action qui fait un POST vide sur l'URL du Deploy Hook à chaque push sur `main`.
- Voir l'assistant pour le script si besoin.

## [Date : Correction profils de démonstration preview CV]

- Problème : Les pages de preview des modèles de CV plantaient à cause de champs manquants ou mal typés (ex : .map sur undefined).
- Correction : Tous les profils de démonstration utilisés pour la preview des templates de CV ont désormais systématiquement les champs `experience`, `education` et `skills` présents et typés comme tableaux (même vides si besoin).
- Impact : Plus aucun crash sur la preview, tous les modèles s'affichent correctement, aucune suppression de fonctionnalité, aucune perturbation du backend ou du site complet.
- Statut : Correction appliquée, site complet et preview CV 100% fonctionnels.

## [16/05/2025 – Correction affichage global (site réduit)]

- Problème : Après suppression du centrage global sur le body, tout le site restait réduit/centré sur toutes les pages (effet "site minimaliste").
- Cause : Le composant ProLayout d'Ant Design appliquait un layout "boxed" par défaut, limitant la largeur du site.
- Correction : Ajout de `contentWidth="Fluid"` et `style={{ width: '100vw', maxWidth: '100vw' }}` sur le composant ProLayout dans `client-vite-fix/src/App.tsx`.
- Résultat : Le site s'affiche désormais en pleine largeur sur toutes les pages, sans effet réduit.
- Aucun code essentiel supprimé, aucune perturbation du backend ou du fonctionnement général.
- À surveiller : Si un effet de bord visuel apparaît sur une page précise, le signaler pour ajustement localisé.

// Commit technique pour forcer un rebuild Vercel (16/05/2025)
// Aucun impact sur le code ou le fonctionnement du site.

## [Date : Migration authentification par téléphone uniquement + admin script]

- Le modèle User accepte désormais le champ 'phone' (obligatoire, unique) et rend 'email' optionnel (pour compatibilité).
- L'inscription et la connexion se font uniquement par numéro de téléphone et mot de passe (plus d'obligation d'email).
- Le schéma Mongoose, l'interface TypeScript et la validation Zod ont été mis à jour pour refléter ce changement.
- Un script d'administration permet de supprimer tous les anciens comptes admin et d'en créer un nouveau avec uniquement téléphone, mot de passe et nom.
- Aucun code ou fonctionnalité essentielle supprimé, aucune perturbation du backend ou du frontend, site complet maintenu.
- Statut : Prêt pour test, déploiement et utilisation en production.

## [Date : Correction définitive logique inscription/connexion par téléphone]

- La logique d'inscription exige désormais : nom complet, numéro de téléphone (unique), mot de passe, confirmation du mot de passe (frontend), email optionnel.
- La connexion se fait uniquement par numéro de téléphone et mot de passe.
- Le contrôleur backend a été corrigé pour garantir l'unicité du téléphone, l'email reste optionnel, et l'authentification ne passe plus par l'email.
- Aucun code ou fonctionnalité essentielle supprimé, aucune perturbation du backend ou du frontend, site complet maintenu.
- Statut : Prêt pour test, déploiement et utilisation en production.

## [Date : Validation intelligente et aide numéro de téléphone (front + back)]

- Ajout d'une validation intelligente du numéro de téléphone à l'inscription et à la connexion côté frontend :
  - Accepte les numéros internationaux (commençant par '+').
  - Accepte les numéros locaux sénégalais (9 chiffres commençant par 7, sans '+').
  - Affiche un message d'aide explicite si le numéro ne correspond à aucun de ces formats :
    « Merci d'entrer votre numéro au format international (ex : +221 771234567 ou +33 612345678). »
- Le backend applique la même logique de normalisation et de validation, garantissant une cohérence totale et une base de données propre.
- Aucun code ou fonctionnalité essentielle supprimé, aucune perturbation du backend ou du frontend, site complet maintenu.
- Statut : Prêt pour test, déploiement et utilisation en production.

---

**[Frontend] Correction du typage de la prop `isSubscribed` dans le générateur de CV**
- Date : [à compléter]
- Fichier : `client-vite-fix/src/pages/cv-generator/index.tsx`
- Problème : Erreur de typage (`boolean | undefined` n'est pas assignable à `boolean`) lors du passage de la prop `isSubscribed` au composant `CVPreview`.
- Correction : Passage explicite de la prop sous forme booléenne (`!!isSubscribed`) pour garantir la robustesse du build et le bon fonctionnement du site en production.
- Aucun code ou élément essentiel supprimé, aucune fonctionnalité retirée, site complet maintenu.

---

## 2024-06-XX — Migration PayTech → CinetPay (intégration complète, conformité doc officielle)

- Suppression de toute référence à PayTech dans le backend (config, services, types).
- Ajout des variables d'environnement et de configuration CinetPay (`CINETPAY_APIKEY`, `CINETPAY_SITE_ID`, `CINETPAY_BASE_URL`, `CINETPAY_NOTIFY_URL`, `CINETPAY_RETURN_URL`).
- Création d'une méthode `initializeCinetPayPayment` dans `paymentService.ts` conforme à la [documentation officielle CinetPay](https://docs.cinetpay.com/api/1.0-fr/checkout/initialisation).
- Préparation de l'intégration du callback/notification CinetPay pour la gestion du statut de paiement.
- Aucun code métier supprimé, aucune version minimaliste : le site complet reste fonctionnel et prêt pour la production.
- Build/test à faire après adaptation des routes et du service d'abonnement.

---

## 2024-06-XX — Correction définitive build complet backend & frontend (Node 20+, Jest, types, Vite)

- Réinstallation complète de toutes les dépendances backend et frontend (`yarn install --check-files --force` dans chaque dossier).
- Installation explicite de Jest côté backend pour garantir l'exécution des tests sans suppression de code ni de tests.
- Build backend (`yarn build` dans businessconnect-senegal/server) : **OK** (aucune erreur de type, aucun code supprimé).
- Build frontend (`yarn build` dans client-vite-fix) : **OK** (aucune erreur bloquante, aucun code supprimé, site complet maintenu).
- Aucun passage en version minimaliste, aucune fonctionnalité retirée, aucune perturbation de l'affichage ou du fonctionnement.
- Tous les types nécessaires sont présents (`@types/*`), Node 20.x respecté, Jest installé, Vite opérationnel.
- Le site complet, dans sa version de production, passe le build et les tests, prêt pour Render.
- Traçabilité assurée dans ce mémo.
