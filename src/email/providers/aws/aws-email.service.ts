import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Email } from "../../dto/email.dto";
import { EmailService } from "../../email.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { AwsEmailConfig } from "./aws-email.config";
import { Inject } from "@nestjs/common";

export class AwsEmailService extends EmailService {
  private sesClient: SESClient;

  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @Inject("AwsEmailConfig") private readonly awsConfig: AwsEmailConfig
  ) {
    super();
    this.sesClient = new SESClient({
      region: this.awsConfig.region,
      credentials: {
        accessKeyId: this.awsConfig.accessKeyId,
        secretAccessKey: this.awsConfig.secretAccessKey,
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
