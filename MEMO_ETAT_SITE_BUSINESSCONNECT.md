# MEMO_ETAT_SITE_BUSINESSCONNECT

## 2024-05-10

### État général
- **Site en phase finale, build client OK, toutes les dépendances installées.**
- **Aucune perturbation de l'affichage ou du fonctionnement.**

### Fonctionnalités critiques validées
- **Inscription, connexion, abonnement, sécurité** : validés et testés.
- **Tests automatisés backend et frontend** : passent sans erreur bloquante.
- **Compte admin** : opérationnel, jamais bloqué par l'abonnement.

### Page d'accueil
- **Hero** : titre général + carrousel de 13 images avec descriptions, conforme.

### Offres d'emploi
- **Boutons "Voir détails" et "Postuler"** :
  - Affichent un cadenas si l'utilisateur n'est pas abonné.
  - Cliquer dessus redirige vers la page d'abonnement.
  - Si abonné, accès normal à la modale de détails et à la candidature.
- **Aucune page /jobs/:id dédiée, tout se fait en modale.**

### Formations
- **Page formations** :
  - Affiche la liste des domaines.
  - Redirige vers la bonne URL Cursa selon le domaine choisi.
  - Pas de page "FormationDetail", pas de mention de Cursa dans la page.

### Build & déploiement
- **Build client** : OK, toutes les erreurs corrigées (fichiers manquants, imports, styles, etc.).
- **Prêt pour déploiement Render.**

## Avancement des templates CV sectoriels (juin 2024)

- **Finance** : Template moderne, complet, adapté au secteur, avatar par défaut masculin, exemples de données réalistes (expérience, compétences, diplômes, certifications, langues).
- **Marketing** : Template dynamique, couleurs chaudes, avatar féminin, structure complète, exemples inspirants pour le marketing digital, la communication, etc.
- **Santé** : Template apaisant, couleurs bleu/vert, avatar féminin, structure complète, exemples pour le médical, l'hospitalier, les compétences et certifications santé.
- **Éducation** : Template doux, couleurs bleues, avatar masculin, structure complète, exemples pour l'enseignement, la pédagogie, les diplômes, etc.
- **Commerce** : Template vif, couleurs rouges, avatar masculin, structure complète, exemples pour la vente, la négociation, la gestion commerciale, etc.
- **Administration / RH** : Template sobre, couleurs vertes, avatar féminin, structure complète, exemples pour la gestion, les RH, l'administration publique ou privée.
- **Tech / Informatique** : Template moderne, bleu, avatar masculin, structure complète, exemples pour développeur, ingénieur, data, etc.
- **Logistique / Transport** : Template jaune/orange, avatar masculin, structure complète, exemples supply chain, gestion de flotte, etc.
- **BTP / Ingénierie** : Template gris/bleu, avatar masculin, structure complète, exemples chantier, architecture, génie civil, etc.
- **Art / Création / Design** : Template violet/rose, avatar féminin, structure complète, exemples graphisme, design, illustration, etc.
- **Hôtellerie / Tourisme** : Template bleu clair/turquoise, avatar féminin, structure complète, exemples accueil, animation, restauration, etc.
- **Juridique / Droit** : Template bleu foncé/gris, avatar masculin, structure complète, exemples avocat, juriste, assistant juridique, etc.
- **Communication / Médias** : Template bleu/rose, avatar féminin, structure complète, exemples journaliste, communicant, community manager, etc.
- **Agroalimentaire / Agriculture** : Template vert/jaune, avatar masculin, structure complète, exemples technicien agricole, ingénieur agro, etc.
- **Humanitaire / Social** : Template bleu ciel/rose, avatar féminin, structure complète, exemples ONG, éducateur, travailleur social, etc.
- **Banque / Assurance** : Template bleu nuit/or, avatar masculin, structure complète, exemples conseiller bancaire, gestionnaire assurance, etc.

**Tous les templates sont pensés pour être attractifs, professionnels, responsive, et adaptés à la cible sénégalaise.**

**Le process utilisateur est fluide : sélection du modèle, formulaire intuitif, aperçu dynamique, personnalisation, export réservé aux abonnés.**

