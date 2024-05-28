import { Mock } from "mockingbird";
import { SendgridConfig } from "../../../src/email/providers/sendgrid/sendgrid.config";

export class SendGridConfigFixture extends SendgridConfig {
  @Mock()
  apiKey: string;
}
