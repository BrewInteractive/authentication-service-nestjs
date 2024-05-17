import {
  EmailConfigFixture,
  OtpEmailCreatedEventFixture,
  ResetPasswordCreatedEventFixture,
} from "../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthenticationAction } from "../enum";
import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "../email/email.module";
import { EmailService } from "../email/email.service";
import { MockFactory } from "mockingbird";
import { NotificationService } from "./notification.service";
import { OtpEmailTemplateNotFoundError } from "./error";
import { TemplateModule } from "../template/template.module";
import { TemplateService } from "../template/template.service";
import { classes } from "@automapper/classes";

describe("NotificationService", () => {
  let notificationService: NotificationService;
  let templateService: TemplateService;
  let emailService: EmailService;
  const mockEmailConfig = MockFactory(EmailConfigFixture).one();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EmailModule,
        TemplateModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => mockEmailConfig],
        }),
      ],
      providers: [NotificationService],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
    templateService = module.get<TemplateService>("TemplateService");
    emailService = module.get<EmailService>("EmailService");
  });

  it("should be defined", () => {
    expect(notificationService).toBeDefined();
  });

  it("should send login otp email", async () => {
    const mockOtpEmailCreatedEvent = MockFactory(
      OtpEmailCreatedEventFixture
    ).one();
    const mockTemplate = "<p>{{otpValue}}</p>";

    const templateSpy = jest
      .spyOn(templateService, "getLoginOtpEmailTemplate")
      .mockReturnValue(mockTemplate);

    const injectDataSpy = jest
      .spyOn(templateService, "injectData")
      .mockReturnValue(mockTemplate);

    const emailSpy = jest
      .spyOn(emailService, "sendEmailAsync")
      .mockResolvedValue();

    await notificationService.onOtpEmailCreatedAsync(mockOtpEmailCreatedEvent);

    expect(templateSpy).toHaveBeenCalledWith("en");
    expect(injectDataSpy).toHaveBeenCalledWith(mockTemplate, {
      otpValue: mockOtpEmailCreatedEvent.otpValue,
    });
    expect(emailSpy).toBeCalled();
  });

  it("Otp should throw an error because it can't find the template", async () => {
    const mockOtpEmailCreatedEvent = MockFactory(OtpEmailCreatedEventFixture)
      .mutate({
        authenticationAction: AuthenticationAction.LOGIN,
      })
      .one();

    const templateSpy = jest
      .spyOn(templateService, "getLoginOtpEmailTemplate")
      .mockReturnValue(null);

    const expectedError = new OtpEmailTemplateNotFoundError(
      AuthenticationAction.LOGIN
    );

    const emailSpy = jest
      .spyOn(emailService, "sendEmailAsync")
      .mockResolvedValue();

    await expect(
      notificationService.onOtpEmailCreatedAsync(mockOtpEmailCreatedEvent)
    ).rejects.toThrow(expectedError);

    expect(templateSpy).toHaveBeenCalledWith("en");
    expect(emailSpy).not.toBeCalled();
  });

  it("should send reset password email", async () => {
    const resetPasswordEmailCreatedEvent = MockFactory(
      ResetPasswordCreatedEventFixture
    ).one();
    const resetPasswordTemplate = "<p>{{resetLink}}</p>";

    const templateSpy = jest
      .spyOn(templateService, "getResetPasswordEmailTemplate")
      .mockReturnValue(resetPasswordTemplate);

    const injectDataSpy = jest
      .spyOn(templateService, "injectData")
      .mockReturnValue(resetPasswordTemplate);

    const emailSpy = jest
      .spyOn(emailService, "sendEmailAsync")
      .mockResolvedValue();

    await notificationService.onResetPasswordEmailCreatedAsync(
      resetPasswordEmailCreatedEvent
    );

    expect(templateSpy).toHaveBeenCalledWith("en");
    expect(injectDataSpy).toHaveBeenCalledWith(resetPasswordTemplate, {
      resetLink: resetPasswordEmailCreatedEvent.resetLink,
    });
    expect(emailSpy).toBeCalled();
  });
});
