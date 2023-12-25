import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { AutoMap } from "@automapper/classes";
import config from "../../config/configuration";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService({
  passwordRegex: config().passwordRegex,
});

export class ResetPasswordRequest {
  @IsNotEmpty()
  @IsString()
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
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  key: string;
}
