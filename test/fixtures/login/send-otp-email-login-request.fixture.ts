import { SendLoginOtpEmailRequest } from "../../../src/login/dto/send-login-otp-email-request.dto";
import { Mock } from "mockingbird";

export class SendLoginOtpEmailRequestFixture extends SendLoginOtpEmailRequest{
    @Mock((faker) => faker.internet.email())
    email: string;
}