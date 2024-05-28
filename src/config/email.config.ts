export const emailConfig = () => ({
  emailService: process.env.EMAIL_SERVICE,
  emailFrom: process.env.EMAIL_FROM,

  emailSubjects: {
    loginOtp: process.env.LOGIN_OTP_EMAIL_SUBJECT || "Login Otp",
  },

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

  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
});
