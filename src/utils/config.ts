import { description, name, version } from "../../package.json";

export default () => ({
  environment: process.env.ENVIRONMENT || "dev",
  port: process.env.PORT || 3000,
  version,
  name,
  description,
  passwordRegex: new RegExp(
    process.env.PASSWORD_REGEX || "(?=.*[A-Z])(?=.*[a-z]).*"
  ),
  swaggerEnabled: process.env.SWAGGER_ENABLED === "true" || false,
  jwtAlgorithm: process.env.JWT_ALGORITHM,
  jwtAudience: process.env.JWT_AUDIENCE,
  jwtIssuer: process.env.JWT_ISSUER,
  jwtSecret: process.env.JWT_SECRET,
});
