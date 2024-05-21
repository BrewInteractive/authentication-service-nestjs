import { ApiProperty } from "@nestjs/swagger";
import { ErrorExtensions } from "../../dto";

export class ValidationErrorExtensions extends ErrorExtensions {
  @ApiProperty({
    required: false,
  })
  message?: string;
  @ApiProperty({
    required: false,
  })
  fields?: string[];
}
