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
    phone?: {
      country_code: string;
      phone_number: string;
    };
  };

  withEmailChannel() {
    this.channel = { email: faker.internet.email() };
    return this;
  }

  withPhoneChannel() {
    this.channel = {
      phone: {
        country_code: faker.word.preposition(),
        phone_number: faker.phone.number(),
      },
    };
    return this;
  }
}
