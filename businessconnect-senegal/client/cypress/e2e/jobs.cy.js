describe('Offres d\'emploi', () => {
  it('affiche la liste des offres', () => {
    cy.visit('/jobs');
    cy.get('.job-listing').should('exist');
    cy.contains('Offre'); // adapte selon le texte réel
  });

  it('permet la recherche d\'offres', () => {
    cy.visit('/jobs');
    cy.get('input[name=search]').type('Développeur');
    cy.get('button[type=submit]').click();
    cy.contains('Développeur');
  });

  it('affiche le détail d\'une offre', () => {
    cy.visit('/jobs');
    cy.get('.job-listing').first().click();
    cy.get('.job-detail').should('exist');
    cy.contains('Postuler');
  });
}); 