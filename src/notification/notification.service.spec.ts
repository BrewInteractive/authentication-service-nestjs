import {
  EmailConfigFixture,
  OtpEmailCreatedEventFixture,
} from "../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AutomapperModule } from "@automapper/nestjs";
import { BadRequestException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EAuthenticationAction } from "../enums";
import { EmailModule } from "../email/email.module";
import { EmailService } from "../email/email.service";
import { MockFactory } from "mockingbird";
import { NotificationService } from "./notification.service";
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
    const mockTemplate = "<p>{{otpCode}}</p>";

    const templateSpy = jest
      .spyOn(templateService, "getLoginOtpEmailTemplate")
      .mockReturnValue(mockTemplate);

    const injectDataSpy = jest
      .spyOn(templateService, "injectData")
      .mockReturnValue(mockTemplate);

    const emailSpy = jest
      .spyOn(emailService, "sendEmailAsync")
      .mockResolvedValue();

    await notificationService.onOtpEmailCreated(mockOtpEmailCreatedEvent);

    expect(templateSpy).toHaveBeenCalledWith("en");
    expect(injectDataSpy).toHaveBeenCalledWith(mockTemplate, {
      otpCode: mockOtpEmailCreatedEvent.otpCode,
    });
    expect(emailSpy).toBeCalled();
  });

  it("Otp should throw an error because it can't find the template", async () => {
    const mockOtpEmailCreatedEvent = MockFactory(OtpEmailCreatedEventFixture)
      .mutate({
        authenticationAction: "mock" as EAuthenticationAction,
      })
      .one();

    const expectedResult = new BadRequestException("There is no otp template.");

    const emailSpy = jest
      .spyOn(emailService, "sendEmailAsync")
      .mockResolvedValue();

    await expect(
      notificationService.onOtpEmailCreated(mockOtpEmailCreatedEvent)
    ).rejects.toThrow(expectedResult);

    expect(emailSpy).not.toBeCalled();
  });
});