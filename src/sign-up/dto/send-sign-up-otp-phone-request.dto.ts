import { IsNotEmpty } from "class-validator";

import { AutoMap } from "@automapper/classes";
import { PhoneRequestDto } from "./phone.dto";

export class SendSignUpOtpPhoneRequest {
  @IsNotEmpty()
  @AutoMap()
  phone: PhoneRequestDto;
}
