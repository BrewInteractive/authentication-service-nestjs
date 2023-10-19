import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { AutoMap } from "@automapper/classes";
import config from "../../utils/config";

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

  @ApiProperty({
    description:
      "Has to match a regular expression: " + config().passwordRegex + "",
  })
  @MinLength(8)
  @MaxLength(20)
  @Matches(config().passwordRegex)
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
