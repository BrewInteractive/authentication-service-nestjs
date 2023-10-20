import { Module, ServiceUnavailableException } from "@nestjs/common";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { Mapper } from "@automapper/core";
import config from "../utils/config";
import { BaseEmailService } from "./abstract/base.email.service";
import { EmailServiceType } from "./enum/email.service.type.enum";
import { AwsEmailService } from "./aws-email.service";
import AwsEmailConfig from "./aws-email.config";

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [
    {
      provide: "IAwsEmailConfig",
      useValue: AwsEmailConfig,
    },
    {
      provide: BaseEmailService,
      useFactory: (mapper: Mapper) => {
        const emailService = config().emailService as EmailServiceType;
        if (emailService === EmailServiceType.AWS) {
          return new AwsEmailService(mapper, AwsEmailConfig);
        } else {
          throw new ServiceUnavailableException(emailService);
        }
      },
    },
  ],
})
export class EmailModule {}
