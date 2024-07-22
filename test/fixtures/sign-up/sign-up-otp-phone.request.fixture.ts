import { Mock } from "mockingbird";
import { PhoneRequestDto } from "../../../src/login/dto/phone.dto";
import { SignUpOtpPhoneRequest } from "../../../src/sign-up/dto";

class PhoneRequestDtoFixture extends PhoneRequestDto {
  @Mock((faker) => faker.address.countryCode())
  countryCode: string;

  @Mock((faker) => faker.phone.phoneNumber())
  number: string;
}

export class SignUpOtpPhoneRequestFixture extends SignUpOtpPhoneRequest {
  @Mock(PhoneRequestDtoFixture)
  phone: PhoneRequestDtoFixture;

  @Mock((faker) => faker.name.firstName())
  firstName: string;

  @Mock((faker) => faker.name.lastName())
  lastName: string;

  @Mock((faker) => faker.datatype.string(6))
  otpValue: string;

  @Mock()
  appData: object;
}
