import { version, name, description } from "../../package.json";

export default () => ({
  environment: process.env.ENVIRONMENT || "dev",
  port: process.env.PORT || 3000,
  version,
  name,
  description,
  passwordRegex: new RegExp(
    process.env.PASSWORD_REGEX || "(?=.*[A-Z])(?=.*[a-z]).*"
  ),
  swaggerEnable: process.env.SWAGGER_ENABLE === "true" || false,
  jwtAlgorithm: process.env.JWT_ALGORITHM,
  jwtAudience: process.env.JWT_AUDIENCE,
  jwtIssuer: process.env.JWT_ISSUER,
  jwtSecret: process.env.JWT_SECRET,
});
