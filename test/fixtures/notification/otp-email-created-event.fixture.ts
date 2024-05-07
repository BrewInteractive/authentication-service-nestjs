import { AuthenticationAction } from "../../../src/enum";
import { Mock } from "mockingbird";
import { OtpEmailCreatedEvent } from "../../../src/notification/dto/otp-email-created-event.dto";

export class OtpEmailCreatedEventFixture extends OtpEmailCreatedEvent {
  @Mock((faker) => faker.datatype.string(6))
  otpValue: string;

  @Mock((faker) => faker.internet.email())
  emailAddress: string;

  @Mock(AuthenticationAction.LOGIN)
  authenticationAction: AuthenticationAction;
}
