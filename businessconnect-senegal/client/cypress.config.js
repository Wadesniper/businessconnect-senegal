const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // port forcé selon le serveur Vite
    specPattern: 'cypress/**/*.cy.{js,ts,jsx,tsx}',
  },
}); 