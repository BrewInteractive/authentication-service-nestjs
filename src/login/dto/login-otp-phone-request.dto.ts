import { IsNotEmpty, IsString } from "class-validator";

import { AutoMap } from "@automapper/classes";
import { PhoneRequestDto } from "./phone.dto";

export class LoginOtpPhoneRequest {
  @IsNotEmpty()
  @AutoMap()
  phone: PhoneRequestDto;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  otpValue: string;
}
