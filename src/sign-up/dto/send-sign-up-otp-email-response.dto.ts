import { ApiProperty } from "@nestjs/swagger";

export class SendSignUpOtpEmailResponse {
  @ApiProperty({
    required: true,
  })
  isSent: boolean;

  @ApiProperty({
    required: true,
  })
  expiresAt: Date;
}
