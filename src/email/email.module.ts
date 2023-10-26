import { Module } from "@nestjs/common";
import config from "../utils/config";
import { AwsEmailService } from "./providers/aws-email.service";
import { EmailProfile } from "../auth/mapping-profiles/email.mapping.profile";
import { AwsEmailConfig } from "./providers/aws-email.config";
import { EmailServiceType } from "./enum/email.service.type.enum";

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
        if (
          (config().emailService as EmailServiceType) === EmailServiceType.AWS
        )
          return awsEmailService;
        else throw new Error("Invalid email service type");
      },
      inject: [AwsEmailService],
    },
  ],
  exports: ["EmailService"],
})
export class EmailModule {}
