import { Inject, Injectable } from "@nestjs/common";
import { SendgridConfig } from "./sendgrid.config";
import { Email } from "../../dto/email.dto";
const SendgridMail = require("@sendgrid/mail");

@Injectable()
export class SendgridService {
  constructor(
    @Inject("SendgridConfig") private readonly sendgridConfig: SendgridConfig
  ) {}

  async sendEmailAsync(email: Email): Promise<void> {
    SendgridMail.setApiKey(this.sendgridConfig.apiKey);
    await SendgridMail.send({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.content,
      cc: email.cc ?? [],
      bcc: email.bcc ?? [],
    });
  }
}
