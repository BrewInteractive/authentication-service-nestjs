import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsEmail,
  ValidateIf,
  IsOptional,
} from "class-validator";
import config from "../../utils/config";
import { AutoMap } from "@automapper/classes";

export class SignUpDto {
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
