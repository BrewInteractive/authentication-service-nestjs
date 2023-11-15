import { IsNotEmpty, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
