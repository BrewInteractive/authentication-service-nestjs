import { IsNotEmpty } from "class-validator";

import { AutoMap } from "@automapper/classes";
import { PhoneRequestDto } from "./phone.dto";

export class SendLoginOtpPhoneRequest {
  @IsNotEmpty()
  @AutoMap()
  phone: PhoneRequestDto;
}
