import { IsNotEmpty, IsString, Matches } from "class-validator";

import { AutoMap } from "@automapper/classes";
import config from "../../config/configuration";

export class ResetPasswordRequest {
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  email: string;

  @Matches(config().passwordRegex, {
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
