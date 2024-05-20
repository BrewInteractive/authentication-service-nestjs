import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { AutoMap } from "@automapper/classes";

export class CreateResetPasswordRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @AutoMap()
  email: string;
}
