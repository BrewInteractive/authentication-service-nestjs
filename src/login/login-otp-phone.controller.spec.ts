import {
  LoginOtpPhoneRequestFixture,
  TokensFixture,
  UserFixture,
} from "../../test/fixtures";
import {
  Otp,
  RefreshToken,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "../entities";
import { Test, TestingModule } from "@nestjs/testing";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { InvalidCredentialsError } from "../error";
import { LoginOtpPhoneController } from "./login-otp-phone.controller";
import { MockFactory } from "mockingbird";
import { OtpModule } from "../otp/otp.module";
import { OtpService } from "../otp/otp.service";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { UnauthorizedException } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("LoginOtpPhoneController", () => {
  let loginOtpPhoneController: LoginOtpPhoneController;
  let otpService: OtpService;
  let userService: UserService;
  let tokenService: TokenService;

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
      ],
      controllers: [LoginOtpPhoneController],
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

    loginOtpPhoneController = module.get<LoginOtpPhoneController>(
      LoginOtpPhoneController
    );
    tokenService = module.get<TokenService>("TokenService");
    userService = module.get<UserService>("UserService");
    otpService = module.get<OtpService>(OtpService);
  });

  it("should be defined", () => {
    expect(loginOtpPhoneController).toBeDefined();
  });

  it("should return tokens if the phone and otp code are valid", async () => {
    const mockLoginOtpPhoneRequestDto = MockFactory(
      LoginOtpPhoneRequestFixture
    ).one();

    const mockUser = MockFactory(UserFixture).one();
    const mockToken = MockFactory(TokensFixture).one();

    jest.spyOn(otpService, "validatePhoneOtpAsync").mockResolvedValueOnce(true);
    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(mockUser);
    jest.spyOn(otpService, "expireOtpAsync").mockResolvedValueOnce(void 0);

    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockResolvedValueOnce(mockToken);

    await expect(
      loginOtpPhoneController.loginAsync(mockLoginOtpPhoneRequestDto)
    ).resolves.toEqual(mockToken);
  });

  it("should not return tokens if the phone and otp code are invalid", async () => {
    const loginOtpPhoneRequestDto = MockFactory(
      LoginOtpPhoneRequestFixture
    ).one();
    console.log(loginOtpPhoneRequestDto);

    const expectedResult = new UnauthorizedException(null, {
      cause: new InvalidCredentialsError(),
    });

    jest
      .spyOn(otpService, "validatePhoneOtpAsync")
      .mockResolvedValueOnce(false);

    await expect(
      loginOtpPhoneController.loginAsync(loginOtpPhoneRequestDto)
    ).rejects.toThrow(expectedResult);
  });

  it("should return error if there is no user", async () => {
    const mockLoginOtpPhoneRequestDto = MockFactory(
      LoginOtpPhoneRequestFixture
    ).one();

    const expectedResult = new UnauthorizedException(null, {
      cause: new InvalidCredentialsError(),
    });

    jest.spyOn(otpService, "validatePhoneOtpAsync").mockResolvedValueOnce(true);
    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);

    await expect(
      loginOtpPhoneController.loginAsync(mockLoginOtpPhoneRequestDto)
    ).rejects.toThrow(expectedResult);
  });
});
