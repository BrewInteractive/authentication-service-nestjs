import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { AutoMap } from "@automapper/classes";
import config from "../../utils/config";

export class ResetPasswordRequest {
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  userId: string;

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
  newPassword: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  key: string
}
