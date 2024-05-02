import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { AutoMap } from "@automapper/classes";

export class LoginOtpEmailRequest {
  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email: string;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  otpCode: string;
}
