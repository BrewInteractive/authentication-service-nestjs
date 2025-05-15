import { Mock, MockFactory } from "mockingbird";
import {
  PhoneRequestDto,
  SignUpOtpEmailRequest,
} from "../../../src/sign-up/dto";

import { PhoneRequestFixture } from "../login";

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

  phone: PhoneRequestDto;

  withPhone() {
    this.phone = MockFactory(PhoneRequestFixture).one();
    return this;
  }
}
