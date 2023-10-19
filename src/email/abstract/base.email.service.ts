import { Email } from "../dto/email.dto";
import { IBaseEmailService } from "../interfaces/email.service.interface";

export abstract class BaseEmailService implements IBaseEmailService {
  abstract sendEmailAsync(email: Email): void;
}