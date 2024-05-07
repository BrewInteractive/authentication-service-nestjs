import { EAuthenticationAction } from "../../../src/enums";
import { Mock } from "mockingbird";
import { OtpEmailCreatedEvent } from "../../../src/notification/dto/otp-email-created-event.dto";

export class OtpEmailCreatedEventFixture extends OtpEmailCreatedEvent {
  @Mock((faker) => faker.datatype.string(6))
  otpCode: string;

  @Mock((faker) => faker.internet.email())
  userEmailAddress: string;

  @Mock(EAuthenticationAction.EMAIL_LOGIN_OTP)
  authenticationAction: EAuthenticationAction;
}
