import { IsNotEmpty, IsOptional } from "class-validator";

import { AutoMap } from "@automapper/classes";
import { PhoneRequestDto } from "./phone.dto";

export class SendSignUpOtpPhoneRequest {
  @IsNotEmpty()
  @AutoMap()
  phone: PhoneRequestDto;

  @IsNotEmpty()
  @AutoMap()
  @IsOptional()
  locale?: string;

  @IsOptional()
  appData?: object;
}
