import { ApiProperty } from "@nestjs/swagger";

export class SendLoginOtpPhoneResponse {
  @ApiProperty({
    required: true,
  })
  isSent: boolean;

  @ApiProperty({
    required: true,
  })
  expiresAt: Date;
}
