import { AwsEmailConfig } from "./providers/aws-email.config";
import { AwsEmailService } from "./providers/aws-email.service";
import { EmailProfile } from "./mapping-profiles/email.mapping.profile";
import { EmailServiceType } from "./enum/email.service.type.enum";
import { Module } from "@nestjs/common";
import config from "../utils/config";


@Module({
  imports: [],
  providers: [
    {
      provide: "AwsEmailConfig",
      useValue: {
        region: config().awsSesRegion,
        accessKeyId: config().awsSesAccessKey,
        secretAccessKey: config().awsSesSecretKey,
      } as AwsEmailConfig,
    },
    AwsEmailService,
    EmailProfile,
    {
      provide: "EmailService",
      useFactory: (awsEmailService: AwsEmailService) => {
        const emailServiceType = config().emailService as EmailServiceType;
        if (emailServiceType === EmailServiceType.AWS) return awsEmailService;
        else throw new Error("Invalid email service type");
      },
      inject: [AwsEmailService],
    },
  ],
  exports: ["EmailService"],
})
export class EmailModule {}
