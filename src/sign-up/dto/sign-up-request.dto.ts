import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from "class-validator";

import { AUTHENTICATION_CONFIGURATIONS } from "../../config";
import { AutoMap } from "@automapper/classes";

export class SignUpRequest {
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

  @Matches(AUTHENTICATION_CONFIGURATIONS().passwordRegex, {
    message: "password is too weak",
  })
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  password: string;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  lastName: string;

  @IsOptional()
  appData: object;
}
