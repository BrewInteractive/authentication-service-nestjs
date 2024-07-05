process.env.EMAIL_SERVICE = "aws";
process.env.PASSWORD_REGEX =
  "(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}";
process.env.JWT_ALGORITHM = "HS256";
process.env.JWT_AUDIENCE = "test";
process.env.JWT_ISSUER = "test";
process.env.JWT_SECRET = "test";
