import { IsNotEmpty, IsNumber } from "class-validator";
import { AutoMap } from "@automapper/classes";

export class SendResetPasswordRequest {
  @IsNotEmpty()
  @IsNumber()
  @AutoMap()
  requestId: number;
}
