import { SendResetPasswordRequest } from "./../../../src/reset-password/dto/send-reset-password-request.dto";
import { Mock } from "mockingbird";

export class SendResetPasswordRequestFixture extends SendResetPasswordRequest {
  @Mock((faker) => faker.datatype.number())
  requestId: number;
}
