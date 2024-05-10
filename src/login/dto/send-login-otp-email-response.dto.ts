import { ApiProperty } from "@nestjs/swagger";

export class SendLoginOtpEmailResponse {
  @ApiProperty({
    required: true,
  })
  isSent: boolean;

  @ApiProperty({
    required: true,
  })
  expiresAt: Date;
}
