import { Mock } from "mockingbird";
import { Otp } from "../../../src/entities/otp.entity";
import { faker } from "@faker-js/faker";

export class OtpFixture extends Otp {
  @Mock((faker) => faker.datatype.uuid())
  id: string;

  @Mock()
  createdAt: Date;

  @Mock()
  updatedAt: Date;

  @Mock()
  expiresAt: Date;

  @Mock()
  resendableAt: Date;

  @Mock()
  value: string;

  @Mock()
  channel: {
    email?: string;
  };

  withEmailChannel() {
    this.channel = { email: faker.internet.email() };
    return this;
  }
}
