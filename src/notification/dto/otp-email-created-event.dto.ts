import { AuthenticationAction } from "../../enum";

export class OtpEmailCreatedEvent {
  otpValue: string;
  emailAddress: string;
  authenticationAction: AuthenticationAction;
  locale?: string;
  appData?: object;
}
