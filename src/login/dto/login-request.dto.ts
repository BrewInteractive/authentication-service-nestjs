import { IsEmail, IsNotEmpty, IsString, ValidateIf } from "class-validator";

import { AutoMap } from "@automapper/classes";

export class LoginRequest {
  @ValidateIf((o) => !o.email)
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  username: string;

  @ValidateIf((o) => !o.username)
  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email: string;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  password: string;
}
