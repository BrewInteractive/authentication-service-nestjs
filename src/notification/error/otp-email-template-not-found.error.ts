import { AuthenticationAction } from "../../enum";

export class OtpEmailTemplateNotFoundError extends Error {
  constructor(authenticationAction: AuthenticationAction) {
    super(
      `OTP email template for "${authenticationAction}" action is not found.`
    );
  }
}
