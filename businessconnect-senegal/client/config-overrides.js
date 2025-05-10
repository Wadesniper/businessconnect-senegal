const { override } = require('customize-cra');

module.exports = override((config, env) => {
  if (env === 'development') {
    config.devServer = {
      ...config.devServer,
      allowedHosts: ['localhost', '.localhost', '127.0.0.1'],
    };
  }
  return config;
}); 