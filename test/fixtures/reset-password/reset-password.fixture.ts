import { Mock } from "mockingbird";

export class ResetPasswordFixture {
  @Mock((faker) => faker.datatype.string())
  userId: string;

  @Mock((faker) => faker.internet.password())
  newPassword: string;

  @Mock((faker) => faker.datatype.string(16))
  key: string;
}
