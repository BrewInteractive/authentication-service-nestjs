import { EmailFixture } from "../../test/fixtures/email/email.fixture";
import { MockFactory } from "mockingbird";
import { AwsEmailService } from "./aws.email.service";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Test, TestingModule } from "@nestjs/testing";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { EmailProfile } from "../auth/mapping-profiles/email.mapping.profile";

describe("AwsEmailService", () => {
  let emailService: AwsEmailService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [AwsEmailService, EmailProfile],
    }).compile();

    emailService = module.get<AwsEmailService>(AwsEmailService);
  });

  it("should send an email successfully", async () => {
    // Arrange
    const fixture = MockFactory(EmailFixture);
    const email = fixture.one();
    const expectedSendEmailCommand = new SendEmailCommand({
      Source: email.from,
      Destination: {
        CcAddresses: email.cc,
        BccAddresses: email.bcc,
        ToAddresses: [email.to],
      },
      Message: {
        Subject: {
          Data: email.subject,
        },
        Body: {
          Text: {
            Data: email.content,
          },
        },
      },
    });
    const mockSend = jest.fn((arg: SendEmailCommand): Promise<void> => {
      if (JSON.stringify(arg) == JSON.stringify(expectedSendEmailCommand))
        return;
      else throw new Error();
    });
    SESClient.prototype.send = mockSend;

    // Act
    await emailService.sendEmailAsync(email);

    // Assert
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
