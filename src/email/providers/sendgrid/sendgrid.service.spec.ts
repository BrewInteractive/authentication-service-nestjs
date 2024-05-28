import { EmailFixture, SendGridConfigFixture } from "../../../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { MockFactory } from "mockingbird";
import { SendgridService } from "./sendgrid.service";

const SendgridMail = require("@sendgrid/mail");

jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

describe("SendgridService", () => {
  let emailService: SendgridService;

  beforeEach(async () => {
    const sendgridConfig = MockFactory(SendGridConfigFixture).one();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendgridService,
        {
          provide: "SendgridConfig",
          useValue: sendgridConfig,
        },
      ],
    }).compile();

    emailService = module.get<SendgridService>(SendgridService);
  });

  it("should be defined", () => {
    expect(emailService).toBeDefined();
  });

  it("should send email successfully", async () => {
    // Arrange
    const email = MockFactory(EmailFixture).one();

    // Act
    await emailService.sendEmailAsync(email);

    // Assert
    expect(SendgridMail.send).toHaveBeenCalledWith({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.content,
      cc: email.cc,
      bcc: email.bcc,
    });
  });

  it("should send email successfully (option values are not sent)", async () => {
    // Arrange
    const email = MockFactory(EmailFixture).one();
    delete email.cc;
    delete email.bcc;

    // Act
    await emailService.sendEmailAsync(email);

    // Assert
    expect(SendgridMail.send).toHaveBeenCalledWith({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.content,
      cc: [],
      bcc: [],
    });
  });
});
