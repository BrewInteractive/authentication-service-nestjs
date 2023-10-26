import { DynamicModule, Module } from "@nestjs/common";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import config from "../utils/config";
import { EmailServiceType } from "./enum/email.service.type.enum";
import { AwsEmailService } from "./providers/aws-email.service";
import { EmailService } from "./email.service";
import { EmailProfile } from "../auth/mapping-profiles/email.mapping.profile";
import { AwsEmailConfig } from "./providers/aws-email.config";
import { ConfigService } from "@nestjs/config";
import { Mapper } from "@automapper/core";

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
        if (config().emailService === "aws") return awsEmailService;
        else throw new Error("Invalid email service type");
      },
      inject: [AwsEmailService],
    },
  ],
  exports: ["EmailService"],
})
export class EmailModule {}
