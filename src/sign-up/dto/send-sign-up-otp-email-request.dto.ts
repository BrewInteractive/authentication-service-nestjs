import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from "class-validator";

import { AutoMap } from "@automapper/classes";
import { PhoneRequestDto } from "./phone.dto";
import { Type } from "class-transformer";

export class SendSignUpOtpEmailRequest {
  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email: string;

  @IsNotEmpty()
  @AutoMap()
  @IsOptional()
  locale?: string;

  appData?: object;

  @IsOptional()
  @AutoMap()
  @ValidateNested()
  @Type(() => PhoneRequestDto)
  phone?: PhoneRequestDto;
}
