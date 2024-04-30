import { Mock } from "mockingbird";
import { SignUpRequest } from "../../../src/sign-up/dto/sign-up-request.dto";

export class SignUpRequestFixture extends SignUpRequest {
  @Mock((faker) => faker.internet.userName())
  username: string | null;

  @Mock((faker) => faker.internet.email())
  email: string | null;

  @Mock((faker) => faker.internet.password())
  password: string;

  @Mock((faker) => faker.name.firstName())
  firstName: string;

  @Mock((faker) => faker.name.lastName())
  lastName: string;

  @Mock()
  appData: object;
}
