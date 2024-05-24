import { AwsEmailConfig, AwsEmailService, SmtpEmailService } from "./providers";

import { ConfigService } from "@nestjs/config";
import { EmailProfile } from "./mapping-profiles/email.mapping-profile";
import { EmailServiceType } from "./enum/email-service-type.enum";
import { Module } from "@nestjs/common";
import { SendgridService } from "./providers/sendgrid/sendgrid.service";
import { UndefinedServiceError } from "../error";

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
      useFactory: (configService: ConfigService) => configService.get("smtp"),
      inject: [ConfigService],
    },
    {
      provide: "SendgridConfig",
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get("sendgrid.apiKey"),
      }),
      inject: [ConfigService],
    },
    AwsEmailService,
    SmtpEmailService,
    EmailProfile,
    SendgridService,
    {
      provide: "EmailService",
      useFactory: (
        configService: ConfigService,
        awsEmailService: AwsEmailService,
        smtpEmailService: SmtpEmailService,
        sendgridService: SendgridService
      ) => {
        const emailServiceType = configService.get("emailService");

        switch (emailServiceType) {
          case EmailServiceType.SMTP:
            return smtpEmailService;
          case EmailServiceType.AWS:
            return awsEmailService;
          case EmailServiceType.SENDGRID:
            return sendgridService;
          default:
            throw new UndefinedServiceError(emailServiceType, "Email Service");
        }
      },
      inject: [
        ConfigService,
        AwsEmailService,
        SmtpEmailService,
        SendgridService,
      ],
    },
  ],
  exports: ["EmailService"],
})
export class EmailModule {}
