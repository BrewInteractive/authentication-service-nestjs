const { version, name, description } = require('../../package.json');

export default () => ({
    environment: process.env.ENVIRONMENT || 'dev',
    port: process.env.PORT || 3000,
    version,
    name,
    description
  });