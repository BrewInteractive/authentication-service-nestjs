export default () => ({
    environment: process.env.ENVIRONMENT || 'dev',
    port: process.env.PORT || 3000,
    version: process.env.npm_package_version,
  });