import { Mock } from "mockingbird";
import { ResetPasswordCreatedEvent } from "../../../src/notification/dto";

export class ResetPasswordCreatedEventFixture extends ResetPasswordCreatedEvent {
  @Mock((faker) => faker.internet.url())
  resetLink: string;

  @Mock((faker) => faker.internet.email())
  emailAddress: string;
}
