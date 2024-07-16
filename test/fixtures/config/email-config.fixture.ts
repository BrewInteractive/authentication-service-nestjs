import { AwsEmailConfig } from "../../../node_modules/@brewww/nestjs-notification-module/dist/email/providers/aws/aws-email.config";
import { EmailServiceType } from "../../../node_modules/@brewww/nestjs-notification-module/dist/email/enum/email-service-type.enum";
import { Mock } from "mockingbird";
import { SendgridConfig } from "../../../node_modules/@brewww/nestjs-notification-module/dist/email/providers/sendgrid/sendgrid.config";
import { SmtpEmailConfig } from "../../../node_modules/@brewww/nestjs-notification-module/dist/email/providers/smtp/smtp-email.config";

class AwsEmailConfigFixture extends AwsEmailConfig {
  @Mock()
  sesRegion: string;

  @Mock()
  sesAccessKey: string;

  @Mock()
  sesSecretKey: string;
}

class SmtpAuthEmailConfigFixture {
  @Mock()
  user: string;

  @Mock()
  pass: string;
}

class EmailSubjectsConfigurationsFixture {
  @Mock()
  loginOtp: string;
}

class SendGridEmailConfigFixture extends SendgridConfig {
  @Mock()
  apiKey: string;
}
export class AuthSmtpEmailConfigFixture {
  user: string;
  pass: string;
}

export class SmtpEmailConfigFixture extends SmtpEmailConfig {
  @Mock()
  host: string;

  @Mock()
  port: string;

  @Mock(AuthSmtpEmailConfigFixture)
  auth: AuthSmtpEmailConfigFixture;

  @Mock()
  secure: boolean;

  @Mock()
  tls: {
    rejectUnauthorized: boolean;
  };
}
export class EmailConfigFixture {
  @Mock(EmailServiceType.AWS)
  emailService: string;

  @Mock((faker) => faker.internet.email())
  emailFrom: string;

  @Mock(AwsEmailConfigFixture)
  aws: AwsEmailConfigFixture;

  @Mock(SmtpEmailConfigFixture)
  smtp: SmtpEmailConfigFixture;

  @Mock(EmailSubjectsConfigurationsFixture)
  emailSubjects: EmailSubjectsConfigurationsFixture;

  @Mock(SendGridEmailConfigFixture)
  sendgrid: SendGridEmailConfigFixture;
}
