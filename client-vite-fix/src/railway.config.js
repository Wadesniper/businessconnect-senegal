module.exports = {
  project: {
    name: 'businessconnect-senegal',
    services: [
      {
        name: 'web',
        startCommand: 'npm start',
        buildCommand: 'npm install && npm run build',
        healthcheck: {
          path: '/',
          port: 3000
        },
        envs: {
          NODE_ENV: 'production',
          PORT: 3000
        }
      }
    ]
  }
}; 