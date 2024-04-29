import {
  AwsEmailConfig,
  AwsEmailService,
  SmtpEmailConfig,
  SmtpEmailService,
} from "./providers";

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
    {
      provide: "SmtpEmailConfig",
      useFactory: (configService: ConfigService) =>
        configService.get("smtp") as SmtpEmailConfig,
      inject: [ConfigService],
    },
    AwsEmailService,
    SmtpEmailService,
    EmailProfile,
    {
      provide: "EmailService",
      useFactory: (
        awsEmailService: AwsEmailService,
        smtpEmailService: SmtpEmailService,
        configService: ConfigService
      ) => {
        const emailServiceType = configService.get(
          "emailService"
        ) as EmailServiceType;

        switch (emailServiceType) {
          case EmailServiceType.SMTP:
            return smtpEmailService;
          case EmailServiceType.AWS:
            return awsEmailService;
          default:
            throw new Error("Invalid email service type");
        }
      },
      inject: [AwsEmailService, SmtpEmailService, ConfigService],
    },
  ],
  exports: ["EmailService"],
})
export class EmailModule {}
