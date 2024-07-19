import {
  Otp,
  RefreshToken,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "../entities";
import {
  SendOtpResultFixture,
  SendSignUpOtpEmailRequestFixture,
  UserFixture,
} from "../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MockFactory } from "mockingbird";
import { OtpModule } from "../otp/otp.module";
import { OtpService } from "../otp/otp.service";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SendSignUpOtpEmailController } from "./send-sign-up-otp-email.controller";
import { ConflictException } from "@nestjs/common";
import { UserAlreadyExistsError } from "../error";

describe("SendSignUpOtpEmailController", () => {
  let sendSignUpOtpEmailController: SendSignUpOtpEmailController;
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
      controllers: [SendSignUpOtpEmailController],
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

    sendSignUpOtpEmailController = module.get<SendSignUpOtpEmailController>(
      SendSignUpOtpEmailController
    );

    userService = module.get<UserService>("UserService");
    otpService = module.get<OtpService>(OtpService);
  });

  it("should be defined", () => {
    expect(sendSignUpOtpEmailController).toBeDefined();
  });

  it("should return send otp result with no active otp and without user", async () => {
    const mockSendSignUpOtpEmailRequestDto = MockFactory(
      SendSignUpOtpEmailRequestFixture
    ).one();

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

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);
    jest
      .spyOn(otpService, "createEmailOtpAsync")
      .mockResolvedValueOnce(mockSendOtpResult);

    await expect(
      sendSignUpOtpEmailController.sendSignUpOtpEmailAsync(
        mockSendSignUpOtpEmailRequestDto
      )
    ).resolves.toEqual(expectedResult);
  });

  it("should return send otp result with active otp and without user", async () => {
    const mockSendSignUpOtpEmailRequestDto = MockFactory(
      SendSignUpOtpEmailRequestFixture
    ).one();

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

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);
    jest
      .spyOn(otpService, "createEmailOtpAsync")
      .mockResolvedValueOnce(mockSendOtpResult);

    await expect(
      sendSignUpOtpEmailController.sendSignUpOtpEmailAsync(
        mockSendSignUpOtpEmailRequestDto
      )
    ).resolves.toEqual(expectedResult);
  });

  it("should throw UserAlreadyExists with user", async () => {
    const mockSendSignUpOtpEmailRequestDto = MockFactory(
      SendSignUpOtpEmailRequestFixture
    ).one();

    const mockValidUser = MockFactory(UserFixture)
      .mutate({
        email: mockSendSignUpOtpEmailRequestDto.email,
      })
      .one();

    jest
      .spyOn(userService, "getUserAsync")
      .mockResolvedValueOnce(mockValidUser);

    await expect(
      sendSignUpOtpEmailController.sendSignUpOtpEmailAsync(
        mockSendSignUpOtpEmailRequestDto
      )
    ).rejects.toThrowError(
      new ConflictException(null, { cause: new UserAlreadyExistsError() })
    );
  });

  it("should throw error for unhandled errors", async () => {
    const mockSendSignUpOtpEmailRequestDto = MockFactory(
      SendSignUpOtpEmailRequestFixture
    ).one();

    jest
      .spyOn(userService, "getUserAsync")
      .mockRejectedValueOnce(new Error("mock error"));

    expect(
      sendSignUpOtpEmailController.sendSignUpOtpEmailAsync(
        mockSendSignUpOtpEmailRequestDto
      )
    ).rejects.toThrow(new Error("Internal Server Error"));
  });
});
