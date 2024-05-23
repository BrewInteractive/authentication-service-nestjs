import { Mock } from "mockingbird";
import { SendLoginOtpPhoneRequest } from "../../../src/login/dto/send-login-otp-phone-request.dto";

export class SendLoginOtpPhoneRequestFixture extends SendLoginOtpPhoneRequest {
  @Mock((faker) => faker.address.countryCode())
  countryCode: string;

  @Mock((faker) => faker.phone.phoneNumber())
  phoneNumber: string;
}
