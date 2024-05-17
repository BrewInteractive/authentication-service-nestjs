import { ApiProperty } from "@nestjs/swagger";

export class Tokens {
  @ApiProperty({
    required: true,
  })
  idToken: string;

  @ApiProperty({
    required: true,
  })
  refreshToken: string;
}
