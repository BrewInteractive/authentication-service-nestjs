import { IsNotEmpty, IsString, Matches } from "class-validator";

import { AutoMap } from "@automapper/classes";
import { authenticationConfigurations } from "../../config";

export class ResetPasswordRequest {
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  email: string;

  @Matches(authenticationConfigurations().passwordRegex, {
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
