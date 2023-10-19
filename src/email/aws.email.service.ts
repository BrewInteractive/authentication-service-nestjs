import {
  SESClient,
  SendEmailCommand,
} from "@aws-sdk/client-ses";
import { Email } from "./dto/email.dto";
import config from "./../utils/config";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { BaseEmailService } from "./abstract/base.email.service";

export class AwsEmailService extends BaseEmailService {
  private sesClient: SESClient;

  constructor(@InjectMapper() private readonly mapper: Mapper) {
    super();
    const _config = config();
    this.sesClient = new SESClient({
      region: _config.awsSesRegion,
      credentials: {
        accessKeyId: _config.awsSesAccessKey,
        secretAccessKey: _config.awsSesSecretKey,
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
