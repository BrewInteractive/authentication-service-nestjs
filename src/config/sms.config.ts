export const smsConfig = () => ({
  smsService: process.env.SMS_SERVICE,
  mutlucell: {
    username: process.env.MUTLUCELL_USERNAME,
    password: process.env.MUTLUCELL_PASSWORD,
    originator: process.env.MUTLUCELL_ORIGINATOR,
    apiUrl: process.env.MUTLUCELL_API_URL,
  },
});
