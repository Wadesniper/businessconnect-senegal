describe('Notifications', () => {
  it('affiche la liste des notifications', () => {
    cy.login('testuser@example.com', 'Test1234!');
    cy.visit('/notifications');
    cy.get('.notification-item').should('exist');
  });

  it('permet de lire une notification', () => {
    cy.login('testuser@example.com', 'Test1234!');
    cy.visit('/notifications');
    cy.get('.notification-item').first().click();
    cy.get('.notification-detail').should('exist');
  });

  it('permet de supprimer une notification', () => {
    cy.login('testuser@example.com', 'Test1234!');
    cy.visit('/notifications');
    cy.get('.notification-item').first().find('button.delete').click();
    cy.contains('Notification supprimée');
  });
}); 