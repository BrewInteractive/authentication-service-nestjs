import { Mock } from "mockingbird";
import { JWTFixture } from './jwt.fixture';

export class ConfigFixture {
  @Mock("test")
  environment: string;

  @Mock((faker) => faker.datatype.string())
  apiKey: string;

  @Mock(JWTFixture)
  jwt: JWTFixture;

  @Mock(3000)
  port: number;

  @Mock("test")
  version: string;

  @Mock((faker) => faker.datatype.string())
  name: string;

  @Mock((faker) => faker.datatype.string())
  description: string;

  @Mock("*")
  corsAllowedOrigins: string;

  @Mock(new RegExp("(?=.*[A-Z])(?=.*[a-z]).*"))
  passwordRegex: RegExp;

  @Mock(false)
  swaggerEnabled: boolean;

  @Mock("user")
  userDefaultRole: string;
}
