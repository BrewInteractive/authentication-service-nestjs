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
import config from "../../config/configuration";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService({
  passwordRegex: config().passwordRegex,
});
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
      "Has to match a regular expression: " +
      configService.get("passwordRegex") +
      "",
  })
  @MinLength(8)
  @MaxLength(20)
  @Matches(configService.get("passwordRegex"))
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
