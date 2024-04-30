import { EmailServiceType } from "../../../src/email/enum/email.service.type.enum";
import { EmailSubjects } from "./email-subjects-config.fixture";
import { JWTFixture } from "./jwt.fixture";
import { Mock } from "mockingbird";
import { SmtpEmailConfigFixture } from "../email";

export class ConfigFixture {
  @Mock("test")
  environment: string;

  @Mock((faker) => faker.datatype.string())
  apiKey: string;

  @Mock(JWTFixture)
  jwt: JWTFixture;

  @Mock(3000)
  port: number;

  @Mock("test")
  version: string;

  @Mock((faker) => faker.datatype.string())
  name: string;

  @Mock((faker) => faker.datatype.string())
  description: string;

  @Mock("*")
  corsAllowedOrigins: string;

  @Mock(new RegExp("(?=.*[A-Z])(?=.*[a-z]).*"))
  passwordRegex: RegExp;

  @Mock(false)
  swaggerEnabled: boolean;

  @Mock("user")
  userDefaultRole: string;

  @Mock(EmailServiceType.AWS)
  emailService: string;

  @Mock((faker) => faker.internet.email())
  emailFrom: string;

  @Mock((faker) => faker.internet.url())
  emailResetPasswordEndpoint: string;

  @Mock(EmailSubjects)
  emailSubjects: EmailSubjects;

  @Mock(SmtpEmailConfigFixture)
  smtp: SmtpEmailConfigFixture;
}