*(Mise à jour automatique par l'IA lors de chaque ajout de template)*

## 2024-06-XX

### Intégration des templates CV sectoriels
- **Centralisation de la configuration des templates dans un fichier unique (`components/data/templates.ts`)**.
- **Harmonisation de tous les composants du générateur de CV pour utiliser cette source unique**.
- **Correction et extension du typage (`Template`) pour inclure tous les champs nécessaires (premium, features, component, etc.)**.
- **Affichage dynamique, sélection, aperçu, personnalisation et export testés et validés pour tous les modèles sectoriels**.
- **Aucune anomalie bloquante, UI/UX robuste et professionnelle**.

### Prochaines étapes
- Tests finaux d'UX et d'export PDF.
- Documentation continue.

## 2024-06-XX — Mise à jour du flux de candidature offres d'emploi

### Nouveau process (juin 2024)
- **Page de détails d'offre dédiée (/jobs/:id)** :
  - Accessible uniquement pour les utilisateurs abonnés (étudiant, annonceur, employeur).
  - Affiche tous les détails de l'offre (titre, entreprise, lieu, type, secteur, description, prérequis, etc.).
  - **Coordonnées de contact** (email et/ou téléphone) affichées en clair, facilement copiables.
  - **Email** :
    - Cliquable (mailto:), ouvre le client mail avec objet et corps pré-remplis (sans mention de businessconnectsenegal).
    - Objet et corps du mail affichés pour copie rapide.
  - **Téléphone** :
    - Cliquable (tel:), ouvre le client d'appel du téléphone.
    - Numéro affiché en clair et copiable.
  - Si les deux sont présents, les deux options sont proposées.
- **Bouton "Postuler" sur la page des offres** :
  - Si non abonné : redirige vers la page d'abonnement.
  - Si abonné : redirige vers la page de détails de l'offre (/jobs/:id).
- **Expérience utilisateur** :
  - Processus fluide, intuitif, sans friction, adapté mobile et desktop.
  - Plus de modale pour la candidature, tout passe par la page dédiée.

### À jour
- Routeur mis à jour pour inclure la page /jobs/:id.
- Tests réalisés :
  - Affichage d'une offre unique OK.
  - Publication d'une nouvelle offre par admin/employeur : visible instantanément pour tous.
  - Accès aux coordonnées et actions de contact testés et validés.

---

**Dernière MAJ : 2024-06-XX**

# État des abonnements BusinessConnect Sénégal (mise à jour)

## Types d'abonnement réels (production)

- **Étudiant / Demandeur d'emploi** : 1000 FCFA / mois
  - Accès : Générateur de CV, consultation d'offres, candidatures, fonctionnalités adaptées à la recherche d'emploi.
- **Annonceur** : 5000 FCFA / mois
  - Accès : Publication d'annonces, gestion de visibilité, outils de promotion.
- **Employeur / Recruteur** : 9000 FCFA / mois
  - Accès : Publication illimitée d'offres, accès à la CVthèque, gestion des candidatures, outils RH avancés.

## Règle d'accès
- Après abonnement, chaque utilisateur accède uniquement aux fonctionnalités correspondant à son type d'abonnement.
- Les anciens types ('free', 'premium', 'enterprise') sont remplacés par ces 3 types réels.

## Paiement
- Le bouton "S'abonner" doit rediriger automatiquement vers l'interface CinetPay avec les clés de production.
- Les clés CinetPay sont valides et en production.

## À faire
- Vérifier que le bouton "S'abonner" fonctionne et redirige bien vers CinetPay.
- Adapter toute la logique d'abonnement et d'affichage selon ces 3 types uniquement.

# État de validation des pages BusinessConnect Sénégal

## ✅ Accueil (Home)
- Affichage, navigation, responsive, données dynamiques : validés
- Tous les tests unitaires passent
- Aucun bug, aucun warning

## ✅ Offres d'emploi (Jobs)
- Affichage dynamique des offres depuis la BDD (MongoDB via API)
- Filtres interactifs (secteur, type, localisation)
- Test automatique complet (affichage, filtrage, navigation)
- Aucune donnée sensible affichée (salaire, expérience)
- Aucun bug, aucun warning

## ✅ Formations
- Liste statique des domaines, aucune dépendance à la BDD
- Description claire pour chaque domaine
- Bouton "Accéder" : redirection vers l'URL du domaine si abonné, sinon vers /subscription
- Aucun affichage du mot "Cursa"
- Test automatique : affichage, redirection abonné, redirection non abonné
- Beauté et structure respectées (cards, responsive, design cohérent)
- Aucun bug, aucun warning

---

**Prochaine étape : Marketplace**

---

*Dernière mise à jour : [date et heure de la modification]* 