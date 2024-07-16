import { Mock } from "mockingbird";
import { PhoneRequestFixture } from "../login";
import {
  SignUpRequest,
  SendSignUpOtpPhoneRequest,
} from "../../../src/sign-up/dto";

export class SignUpRequestFixture extends SignUpRequest {
  @Mock((faker) => faker.internet.userName())
  username: string | null;

  @Mock((faker) => faker.internet.email())
  email: string | null;

  @Mock((faker) => faker.internet.password())
  password: string;

  @Mock(PhoneRequestFixture)
  phone: PhoneRequestFixture | null;

  @Mock((faker) => faker.name.firstName())
  firstName: string;

  @Mock((faker) => faker.name.lastName())
  lastName: string;

  @Mock()
  appData: object;
}

export class SendSignUpOtpPhoneRequestFixture extends SendSignUpOtpPhoneRequest {
  @Mock(PhoneRequestFixture)
  phone: PhoneRequestFixture;
}
