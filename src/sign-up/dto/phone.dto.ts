import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";

export class PhoneRequestDto {
  @IsNotEmpty()
  @AutoMap()
  countryCode: string;

  @IsNotEmpty()
  @AutoMap()
  number: string;
}
