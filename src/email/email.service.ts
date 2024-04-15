import { Email } from "./dto/email.dto";

export abstract class EmailService {
  abstract sendEmailAsync(email: Email): Promise<void>;
}
