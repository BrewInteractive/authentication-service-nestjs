export const authenticationConfigurations = () => ({
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
});
