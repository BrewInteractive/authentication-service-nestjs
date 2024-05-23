import { IsNotEmpty } from "class-validator";

import { AutoMap } from "@automapper/classes";

export class SendLoginOtpPhoneRequest {
  @IsNotEmpty()
  @AutoMap()
  countryCode: string;
  @IsNotEmpty()
  @AutoMap()
  phoneNumber: string;
}
