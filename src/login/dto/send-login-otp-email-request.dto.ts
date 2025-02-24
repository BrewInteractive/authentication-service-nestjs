import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

import { AutoMap } from "@automapper/classes";

export class SendLoginOtpEmailRequest {
  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email: string;

  @IsNotEmpty()
  @AutoMap()
  @IsOptional()
  locale?: string;

  @IsOptional()
  appData?: object;
}
