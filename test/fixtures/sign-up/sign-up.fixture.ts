import { Mock } from "mockingbird";

export class SignUpFixture {
  @Mock((faker) => faker.internet.userName())
  username: string;

  @Mock((faker) => faker.internet.email())
  email: string;

  @Mock((faker) => faker.internet.password())
  password: string;

  @Mock((faker) => faker.name.firstName())
  firstName: string;

  @Mock((faker) => faker.name.lastName())
  lastName: string;

}
