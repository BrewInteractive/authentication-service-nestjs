import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigFixture } from "../../test/fixtures";
import { EmailModule } from "../email/email.module";
import { EmailService } from "../email/email.service";
import { MockFactory } from "mockingbird";
import { NotificationService } from "./notification.service";
import { TemplateModule } from "../template/template.module";
import { TemplateService } from "../template/template.service";
import { classes } from "@automapper/classes";
import { faker } from "@faker-js/faker";

describe("NotificationService", () => {
  let notificationService: NotificationService;
  let templateService: TemplateService;
  let emailService: EmailService;
  const mockConfig = MockFactory(ConfigFixture).one();

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
          load: [() => mockConfig],
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

  it("should send reset password email", async () => {
    const mockResetPasswordKey = faker.datatype.string(12);
    const mockUserEmailAddress = faker.internet.email();
    const mockTemplate = "<p>Your reset link: {{resetLink}}</p>";

    const templateSpy = jest
      .spyOn(templateService, "getResetPasswordEmailTemplate")
      .mockReturnValue(mockTemplate);

    const injectDataSpy = jest
      .spyOn(templateService, "injectData")
      .mockReturnValue(mockTemplate);

    const emailSpy = jest
      .spyOn(emailService, "sendEmailAsync")
      .mockResolvedValue();

    await notificationService.onEmailResetPasswordAsync({
      resetPasswordKey: mockResetPasswordKey,
      userEmailAddress: mockUserEmailAddress,
    });

    expect(templateSpy).toHaveBeenCalledWith("en");
    expect(injectDataSpy).toHaveBeenCalledWith(mockTemplate, {
      resetLink:
        mockConfig.emailResetPasswordEndpoint +
        `?emailAddress=${mockUserEmailAddress}&resetPasswordKey=${mockResetPasswordKey}`,
    });
    expect(emailSpy).toBeCalled();
  });
});
