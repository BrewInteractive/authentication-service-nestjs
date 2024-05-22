import { Mock } from "mockingbird";
import { SmsServiceType } from "../../../src/sms/enum/sms-service-type.enum";
import { MutluCellSmsConfigFixture } from "../sms/mutlucell-sms-config.fixture";

export class SmsConfigFixture {
  @Mock(SmsServiceType.MUTLUCELL)
  smsService: string;

  @Mock(MutluCellSmsConfigFixture)
  mutlucell: MutluCellSmsConfigFixture;
}
