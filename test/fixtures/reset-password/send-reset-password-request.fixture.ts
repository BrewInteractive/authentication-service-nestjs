import { Mock } from "mockingbird";
import { SendResetPasswordRequest } from "./../../../src/reset-password/dto/send-reset-password-request.dto";

export class SendResetPasswordRequestFixture extends SendResetPasswordRequest {
  @Mock((faker) => faker.datatype.number())
  requestId: number;
}
