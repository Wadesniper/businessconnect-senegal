describe('Profil utilisateur', () => {
  it('affiche et permet d\'éditer les informations du profil', () => {
    cy.login('testuser@example.com', 'Test1234!');
    cy.visit('/profile');
    cy.get('input[name=firstName]').clear().type('TestModif');
    cy.get('button[type=submit]').click();
    cy.contains('Profil mis à jour'); // adapte selon le message réel
  });

  it('permet d\'uploader un avatar', () => {
    cy.login('testuser@example.com', 'Test1234!');
    cy.visit('/profile');
    cy.get('input[type=file][name=avatar]').selectFile('cypress/fixtures/avatar.png');
    cy.get('button[type=submit]').click();
    cy.contains('Profil mis à jour');
  });

  it('permet de changer le mot de passe', () => {
    cy.login('testuser@example.com', 'Test1234!');
    cy.visit('/profile');
    cy.get('input[name=currentPassword]').type('Test1234!');
    cy.get('input[name=newPassword]').type('NouveauPass123!');
    cy.get('button[type=submit]').click();
    cy.contains('Mot de passe modifié');
  });
}); 