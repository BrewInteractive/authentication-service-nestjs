import {
  LoginOtpEmailRequestFixture,
  TokensFixture,
  UserFixture,
} from "../../test/fixtures";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
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
import { LoginOtpEmailController } from "./login-otp-email.controller";
import { MockFactory } from "mockingbird";
import { OtpModule } from "../otp/otp.module";
import { OtpService } from "../otp/otp.service";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("LoginOtpEmailController", () => {
  let loginOtpEmailController: LoginOtpEmailController;
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
      controllers: [LoginOtpEmailController],
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

    loginOtpEmailController = module.get<LoginOtpEmailController>(
      LoginOtpEmailController
    );
    tokenService = module.get<TokenService>("TokenService");
    userService = module.get<UserService>("UserService");
    otpService = module.get<OtpService>(OtpService);
  });

  it("should be defined", () => {
    expect(loginOtpEmailController).toBeDefined();
  });

  it("should not return a token if the email and otp code are invalid", async () => {
    const loginOtpEmailRequestDto = MockFactory(
      LoginOtpEmailRequestFixture
    ).one();

    const expectedResult = new UnauthorizedException("Invalid credentials");

    jest
      .spyOn(otpService, "validateEmailOtpAsync")
      .mockResolvedValueOnce(false);

    await expect(
      loginOtpEmailController.loginAsync(loginOtpEmailRequestDto)
    ).rejects.toThrow(expectedResult);
  });

  it("If there is no user, the error should return", async () => {
    const mockLoginOtpEmailRequestDto = MockFactory(
      LoginOtpEmailRequestFixture
    ).one();

    const expectedResult = new NotFoundException("User not found");

    jest.spyOn(otpService, "validateEmailOtpAsync").mockResolvedValueOnce(true);

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);

    await expect(
      loginOtpEmailController.loginAsync(mockLoginOtpEmailRequestDto)
    ).rejects.toThrow(expectedResult);
  });

  it("should return a token if the email and otp code are valid", async () => {
    const mockLoginOtpEmailRequestDto = MockFactory(
      LoginOtpEmailRequestFixture
    ).one();

    const mockUser = MockFactory(UserFixture).one();
    const mockToken = MockFactory(TokensFixture).one();

    jest.spyOn(otpService, "validateEmailOtpAsync").mockResolvedValueOnce(true);

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(mockUser);

    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockResolvedValueOnce(mockToken);

    await expect(
      loginOtpEmailController.loginAsync(mockLoginOtpEmailRequestDto)
    ).resolves.toEqual(mockToken);
  });
});
