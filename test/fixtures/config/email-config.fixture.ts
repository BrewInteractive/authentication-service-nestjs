import { EmailServiceType } from "../../../src/email/enum/email.service.type.enum";
import { Mock } from "mockingbird";

class AWSemailConfigFixture {
  @Mock()
  sesRegion: string;

  @Mock()
  sesAccessKey: string;

  @Mock()
  sesSecretKey: string;
}

class SMTPAuthemailConfigFixture {
  @Mock()
  user: string;

  @Mock()
  pass: string;
}

class SMTPemailConfigFixture {
  @Mock((faker) => faker.internet.url())
  host: string;

  @Mock(SMTPAuthemailConfigFixture)
  auth: SMTPAuthemailConfigFixture;
}

class EmailSubjectsConfigurationsFixture {
  @Mock()
  loginOtp: string;
}

export class emailConfigFixture {
  @Mock(EmailServiceType.AWS)
  emailService: string;

  @Mock((faker) => faker.internet.email())
  emailFrom: string;

  @Mock(AWSemailConfigFixture)
  aws: AWSemailConfigFixture;

  @Mock(SMTPemailConfigFixture)
  smtp: SMTPemailConfigFixture;

  @Mock(EmailSubjectsConfigurationsFixture)
  emailSubjects: EmailSubjectsConfigurationsFixture;
}
