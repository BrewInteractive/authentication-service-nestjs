import { AuthenticationAction } from "../../enum";

export class OtpSmsTemplateNotFoundError extends Error {
  constructor(authenticationAction: AuthenticationAction) {
    super(
      `OTP sms template for "${authenticationAction}" action is not found.`
    );
  }
}
