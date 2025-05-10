describe('Admin', () => {
  it('affiche la liste des utilisateurs', () => {
    cy.login('admin@example.com', 'Admin1234!');
    cy.visit('/admin/users');
    cy.get('.user-listing').should('exist');
  });

  it('permet de modifier un utilisateur', () => {
    cy.login('admin@example.com', 'Admin1234!');
    cy.visit('/admin/users');
    cy.get('.user-listing').first().find('button.edit').click();
    cy.get('input[name=firstName]').clear().type('AdminModif');
    cy.get('button[type=submit]').click();
    cy.contains('Utilisateur modifié');
  });

  it('affiche la liste des offres', () => {
    cy.login('admin@example.com', 'Admin1234!');
    cy.visit('/admin/jobs');
    cy.get('.job-listing').should('exist');
  });

  it('affiche les statistiques', () => {
    cy.login('admin@example.com', 'Admin1234!');
    cy.visit('/admin/stats');
    cy.get('.stats').should('exist');
  });
}); 