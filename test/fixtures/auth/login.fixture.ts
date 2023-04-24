import { Mock } from "mockingbird";

export class LoginFixture {
  @Mock((faker) => faker.internet.userName())
  username: string;

  @Mock((faker) => faker.internet.email())
  email: string;

  @Mock((faker) => faker.internet.password())
  password: string;
}
