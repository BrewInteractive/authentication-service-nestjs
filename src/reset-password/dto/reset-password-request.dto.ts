import { IsNotEmpty, IsString, Matches } from "class-validator";

import { AUTHENTICATION_CONFIGURATIONS } from "../../config";
import { AutoMap } from "@automapper/classes";

export class ResetPasswordRequest {
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  email: string;

  @Matches(AUTHENTICATION_CONFIGURATIONS().passwordRegex, {
    message: "password is too weak",
  })
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  key: string;
}
