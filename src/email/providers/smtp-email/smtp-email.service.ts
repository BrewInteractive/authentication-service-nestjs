import * as Nodemailer from "nodemailer";

import { Email } from "../../dto/email.dto";
import { EmailService } from "../../email.service";
import { Inject, Injectable } from "@nestjs/common";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { SmtpEmailConfig } from "./smtp-email.config";

@Injectable()
export class SmtpEmailService extends EmailService {
  private smtpClient: Nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(
    @Inject("SmtpEmailConfig") private readonly smtpConfig: SmtpEmailConfig
  ) {
    super();
    this.smtpClient = Nodemailer.createTransport({
      host: this.smtpConfig.host,
      port: 465,
      auth: {
        user: this.smtpConfig.auth.user,
        pass: this.smtpConfig.auth.pass,
      },
      secure: true,
    } as Nodemailer.TransportOptions);
  }

  async sendEmailAsync(email: Email): Promise<void> {
    await this.smtpClient.sendMail({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.content,
      cc: email.cc ?? [],
      bcc: email.bcc ?? [],
    });
  }
}
