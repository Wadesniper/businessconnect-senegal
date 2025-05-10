describe('Sécurité & expérience utilisateur', () => {
  it('redirige vers la connexion si non authentifié', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });

  it('interdit l\'accès à une page admin sans rôle admin', () => {
    cy.login('testuser@example.com', 'Test1234!');
    cy.visit('/admin/users');
    cy.contains('Accès interdit');
  });

  it('affiche une page 404 pour une route inconnue', () => {
    cy.visit('/route-inconnue', { failOnStatusCode: false });
    cy.contains('404');
  });

  it('le site est responsive (menu burger visible en mobile)', () => {
    cy.viewport('iphone-6');
    cy.visit('/');
    cy.get('.burger-menu').should('be.visible');
  });
}); 