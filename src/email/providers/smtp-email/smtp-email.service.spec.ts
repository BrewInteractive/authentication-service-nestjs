import {
  EmailFixture,
  SmtpEmailConfigFixture,
} from "../../../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { MockFactory } from "mockingbird";
import { SmtpEmailService } from "./smtp-email.service";

describe("SmtpEmailService", () => {
  let emailService: SmtpEmailService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const mockSmtpEmailConfig = MockFactory(SmtpEmailConfigFixture).one();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmtpEmailService,
        {
          provide: "SmtpEmailConfig",
          useValue: mockSmtpEmailConfig,
        },
      ],
    }).compile();

    emailService = module.get<SmtpEmailService>(SmtpEmailService);
  });

  it("should be defined", () => {
    expect(emailService).toBeDefined();
  });

  it("should send email successfully", async () => {
    // Arrange
    const mockEmail = MockFactory(EmailFixture).one();

    jest
      .spyOn(emailService["smtpClient"], "sendMail")
      .mockResolvedValue(Promise.resolve(null));

    // Act
    await emailService.sendEmailAsync(mockEmail);

    // Assert
    expect(emailService["smtpClient"].sendMail).toHaveBeenCalledWith({
      from: mockEmail.from,
      to: mockEmail.to,
      subject: mockEmail.subject,
      html: mockEmail.content,
      cc: mockEmail.cc,
      bcc: mockEmail.bcc,
    });
  });
});
