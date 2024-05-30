import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from "class-validator";

import { AutoMap } from "@automapper/classes";
import { PhoneRequestDto } from "../../login/dto/phone.dto";
import { authenticationConfig } from "../../config";

export class SignUpRequest {
  @ValidateIf((o) => !o.email && !o.phone)
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  username: string;

  @ValidateIf((o) => !o.username && !o.phone)
  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email: string;

  @ValidateIf((o) => !o.email && !o.username)
  @IsNotEmpty()
  @AutoMap()
  phone: PhoneRequestDto;

  @Matches(authenticationConfig().passwordRegex, {
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
