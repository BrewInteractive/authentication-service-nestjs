import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Email } from "./dto/email.dto";
import { EmailService } from "./email.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { IAwsEmailConfig } from "./interfaces/aws-email.config";
import { Inject } from "@nestjs/common";

export class AwsEmailService extends EmailService {
  private sesClient: SESClient;

  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @Inject("IAwsEmailConfig") private readonly awsConfig: IAwsEmailConfig
  ) {
    super();
    this.sesClient = new SESClient({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  async sendEmailAsync(email: Email): Promise<void> {
    const sendEmailCommand: SendEmailCommand = await this.mapper.mapAsync(
      email,
      Email,
      SendEmailCommand
    );
    await this.sesClient.send(sendEmailCommand);
  }
}
