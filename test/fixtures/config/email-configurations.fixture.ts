import { EmailServiceType } from "../../../src/email/enum/email.service.type.enum";
import { Mock } from "mockingbird";

class AWSEmailConfigurationsFixture {
  @Mock()
  sesRegion: string;

  @Mock()
  sesAccessKey: string;

  @Mock()
  sesSecretKey: string;
}

class SMTPAuthEmailConfigurationsFixture {
  @Mock()
  user: string;

  @Mock()
  pass: string;
}

class SMTPEmailConfigurationsFixture {
  @Mock((faker) => faker.internet.url())
  host: string;

  @Mock(SMTPAuthEmailConfigurationsFixture)
  auth: SMTPAuthEmailConfigurationsFixture;
}

class EmailSubjectsConfigurationsFixture {
  @Mock()
  loginOtp: string;
}

export class EmailConfigurationsFixture {
  @Mock(EmailServiceType.AWS)
  emailService: string;

  @Mock((faker) => faker.internet.email())
  emailFrom: string;

  @Mock(AWSEmailConfigurationsFixture)
  aws: AWSEmailConfigurationsFixture;

  @Mock(SMTPEmailConfigurationsFixture)
  smtp: SMTPEmailConfigurationsFixture;

  @Mock(EmailSubjectsConfigurationsFixture)
  emailSubjects: EmailSubjectsConfigurationsFixture;
}
