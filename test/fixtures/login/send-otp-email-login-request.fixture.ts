import { Mock } from "mockingbird";
import { SendLoginOtpEmailRequest } from "../../../src/login/dto/send-login-otp-email-request.dto";

export class SendLoginOtpEmailRequestFixture extends SendLoginOtpEmailRequest {
  @Mock((faker) => faker.internet.email())
  email: string;
}
