import { Mock } from "mockingbird";
import { Tokens } from "../../../src/dto";

export class TokensFixture extends Tokens {
  @Mock((faker) => faker.datatype.string())
  id_token: string;

  @Mock((faker) => faker.datatype.string())
  refresh_token: string;
}
