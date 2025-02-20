import { AuthenticationAction } from "../../enum";

export class OtpSmsCreatedEvent {
  phoneNumber: string;
  otpValue: string;
  authenticationAction: AuthenticationAction;
  locale?: string;
}
