import { ApiProperty } from "@nestjs/swagger";
import { ErrorResponse } from "./http-extension-response.dto";

export class Tokens extends ErrorResponse {
  @ApiProperty({
    required: true,
  })
  idToken: string;

  @ApiProperty({
    required: true,
  })
  refreshToken: string;
}
