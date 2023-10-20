import { Email } from "./dto/email.dto";
import { IEmailService } from "./interfaces/email.service.interface";

export abstract class EmailService implements IEmailService {
  abstract sendEmailAsync(email: Email): void;
}
