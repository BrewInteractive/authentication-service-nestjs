import {
  EmailConfigFixture,
  OtpEmailCreatedEventFixture,
  OtpSmsCreatedEventFixture,
  ResetPasswordCreatedEventFixture,
  SmsConfigFixture,
} from "../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthNotificationService } from "./auth-notification.service";
import { AuthenticationAction } from "../enum";
import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "@brewww/nestjs-notification-module/dist/email/email.service";
import { MockFactory } from "mockingbird";
import { NotificationModule } from "@brewww/nestjs-notification-module";
import { OtpEmailTemplateNotFoundError } from "./error";
import { OtpSmsTemplateNotFoundError } from "./error/otp-sms-template-not-found.error.ts";
import { SmsService } from "@brewww/nestjs-notification-module/dist/sms/sms.service";
import { TemplateModule } from "../template/template.module";
import { TemplateService } from "../template/template.service";
import { classes } from "@automapper/classes";
import { faker } from "@faker-js/faker";

describe("NotificationService", () => {
  let authNotificationService: AuthNotificationService;
  let templateService: TemplateService;
  let emailService: EmailService;
  let smsService: SmsService;
  const mockEmailConfig = MockFactory(EmailConfigFixture).one();
  const mockSmsConfig = MockFactory(SmsConfigFixture).one();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TemplateModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => mockEmailConfig, () => mockSmsConfig],
        }),
        NotificationModule,
      ],
      providers: [AuthNotificationService],
    }).compile();

    authNotificationService = module.get<AuthNotificationService>(
      AuthNotificationService
    );
    templateService = module.get<TemplateService>("TemplateService");
    emailService = module.get<EmailService>("EmailService");
    smsService = module.get<SmsService>("SmsService");
  });

  it("should be defined", () => {
    expect(authNotificationService).toBeDefined();
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

    await authNotificationService.onOtpEmailCreatedAsync(
      mockOtpEmailCreatedEvent
    );

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
      authNotificationService.onOtpEmailCreatedAsync(mockOtpEmailCreatedEvent)
    ).rejects.toThrow(expectedError);

    expect(templateSpy).toHaveBeenCalledWith("en");
    expect(emailSpy).not.toBeCalled();
  });

  it("should send signup otp email", async () => {
    const mockOtpEmailCreatedEvent = MockFactory(OtpEmailCreatedEventFixture)
      .mutate({
        authenticationAction: AuthenticationAction.SIGNUP,
      })
      .one();
    const mockTemplate = "<p>{{otpValue}}</p>";

    const templateSpy = jest
      .spyOn(templateService, "getSignupOtpEmailTemplate")
      .mockReturnValue(mockTemplate);

    const injectDataSpy = jest
      .spyOn(templateService, "injectData")
      .mockReturnValue(mockTemplate);

    const emailSpy = jest
      .spyOn(emailService, "sendEmailAsync")
      .mockResolvedValue();

    await authNotificationService.onOtpEmailCreatedAsync(
      mockOtpEmailCreatedEvent
    );

    expect(templateSpy).toHaveBeenCalledWith("en");
    expect(injectDataSpy).toHaveBeenCalledWith(mockTemplate, {
      otpValue: mockOtpEmailCreatedEvent.otpValue,
    });
    expect(emailSpy).toBeCalled();
  });

  it("Otp should throw an error because signup template is not found", async () => {
    const mockOtpEmailCreatedEvent = MockFactory(OtpEmailCreatedEventFixture)
      .mutate({
        authenticationAction: AuthenticationAction.SIGNUP,
      })
      .one();

    const templateSpy = jest
      .spyOn(templateService, "getSignupOtpEmailTemplate")
      .mockReturnValue(null);

    const expectedError = new OtpEmailTemplateNotFoundError(
      AuthenticationAction.SIGNUP
    );

    const emailSpy = jest
      .spyOn(emailService, "sendEmailAsync")
      .mockResolvedValue();

    await expect(
      authNotificationService.onOtpEmailCreatedAsync(mockOtpEmailCreatedEvent)
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

    await authNotificationService.onResetPasswordEmailCreatedAsync(
      resetPasswordEmailCreatedEvent
    );

    expect(templateSpy).toHaveBeenCalledWith("en");
    expect(injectDataSpy).toHaveBeenCalledWith(resetPasswordTemplate, {
      resetLink: resetPasswordEmailCreatedEvent.resetLink,
    });
    expect(emailSpy).toBeCalled();
  });

  it("should send otp sms", async () => {
    // Arrange
    const mockOtpSmsCreatedEvent = MockFactory(OtpSmsCreatedEventFixture).one();

    const mockTemplate = faker.lorem.paragraphs(3);
    const compiledMockTemplate = faker.lorem.paragraphs(3);

    const mockSms = {
      message: compiledMockTemplate,
      phoneNumber: mockOtpSmsCreatedEvent.phoneNumber,
    };

    const sendSmsAsyncSpy = jest
      .spyOn(smsService, "sendSmsAsync")
      .mockResolvedValue();

    const templateSpy = jest
      .spyOn(templateService, "getLoginOtpSmsTemplate")
      .mockReturnValue(mockTemplate);

    const injectDataSpy = jest
      .spyOn(templateService, "injectData")
      .mockReturnValue(compiledMockTemplate);

    // Act
    await authNotificationService.onOtpSmsCreatedAsync(mockOtpSmsCreatedEvent);

    // Assert
    expect(templateSpy).toHaveBeenCalledWith("en");
    expect(injectDataSpy).toHaveBeenCalledWith(mockTemplate, {
      otpValue: mockOtpSmsCreatedEvent.otpValue,
    });
    expect(sendSmsAsyncSpy).toHaveBeenCalledWith(mockSms);
  });

  it("should not send otp sms because the template is not found", async () => {
    // Arrange
    const mockOtpSmsCreatedEvent = MockFactory(OtpSmsCreatedEventFixture).one();

    const templateSpy = jest
      .spyOn(templateService, "getLoginOtpSmsTemplate")
      .mockReturnValue(null);

    const sendSmsAsyncSpy = jest
      .spyOn(smsService, "sendSmsAsync")
      .mockResolvedValue();

    const expectedError = new OtpSmsTemplateNotFoundError(
      AuthenticationAction.LOGIN
    );

    // Act
    await expect(
      authNotificationService.onOtpSmsCreatedAsync(mockOtpSmsCreatedEvent)
    ).rejects.toThrow(expectedError);

    // Assert
    expect(sendSmsAsyncSpy).not.toBeCalled();
    expect(templateSpy).toHaveBeenCalledWith("en");
  });
});
