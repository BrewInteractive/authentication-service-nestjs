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

  @Mock((faker) => faker.date.future())
  expiresAt: Date;

  @Mock()
  resendableAt: Date;

  @Mock()
  value: string;

  @Mock()
  channel: {
    email?: string;
  };

  withEmailChannel(size: number = 2) {
    this.channel = { email: faker.internet.email() };
    return this;
  }
}
