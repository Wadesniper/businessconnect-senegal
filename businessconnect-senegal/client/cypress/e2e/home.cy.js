describe('Page d\'accueil', () => {
  it('affiche le titre et les éléments principaux', () => {
    cy.visit('/');
    cy.contains('BusinessConnect Sénégal'); // adapte selon le vrai titre
    cy.get('nav').should('exist');
    cy.get('footer').should('exist');
  });
}); 