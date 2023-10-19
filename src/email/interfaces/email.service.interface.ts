import { Email } from "../dto/email.dto";

export interface IBaseEmailService {
  sendEmailAsync(email: Email): void;
}