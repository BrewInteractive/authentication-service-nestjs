import { Email } from "../dto/email.dto";

export abstract class BaseEmailService {
  abstract sendEmailAsync(email: Email): void;
}
