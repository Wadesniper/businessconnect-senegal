// Test end-to-end Cypress pour la page d'accueil BusinessConnect Sénégal

describe('Page d\'accueil - Home', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Affiche le Hero et la Navbar', () => {
    cy.contains('Découvrir nos services').should('be.visible');
    cy.get('nav').should('exist');
  });

  it('Scroll vers la section Nos Services Professionnels', () => {
    cy.contains('Découvrir nos services').click();
    cy.contains('Nos Services Professionnels').should('be.visible');
  });

  it('Affiche l\'aperçu des 3 dernières offres d\'emploi', () => {
    cy.contains('Emploi').should('be.visible');
    cy.get('[data-testid="job-preview"]').should('have.length', 3);
    cy.contains('Voir toutes les offres').should('be.visible');
  });

  it('Affiche la section CV avec le bouton', () => {
    cy.contains('Créer mon CV maintenant').should('be.visible');
  });

  it('Affiche la section Marketplace avec les boutons', () => {
    cy.contains('Vendre un service').should('be.visible');
    cy.contains('Explorer tout').should('be.visible');
  });

  it('Affiche le carrousel des secteurs', () => {
    cy.contains('Secteurs d\'activité').should('be.visible');
    cy.get('[data-testid="sector-carousel"]').should('exist');
  });

  it('Affiche les 4 cartes statistiques', () => {
    cy.get('[data-testid="stat-card"]').should('have.length', 4);
  });

  it('Aucun message d\'erreur JS dans la console', () => {
    cy.window().then((win) => {
      cy.stub(win.console, 'error').as('consoleError');
    });
    cy.reload();
    cy.get('@consoleError').should('not.have.been.called');
  });
}); 