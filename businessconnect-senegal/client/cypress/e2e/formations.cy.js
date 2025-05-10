describe('Formations', () => {
  it('affiche la liste des formations', () => {
    cy.visit('/formations');
    cy.get('.formation-listing').should('exist');
    cy.contains('Formation');
  });

  it('affiche le détail d\'une formation', () => {
    cy.visit('/formations');
    cy.get('.formation-listing').first().click();
    cy.get('.formation-detail').should('exist');
  });
}); 