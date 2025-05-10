# Tests E2E Cypress – BusinessConnect Sénégal

## Lancer les tests

1. Se placer dans le dossier `client/` :
   ```bash
   cd businessconnect-senegal/client
   ```
2. Lancer Cypress :
   ```bash
   npx cypress open
   ```
   ou en mode headless :
   ```bash
   npx cypress run
   ```

## Structure des tests
- Les tests sont dans `cypress/e2e/`
- Un fichier par page/fonctionnalité (ex : `home.cy.js`, `login.cy.js`)

## Ajouter un test
1. Créer un nouveau fichier dans `cypress/e2e/` (ex : `dashboard.cy.js`)
2. Suivre l'exemple des fichiers existants
3. Adapter les sélecteurs et assertions selon la page

## Bonnes pratiques
- Ne jamais modifier le code métier du site pour les tests
- Toujours valider les tests avant tout déploiement
- Documenter tout nouveau scénario ajouté

---

**Contact :** Voir le mémo technique à la racine du projet pour l'état global et les instructions de continuité. 