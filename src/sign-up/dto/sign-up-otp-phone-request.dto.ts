import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { AutoMap } from "@automapper/classes";
import { PhoneRequestDto } from "../../login/dto/phone.dto";

export class SignUpOtpPhoneRequest {
  @IsNotEmpty()
  @AutoMap()
  phone: PhoneRequestDto;

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
