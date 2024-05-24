import { description, name, version } from "../../package.json";

export const appConfig = () => ({
  version,
  name,
  description,
  errorCodePrefix: process.env.ERROR_CODE_PREFIX || "ERR",
});
