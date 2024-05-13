import { Test, TestingModule } from "@nestjs/testing";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "../email/email.service";
import { MockFactory } from "mockingbird";
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordFixture } from "../../test/fixtures";
import { TemplateService } from "../template/template.service";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";

describe("ResetPasswordController", () => {
  let resetPasswordController: ResetPasswordController;
  let userService: UserService;
  let templateService: TemplateService;
  let emailService: EmailService;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      controllers: [ResetPasswordController],
      providers: [
        {
          provide: "UserService",
          useValue: {
            resetPasswordAsync: jest.fn(),
            getResetPasswordRequestByIdAsync: jest.fn(),
          },
        },
        {
          provide: "TemplateService",
          useValue: {
            getResetPasswordEmailTemplate: jest.fn(),
            injectData: jest.fn(),
          },
        },
        {
          provide: "EmailService",
          useValue: {
            sendEmailAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    resetPasswordController = module.get<ResetPasswordController>(
      ResetPasswordController
    );
    userService = module.get<UserService>("UserService");
    templateService = module.get<TemplateService>("TemplateService");
    emailService = module.get<EmailService>("EmailService");
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(resetPasswordController).toBeDefined();
  });

  it("should call userService.resetPasswordAsync with the provided request", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    await resetPasswordController.resetPasswordAsync(resetPasswordRequestDto);

    expect(userService.resetPasswordAsync).toHaveBeenCalledWith(
      resetPasswordRequestDto
    );
  });

  it('should return "OK" when resetPasswordAsync is called', async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    const result = await resetPasswordController.resetPasswordAsync(
      resetPasswordRequestDto
    );

    expect(result).toBe("OK");
  });
});
