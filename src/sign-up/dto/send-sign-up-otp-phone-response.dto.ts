import { ApiProperty } from "@nestjs/swagger";

export class SendSignUpOtpPhoneResponse {
  @ApiProperty({
    required: true,
  })
  isSent: boolean;

  @ApiProperty({
    required: true,
  })
  expiresAt: Date;
}
