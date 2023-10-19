import { LoginRequest } from "../../../src/login/dto/login-request.dto";
import { Mock } from "mockingbird";

export class LoginFixture extends LoginRequest {
  @Mock((faker) => faker.internet.userName())
  username: string | null;

  @Mock((faker) => faker.internet.email())
  email: string | null;

  @Mock((faker) => faker.internet.password())
  password: string;
}
