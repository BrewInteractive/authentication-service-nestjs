import { Mock } from "mockingbird";
import { SignUpOtpEmailRequest } from "../../../src/sign-up/dto";

export class SignUpOtpEmailRequestFixture extends SignUpOtpEmailRequest {
  @Mock((faker) => faker.internet.email())
  email: string;

  @Mock((faker) => faker.name.firstName())
  firstName: string;

  @Mock((faker) => faker.name.lastName())
  lastName: string;

  @Mock((faker) => faker.datatype.string(6))
  otpValue: string;

  @Mock()
  appData: object;
}
