import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

import { AutoMap } from "@automapper/classes";

export class SignUpOtpEmailRequest {
  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email: string;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  otpValue: string;

  @IsOptional()
  appData: object;
}
