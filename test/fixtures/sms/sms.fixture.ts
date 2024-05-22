import { Mock } from "mockingbird";
import { Sms } from "../../../src/sms/dto/sms.dto";

export class SmsFixture extends Sms {
  @Mock((faker) => faker.random.words())
  message: string;
  @Mock((faker) => faker.phone.phoneNumber())
  phoneNumber: string;
}
