import { ApiProperty } from "@nestjs/swagger";

export class SendLoginOtpEmailResponse {
  @ApiProperty({
    required: true,
  })
  is_sent: boolean;

  @ApiProperty({
    required: true,
  })
  expires_at: Date;
}
