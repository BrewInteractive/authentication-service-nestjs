import { IsNotEmpty, IsNumber } from "class-validator";
import { AutoMap } from "@automapper/classes/src/lib/automap";

export class SendResetPasswordRequest {
  @IsNotEmpty()
  @IsNumber()
  @AutoMap()
  requestId: number;
}
