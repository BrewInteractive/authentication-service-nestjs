import { Mock } from "mockingbird";
import { MutluCellSmsConfig } from "../../../node_modules/@brewww/nestjs-notification-module/dist/sms/providers/mutlucell/mutlucell-sms.config";
import { SmsServiceType } from "../../../node_modules/@brewww/nestjs-notification-module/dist/sms/enum/sms-service-type.enum";

export class MutluCellSmsConfigFixture extends MutluCellSmsConfig {
  @Mock((faker) => faker.internet.userName())
  username: string;
  @Mock((faker) => faker.internet.password())
  password: string;
  @Mock((faker) => faker.random.words)
  originator: string;
  @Mock((faker) => faker.internet.url())
  apiUrl: string;
}

export class SmsConfigFixture {
  @Mock(SmsServiceType.MUTLUCELL)
  smsService: string;

  @Mock(MutluCellSmsConfigFixture)
  mutlucell: MutluCellSmsConfigFixture;
}
