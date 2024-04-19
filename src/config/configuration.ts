import { description, name, version } from "../../package.json";

export default () => ({
  // Application info
  version,
  name,
  description,

  // Server configurations
  environment: process.env.ENVIRONMENT || "dev",
  port: process.env.PORT || 3000,
  basePath: process.env.BASE_PATH || "/",
  corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS || "*",
  swaggerEnabled: process.env.SWAGGER_ENABLED === "true" || false,

  // Authentication & authorization
  apiKey: process.env.API_KEY,
  userDefaultRole: process.env.USER_DEFAULT_ROLE,
  passwordRegex: new RegExp(
    process.env.PASSWORD_REGEX || "(?=.*[A-Z])(?=.*[a-z]).*"
  ),
  jwt: {
    algorithm: process.env.JWT_ALGORITHM,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || 3600,
  },
  refreshToken: {
    expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) || 86400,
  },

  // AWS configurations
  aws: {
    sesRegion: process.env.AWS_SES_REGION,
    sesAccessKey: process.env.AWS_SES_ACCESS_KEY_ID,
    sesSecretKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "us-east-1",
  },

  // Email Service
  emailService: process.env.EMAIL_SERVICE,
});