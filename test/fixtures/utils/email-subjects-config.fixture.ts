import { Mock } from "mockingbird";

export class EmailSubjects {
  @Mock((faker) => faker.lorem.words(3))
  resetPassword: string;
}
