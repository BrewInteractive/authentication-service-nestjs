import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

import { AutoMap } from "@automapper/classes";
import { authenticationConfig } from "../../config";

export class ResetPasswordRequest {
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  @IsEmail()
  email: string;

  @Matches(authenticationConfig().passwordRegex, {
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
