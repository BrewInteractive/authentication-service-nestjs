import { ApiProperty } from "@nestjs/swagger";

export class Tokens {
  @ApiProperty({
    required: true,
  })
  id_token: string;

  @ApiProperty({
    required: true,
  })
  refresh_token: string;
}
