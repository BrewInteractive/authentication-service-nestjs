import { Mock } from "mockingbird";
import { SignUpDto } from "../../../src/auth/dto/sign-up.dto";

export class SignUpFixture extends SignUpDto {
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
