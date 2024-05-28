import { LoginOtpEmailRequest } from "../../../src/login/dto/login-otp-email-request.dto";
import { LoginOtpPhoneRequest } from "../../../src/login/dto/login-otp-phone-request.dto";
import { LoginRequest } from "../../../src/login/dto/login-request.dto";
import { Mock } from "mockingbird";
import { PhoneRequestDto } from "../../../src/login/dto/phone.dto";
import { SendLoginOtpEmailRequest } from "../../../src/login/dto/send-login-otp-email-request.dto";

export class LoginOtpEmailRequestFixture extends LoginOtpEmailRequest {
  @Mock((faker) => faker.internet.email())
  email: string | null;

  @Mock((faker) => faker.datatype.string(6))
  otpValue: string;
}

export class LoginRequestFixture extends LoginRequest {
  @Mock((faker) => faker.internet.userName())
  username: string | null;

  @Mock((faker) => faker.internet.email())
  email: string | null;

  @Mock((faker) => faker.internet.password())
  password: string;
}

export class PhoneRequestFixture extends PhoneRequestDto {
  @Mock((faker) => faker.datatype.string(2))
  countryCode: string;

  @Mock((faker) => faker.datatype.string(10))
  phoneNumber: string;
}

export class LoginOtpPhoneRequestFixture extends LoginOtpPhoneRequest {
  @Mock(PhoneRequestFixture)
  phone: PhoneRequestFixture;

  @Mock((faker) => faker.datatype.string(6))
  otpValue: string;
}

export class SendLoginOtpEmailRequestFixture extends SendLoginOtpEmailRequest {
  @Mock((faker) => faker.internet.email())
  email: string;
}
