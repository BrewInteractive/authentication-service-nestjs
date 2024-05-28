import {
  Otp,
  RefreshToken,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "../entities";
import {
  SendLoginOtpPhoneRequestFixture,
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
import { TokenModule } from "../token/token.module";
import { UnauthorizedException } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SendLoginOtpPhoneController } from "./send-login-otp-phone.controller";

describe("SendLoginOtpEmailController", () => {
  let sendLoginOtpPhoneController: SendLoginOtpPhoneController;
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
      controllers: [SendLoginOtpPhoneController],
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

    sendLoginOtpPhoneController = module.get<SendLoginOtpPhoneController>(
      SendLoginOtpPhoneController
    );

    userService = module.get<UserService>("UserService");
    otpService = module.get<OtpService>(OtpService);
  });

  it("should be defined", () => {
    expect(sendLoginOtpPhoneController).toBeDefined();
  });

  it("should return send otp result with no active otp", async () => {
    const mockSendLoginOtpPhoneRequestDto = MockFactory(
      SendLoginOtpPhoneRequestFixture
    ).one();

    const mockValidUser = MockFactory(UserFixture)
      .mutate({
        countryCode: mockSendLoginOtpPhoneRequestDto.phone.countryCode,
        phoneNumber: mockSendLoginOtpPhoneRequestDto.phone.phoneNumber,
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
      .spyOn(otpService, "createPhoneOtpAsync")
      .mockResolvedValueOnce(mockSendOtpResult);

    await expect(
      sendLoginOtpPhoneController.sendLoginOtpPhoneAsync(
        mockSendLoginOtpPhoneRequestDto
      )
    ).resolves.toEqual(expectedResult);
  });

  it("should return send otp result with active otp", async () => {
    const mockSendLoginOtpEmailRequestDto = MockFactory(
      SendLoginOtpPhoneRequestFixture
    ).one();

    const mockValidUser = MockFactory(UserFixture)
      .mutate({
        countryCode: mockSendLoginOtpEmailRequestDto.phone.countryCode,
        phoneNumber: mockSendLoginOtpEmailRequestDto.phone.phoneNumber,
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
      .spyOn(otpService, "createPhoneOtpAsync")
      .mockResolvedValueOnce(mockSendOtpResult);

    await expect(
      sendLoginOtpPhoneController.sendLoginOtpPhoneAsync(
        mockSendLoginOtpEmailRequestDto
      )
    ).resolves.toEqual(expectedResult);
  });

  it("should throw UnauthorizedException if there is no user", async () => {
    const mockSendLoginOtpPhoneRequestDto = MockFactory(
      SendLoginOtpPhoneRequestFixture
    ).one();

    const mockSendOtpResult = MockFactory(SendOtpResultFixture)
      .mutate({
        isSent: false,
        expiresAt: faker.date.future(),
      })
      .omit("otpValue")
      .one();

    const expectedResult = {
      isSent: mockSendOtpResult.isSent,
      expiresAt: mockSendOtpResult.expiresAt,
    };

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);

    jest
      .spyOn(otpService, "createFakeOtpResult")
      .mockReturnValue(mockSendOtpResult);

    await expect(
      sendLoginOtpPhoneController.sendLoginOtpPhoneAsync(
        mockSendLoginOtpPhoneRequestDto
      )
    ).resolves.toEqual(expectedResult);
  });
});
