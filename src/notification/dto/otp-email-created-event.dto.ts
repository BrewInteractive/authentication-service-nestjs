import { EAuthenticationAction } from "../../enums";

export class OtpEmailCreatedEvent {
  otpCode: string;
  userEmailAddress: string;
  authenticationAction: EAuthenticationAction;
}
