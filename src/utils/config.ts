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
});
