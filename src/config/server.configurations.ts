export const serverConfigurations = () => ({
  environment: process.env.ENVIRONMENT || "dev",
  port: process.env.PORT || 3000,
  basePath: process.env.BASE_PATH || "/",
  corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS || "*",
  swaggerEnabled: process.env.SWAGGER_ENABLED === "true" || false,
});
