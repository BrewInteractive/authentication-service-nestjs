import {
  Otp,
  RefreshToken,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "../entities";
import {
  SendLoginOtpEmailRequestFixture,
  SendOtpResultFixture,
  UserFixture,
} from "../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { InvalidCredentialsError } from "../error";
import { MockFactory } from "mockingbird";
import { OtpModule } from "../otp/otp.module";
import { OtpService } from "../otp/otp.service";
import { SendLoginOtpEmailController } from "./send-login-otp-email.controller";
import { SendOtpResult } from "../otp/dto";
import { TokenModule } from "../token/token.module";
import { UnauthorizedException } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import exp from "constants";
import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("SendLoginOtpEmailController", () => {
  let sendLoginOtpEmailController: SendLoginOtpEmailController;
  let otpService: OtpService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TokenModule,
        UserModule,
        OtpModule,
        EventEmitterModule.forRoot(),
      ],
      controllers: [SendLoginOtpEmailController],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(UserRole))
      .useValue({
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(UserResetPasswordRequest))
      .useValue({
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(RefreshToken))
      .useValue({
        save: jest.fn(),
        findOne: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(Otp))
      .useValue({
        save: jest.fn(),
        findOne: jest.fn(),
      })
      .compile();

    sendLoginOtpEmailController = module.get<SendLoginOtpEmailController>(
      SendLoginOtpEmailController
    );

    userService = module.get<UserService>("UserService");
    otpService = module.get<OtpService>(OtpService);
  });

  it("should be defined", () => {
    expect(sendLoginOtpEmailController).toBeDefined();
  });

  it("should return send otp result with no active otp", async () => {
    const mockSendLoginOtpEmailRequestDto = MockFactory(
      SendLoginOtpEmailRequestFixture
    ).one();

    const mockValidUser = MockFactory(UserFixture)
      .mutate({
        email: mockSendLoginOtpEmailRequestDto.email,
      })
      .one();

    const mockSendOtpResult = MockFactory(SendOtpResultFixture)
      .mutate({
        isSent: true,
        expiresAt: faker.date.future(),
        otpValue: faker.word.noun(),
      })
      .one();

    const expectedResult = {
      isSent: mockSendOtpResult.isSent,
      expiresAt: mockSendOtpResult.expiresAt,
    };

    jest
      .spyOn(userService, "getUserAsync")
      .mockResolvedValueOnce(mockValidUser);
    jest
      .spyOn(otpService, "createEmailOtpAsync")
      .mockResolvedValueOnce(mockSendOtpResult);

    await expect(
      sendLoginOtpEmailController.sendLoginOtpEmailAsync(
        mockSendLoginOtpEmailRequestDto
      )
    ).resolves.toEqual(expectedResult);
  });

  it("should return send otp result with active otp", async () => {
    const mockSendLoginOtpEmailRequestDto = MockFactory(
      SendLoginOtpEmailRequestFixture
    ).one();

    const mockValidUser = MockFactory(UserFixture)
      .mutate({
        email: mockSendLoginOtpEmailRequestDto.email,
      })
      .one();

    const mockSendOtpResult = MockFactory(SendOtpResultFixture)
      .mutate({
        isSent: false,
        expiresAt: faker.date.future(),
      })
      .one();

    const expectedResult = {
      isSent: mockSendOtpResult.isSent,
      expiresAt: mockSendOtpResult.expiresAt,
    };

    jest
      .spyOn(userService, "getUserAsync")
      .mockResolvedValueOnce(mockValidUser);
    jest
      .spyOn(otpService, "createEmailOtpAsync")
      .mockResolvedValueOnce(mockSendOtpResult);

    await expect(
      sendLoginOtpEmailController.sendLoginOtpEmailAsync(
        mockSendLoginOtpEmailRequestDto
      )
    ).resolves.toEqual(expectedResult);
  });

  it("should throw error for unhandled errors", async () => {
    const mockSendLoginOtpEmailRequestDto = MockFactory(
      SendLoginOtpEmailRequestFixture
    ).one();

    const expectedResult = {
      isSent: false,
      expiresAt: faker.date.future(),
    } as SendOtpResult;

    jest
      .spyOn(userService, "getUserAsync")
      .mockRejectedValueOnce(new Error("mock error"));

    expect(
      sendLoginOtpEmailController.sendLoginOtpEmailAsync(
        mockSendLoginOtpEmailRequestDto
      )
    ).rejects.toThrow(new Error("mock error"));
  });
});
