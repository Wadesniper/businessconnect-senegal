describe('Abonnement', () => {
  it('affiche le statut d\'abonnement', () => {
    cy.login('testuser@example.com', 'Test1234!');
    cy.visit('/subscription');
    cy.contains('Statut de l\'abonnement');
    cy.get('.subscription-status').should('exist');
  });

  it('permet de souscrire à un abonnement', () => {
    cy.login('testuser@example.com', 'Test1234!');
    cy.visit('/subscription');
    cy.get('button.subscribe').click();
    cy.contains('Abonnement actif');
  });

  it('permet de renouveler un abonnement', () => {
    cy.login('testuser@example.com', 'Test1234!');
    cy.visit('/subscription');
    cy.get('button.renew').click();
    cy.contains('Abonnement renouvelé');
  });
}); 