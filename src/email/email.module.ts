import { Module, ServiceUnavailableException } from "@nestjs/common";
import { AwsEmailService } from "./aws.email.service";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { Mapper } from "@automapper/core";
import config from "../utils/config";
import { BaseEmailService } from "./abstract/base.email.service";
import { EmailServiceType } from "./enum/email.service.type.enum";

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [
    {
      provide: BaseEmailService,
      useFactory: (mapper: Mapper) => {
        const emailService = config().emailService as EmailServiceType;
        if (emailService === EmailServiceType.AWS) {
          return new AwsEmailService(mapper);
        } else {
          throw new ServiceUnavailableException(emailService);
        }
      },
    },
  ],
})
export class EmailModule {}
