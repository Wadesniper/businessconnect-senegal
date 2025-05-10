describe('Tableau de bord utilisateur', () => {
  it('affiche les informations principales', () => {
    cy.login('testuser@example.com', 'Test1234!'); // suppose une commande personnalisée cy.login
    cy.visit('/dashboard');
    cy.contains('Bienvenue'); // adapte selon le texte réel
    cy.get('.user-info').should('exist');
  });

  it('permet la navigation vers les autres sections', () => {
    cy.login('testuser@example.com', 'Test1234!');
    cy.visit('/dashboard');
    cy.get('nav').contains('Profil').click();
    cy.url().should('include', '/profile');
  });
}); 