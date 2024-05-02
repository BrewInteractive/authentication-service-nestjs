export const emailConfigurations = () => ({
  emailService: process.env.EMAIL_SERVICE,

  aws: {
    sesRegion: process.env.AWS_SES_REGION,
    sesAccessKey: process.env.AWS_SES_ACCESS_KEY_ID,
    sesSecretKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "us-east-1",
  },

  smtp: {
    host: process.env.SMTP_HOST,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },
});
