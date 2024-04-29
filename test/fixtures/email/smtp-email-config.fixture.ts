import { Mock } from "mockingbird";
import { SmtpEmailConfig } from "../../../src/email/providers";

export class SmtpEmailConfigFixture extends SmtpEmailConfig {
  @Mock()
  host: string;

  @Mock()
  port: string;

  @Mock()
  auth: {
    user: string;
    pass: string;
  };

  @Mock()
  secure: boolean;

  @Mock()
  tls: {
    rejectUnauthorized: boolean;
  };
}
