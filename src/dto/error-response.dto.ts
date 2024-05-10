import { ApiProperty } from "@nestjs/swagger";
import { ErrorExtensions } from "./error-extensions.dto";
import { Response } from "../interfaces/response.interface";

export class ErrorResponse implements Response {
  @ApiProperty({
    required: true,
  })
  message: string;
  @ApiProperty({
    required: false,
  })
  extensions: ErrorExtensions;

  constructor() {}
}
