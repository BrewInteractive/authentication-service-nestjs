import { IsEmail, IsNotEmpty } from "class-validator";

import { AutoMap } from "@automapper/classes";

export class SendSignUpOtpEmailRequest {
  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email: string;
}
