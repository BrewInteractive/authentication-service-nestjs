import { AuthenticationAction } from "../../../src/enum";
import { Mock } from "mockingbird";
import { OtpSmsCreatedEvent } from "../../../src/notification/dto";

export class OtpSmsCreatedEventFixture extends OtpSmsCreatedEvent {
  @Mock((faker) => faker.datatype.string(6))
  otpValue: string;

  @Mock((faker) => faker.phone.phoneNumber())
  phoneNumber: string;

  @Mock(AuthenticationAction.LOGIN)
  authenticationAction: AuthenticationAction;
}
