import {
  TokensFixture,
  UserFixture,
  SignUpOtpEmailRequestFixture,
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
import { UserAlreadyExistsError } from "../error";
import { SignUpOtpEmailController } from "./sign-up-otp-email.controller";
import { MockFactory } from "mockingbird";
import { OtpModule } from "../otp/otp.module";
import { OtpService } from "../otp/otp.service";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import {
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SignUpProfile } from "./mapping-profiles/sign-up.mapping-profile";

describe("SignUpOtpEmailController", () => {
  let signUpOtpEmailController: SignUpOtpEmailController;
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
      controllers: [SignUpOtpEmailController],
      providers: [SignUpProfile],
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

    signUpOtpEmailController = module.get<SignUpOtpEmailController>(
      SignUpOtpEmailController
    );
    tokenService = module.get<TokenService>("TokenService");
    userService = module.get<UserService>("UserService");
    otpService = module.get<OtpService>(OtpService);
  });

  it("should be defined", () => {
    expect(signUpOtpEmailController).toBeDefined();
  });

  it("should return tokens if the email and otp code are valid", async () => {
    const mockSignUpOtpRequestDto = MockFactory(
      SignUpOtpEmailRequestFixture
    ).one();

    const mockUser = MockFactory(UserFixture).one();
    const mockToken = MockFactory(TokensFixture).one();

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);
    jest.spyOn(otpService, "validateEmailOtpAsync").mockResolvedValueOnce(true);
    jest.spyOn(otpService, "expireOtpAsync").mockResolvedValueOnce(void 0);
    jest.spyOn(userService, "createUserAsync").mockResolvedValueOnce(mockUser);
    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockResolvedValueOnce(mockToken);

    await expect(
      signUpOtpEmailController.signUpAsync(mockSignUpOtpRequestDto)
    ).resolves.toEqual(mockToken);
  });

  it("should throw UnauthorizedException if the email and otp code are invalid", async () => {
    const mockSignUpOtpRequestDto = MockFactory(
      SignUpOtpEmailRequestFixture
    ).one();

    jest
      .spyOn(otpService, "validateEmailOtpAsync")
      .mockResolvedValueOnce(false);

    await expect(
      signUpOtpEmailController.signUpAsync(mockSignUpOtpRequestDto)
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException if the user already exists", async () => {
    const mockSignUpOtpRequestDto = MockFactory(
      SignUpOtpEmailRequestFixture
    ).one();

    const mockUser = MockFactory(UserFixture).one();

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(mockUser);

    await expect(
      signUpOtpEmailController.signUpAsync(mockSignUpOtpRequestDto)
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException if user creation fails due to invalid credentials", async () => {
    const mockSignUpOtpRequestDto = MockFactory(
      SignUpOtpEmailRequestFixture
    ).one();

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);
    jest.spyOn(otpService, "validateEmailOtpAsync").mockResolvedValueOnce(true);
    jest.spyOn(otpService, "expireOtpAsync").mockResolvedValueOnce(void 0);
    jest
      .spyOn(userService, "createUserAsync")
      .mockRejectedValueOnce(new UserAlreadyExistsError());

    await expect(
      signUpOtpEmailController.signUpAsync(mockSignUpOtpRequestDto)
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw InternalServerErrorException for unhandled errors", async () => {
    const mockSignUpOtpRequestDto = MockFactory(
      SignUpOtpEmailRequestFixture
    ).one();

    jest
      .spyOn(userService, "getUserAsync")
      .mockRejectedValueOnce(new Error("mock error"));

    await expect(
      signUpOtpEmailController.signUpAsync(mockSignUpOtpRequestDto)
    ).rejects.toThrow(InternalServerErrorException);
  });
});
