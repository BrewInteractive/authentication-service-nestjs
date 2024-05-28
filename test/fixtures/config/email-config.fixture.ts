import { AwsEmailConfig, SmtpEmailConfig } from "../../../src/email/providers";

import { EmailServiceType } from "../../../src/email/enum/email-service-type.enum";
import { Mock } from "mockingbird";

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

class SmtpEmailConfigFixture extends SmtpEmailConfig {
  @Mock((faker) => faker.internet.url())
  host: string;

  @Mock(SmtpAuthEmailConfigFixture)
  auth: SmtpAuthEmailConfigFixture;
}

class EmailSubjectsConfigurationsFixture {
  @Mock()
  loginOtp: string;
}

class SendGridEmailConfigFixture {
  @Mock()
  apiKey: string;
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
