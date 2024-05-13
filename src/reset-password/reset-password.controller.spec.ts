import {
  ResetPasswordFixture,
  SendResetPasswordRequestFixture,
  UserFixture,
} from "../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";
import { User, UserResetPasswordRequest } from "../entities";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "../email/email.service";
import { HttpStatus } from "@nestjs/common";
import { MockFactory } from "mockingbird";
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordService } from "./reset-password.service";
import { Response } from "express";
import { TemplateService } from "../template/template.service";
import { classes } from "@automapper/classes";
import { faker } from "@faker-js/faker";

describe("ResetPasswordController", () => {
  let resetPasswordController: ResetPasswordController;
  let resetPasswordService: ResetPasswordService;
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
          provide: "ResetPasswordService",
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
    resetPasswordService = module.get<ResetPasswordService>(
      "ResetPasswordService"
    );
    templateService = module.get<TemplateService>("TemplateService");
    emailService = module.get<EmailService>("EmailService");
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(resetPasswordController).toBeDefined();
  });

  it("should call resetPasswordService.resetPasswordAsync with the provided request", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    await resetPasswordController.resetPasswordAsync(resetPasswordRequestDto);

    expect(resetPasswordService.resetPasswordAsync).toHaveBeenCalledWith(
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

  it("should return 'Debounced' and status HttpStatus.ACCEPTED if request is resendable", async () => {
    // Arrange
    const sendResetPasswordRequestDto = MockFactory(
      SendResetPasswordRequestFixture
    ).one();
    const mockRequest = {
      resendableAt: new Date(),
      user: MockFactory(UserFixture).one() as User,
    } as UserResetPasswordRequest;
    const sendResponse: Partial<Response> = {
      status: jest.fn().mockReturnValue({} as Partial<Response>),
      send: jest.fn().mockReturnValue({} as Partial<Response>),
    };
    const statusResponse: Partial<Response> = {
      status: jest.fn().mockReturnValue(sendResponse),
      send: jest.fn().mockReturnValue(sendResponse),
    };
    jest
      .spyOn(resetPasswordService, "getResetPasswordRequestByIdAsync")
      .mockResolvedValue(mockRequest);
    // Act
    await resetPasswordController.sendResetPasswordRequestAsync(
      sendResetPasswordRequestDto,
      statusResponse as Response
    );
    // Assert
    expect(
      resetPasswordService.getResetPasswordRequestByIdAsync
    ).toHaveBeenCalledWith(sendResetPasswordRequestDto.requestId);
    expect(statusResponse.status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
    expect(sendResponse.send).toHaveBeenCalledWith("Debounced");
  });

  it("should send reset password email and return 'OK' if request is not resendable", async () => {
    // Arrange
    const sendResetPasswordRequestDto = MockFactory(
      SendResetPasswordRequestFixture
    ).one();
    const mockRequest = {
      key: faker.random.alphaNumeric(10),
      resendableAt: faker.date.future(),
      user: MockFactory(UserFixture).one() as User,
    } as UserResetPasswordRequest;
    jest
      .spyOn(resetPasswordService, "getResetPasswordRequestByIdAsync")
      .mockResolvedValue(mockRequest);
    const mockTemplate = "mock template";
    jest
      .spyOn(templateService, "getResetPasswordEmailTemplate")
      .mockReturnValue(mockTemplate);
    const mockhtml = faker.lorem.paragraph();
    jest.spyOn(templateService, "injectData").mockReturnValue(mockhtml);
    const mockResetLink = faker.internet.url();
    const mockFromEmail = faker.internet.email();
    jest.spyOn(configService, "get").mockImplementation((key) => {
      switch (key) {
        case "RESET_LINK":
          return mockResetLink;
        case "EMAIL_FROM":
          return mockFromEmail;
      }
    });
    const mockEmail = {
      from: mockFromEmail,
      subject: "Reset password",
      to: mockRequest.user.email,
      content: mockhtml,
    };
    const response: Partial<Response> = {
      status: jest.fn(),
      send: jest.fn(),
    };
    // Act
    await resetPasswordController.sendResetPasswordRequestAsync(
      sendResetPasswordRequestDto,
      response as Response
    );
    // Assert
    expect(
      resetPasswordService.getResetPasswordRequestByIdAsync
    ).toHaveBeenCalledWith(sendResetPasswordRequestDto.requestId);
    expect(templateService.getResetPasswordEmailTemplate).toHaveBeenCalledWith(
      "en"
    );
    expect(templateService.injectData).toHaveBeenCalledWith(mockTemplate, {
      resetLink: mockResetLink + mockRequest.key,
    });
    expect(configService.get).toHaveBeenCalledWith("RESET_LINK");
    expect(emailService.sendEmailAsync).toHaveBeenCalledWith(mockEmail);
    expect(response.status).not.toHaveBeenCalled();
    expect(response.send).not.toHaveBeenCalled();
  });
});
