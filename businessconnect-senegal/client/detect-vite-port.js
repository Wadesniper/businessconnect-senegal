const fs = require('fs');
const ports = [3000, 3001, 3002, 3003, 3004];
const http = require('http');

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get({ hostname: 'localhost', port, path: '/', timeout: 500 }, (res) => {
      res.resume();
      resolve(port);
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

(async () => {
  for (const port of ports) {
    const result = await checkPort(port);
    if (result) {
      // Met à jour cypress.config.js
      const configPath = './cypress.config.js';
      let config = fs.readFileSync(configPath, 'utf8');
      config = config.replace(/baseUrl: 'http:\/\/localhost:\d+'/, `baseUrl: 'http://localhost:${port}'`);
      fs.writeFileSync(configPath, config, 'utf8');
      console.log(`Port Vite détecté: ${port}. cypress.config.js mis à jour.`);
      process.exit(0);
    }
  }
  console.error('Aucun serveur Vite détecté sur les ports 3000-3004.');
  process.exit(1);
})(); 