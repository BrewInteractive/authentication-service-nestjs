import { Mock } from "mockingbird";
import { Tokens } from "../../../src/dto";

export class TokensFixture extends Tokens {
  @Mock((faker) => faker.datatype.string())
  idToken: string;

  @Mock((faker) => faker.datatype.string())
  refreshToken: string;
}
