import { Email } from "../dto/email.dto";

export interface IEmailService {
  sendEmailAsync(email: Email): void;
}
