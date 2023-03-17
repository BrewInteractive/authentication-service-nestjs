import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsEmail,
  ValidateIf,
} from "class-validator";

export class LoginDto {
  @ValidateIf((o) => !o.email)
  @IsNotEmpty()
  @IsString()
  username: string;

  @ValidateIf(o => !o.username)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(8, {
    message: "password too short",
  })
  @MaxLength(20, {
    message: "password too long",
  })
  @Matches(/(?=.*\d|\W)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*/, {
    message: "password too weak",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
