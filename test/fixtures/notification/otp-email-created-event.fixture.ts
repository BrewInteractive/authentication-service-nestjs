import {
  OtpEmailCreatedEvent,
  OtpSmsCreatedEvent,
} from "../../../src/notification/dto";

import { AuthenticationAction } from "../../../src/enum";
import { Mock } from "mockingbird";

export class OtpEmailCreatedEventFixture extends OtpEmailCreatedEvent {
  @Mock((faker) => faker.datatype.string(6))
  otpValue: string;

  @Mock((faker) => faker.internet.email())
  emailAddress: string;

  @Mock(AuthenticationAction.LOGIN)
  authenticationAction: AuthenticationAction;

  withLocale(locale?: string) {
    this.locale = locale ?? "en";
    return this;
  }
}

export class OtpSmsCreatedEventFixture extends OtpSmsCreatedEvent {
  @Mock((faker) => faker.datatype.string(6))
  otpValue: string;

  @Mock((faker) => faker.phone.phoneNumber())
  phoneNumber: string;

  @Mock(AuthenticationAction.LOGIN)
  authenticationAction: AuthenticationAction;

  withLocale(locale?: string) {
    this.locale = locale ?? "en";
    return this;
  }
}
