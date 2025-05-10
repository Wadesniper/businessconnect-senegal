describe('Forum', () => {
  it('affiche la liste des discussions', () => {
    cy.visit('/forum');
    cy.get('.discussion-listing').should('exist');
    cy.contains('Discussion');
  });

  it('affiche le détail d\'une discussion', () => {
    cy.visit('/forum');
    cy.get('.discussion-listing').first().click();
    cy.get('.discussion-detail').should('exist');
  });
}); 