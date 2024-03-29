import { AwsEmailConfig } from "./providers/aws-email.config";
import { AwsEmailService } from "./providers/aws-email.service";
import { ConfigService } from "@nestjs/config";
import { EmailProfile } from "./mapping-profiles/email.mapping.profile";
import { EmailServiceType } from "./enum/email.service.type.enum";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  providers: [
    {
      provide: "AwsEmailConfig",
      useFactory: (configService: ConfigService) =>
        ({
          region: configService.get("aws.sesRegion"),
          accessKeyId: configService.get("aws.sesAccessKey"),
          secretAccessKey: configService.get("aws.sesSecretKey"),
        } as AwsEmailConfig),
      inject: [ConfigService],
    },
    AwsEmailService,
    EmailProfile,
    {
      provide: "EmailService",
      useFactory: (
        awsEmailService: AwsEmailService,
        configService: ConfigService
      ) => {
        const emailServiceType = configService.get(
          "emailService"
        ) as EmailServiceType;
        if (emailServiceType === EmailServiceType.AWS) return awsEmailService;
        else throw new Error("Invalid email service type");
      },
      inject: [AwsEmailService, ConfigService],
    },
  ],
  exports: ["EmailService"],
})
export class EmailModule {}
