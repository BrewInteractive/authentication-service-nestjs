import { ApiProperty } from "@nestjs/swagger";

export abstract class ErrorExtensions {
  @ApiProperty({
    required: false,
  })
  code?: string;
}
