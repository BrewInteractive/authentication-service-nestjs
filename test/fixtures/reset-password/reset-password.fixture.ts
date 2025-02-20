import { Mock } from "mockingbird";

export class ResetPasswordFixture {
  @Mock((faker) => faker.internet.email())
  email: string;

  @Mock((faker) => faker.internet.password())
  newPassword: string;

  @Mock((faker) => faker.datatype.string(16))
  key: string;

  locale: string;

  withLocale(locale?: string) {
    this.locale = locale ?? "en";
    return this;
  }
}
