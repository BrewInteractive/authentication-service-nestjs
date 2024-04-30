import { Mock } from "mockingbird";
import { SmtpEmailConfig } from "../../../src/email/providers";

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
