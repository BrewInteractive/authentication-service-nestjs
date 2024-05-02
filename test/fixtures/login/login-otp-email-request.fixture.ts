import { LoginOtpEmailRequest } from "../../../src/login/dto/login-otp-email-request.dto";
import { Mock } from "mockingbird";

export class LoginOtpEmailRequestFixture extends LoginOtpEmailRequest {
  @Mock((faker) => faker.internet.email())
  email: string | null;

  @Mock((faker) => faker.datatype.string(6))
  otpCode: string;
}
