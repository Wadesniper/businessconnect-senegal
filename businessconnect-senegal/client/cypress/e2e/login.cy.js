describe('Connexion', () => {
  it('affiche le formulaire de connexion', () => {
    cy.visit('/login');
    cy.get('input[name=email]').should('exist');
    cy.get('input[name=password]').should('exist');
    cy.get('button[type=submit]').should('exist');
  });

  it('gère une connexion valide', () => {
    cy.visit('/login');
    cy.get('input[name=email]').type('testuser@example.com');
    cy.get('input[name=password]').type('Test1234!');
    cy.get('button[type=submit]').click();
    cy.contains('Tableau de bord'); // adapte selon le texte affiché après connexion
  });
}); 