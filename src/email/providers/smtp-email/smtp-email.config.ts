export class SmtpEmailConfig {
  host: string;
  port: string;
  auth: {
    user: string;
    pass: string;
  };
  tls: {
    rejectUnauthorized: boolean;
  };
}
