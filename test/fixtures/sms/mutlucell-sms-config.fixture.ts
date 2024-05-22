import { Mock } from "mockingbird";
import { MutluCellSmsConfig } from "../../../src/sms/providers";

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
