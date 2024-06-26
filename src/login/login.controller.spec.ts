import {
  LoginRequestFixture,
  TokensFixture,
  UserFixture,
} from "../../test/fixtures";
import {
  RefreshToken,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "../entities";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { InvalidCredentialsError } from "../error";
import { LoginController } from "./login.controller";
import { LoginProfile } from "./mapping-profiles/login.mapping-profile";
import { MockFactory } from "mockingbird";
import { Test } from "@nestjs/testing";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { Tokens } from "../dto";
import { UnauthorizedException } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("LoginController", () => {
  let loginController: LoginController;
  let tokenService: TokenService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        UserModule,
        TokenModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [LoginController],
      providers: [LoginProfile],
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
      .compile();

    loginController = moduleRef.get<LoginController>(LoginController);
    tokenService = moduleRef.get<TokenService>("TokenService");
    userService = moduleRef.get<UserService>("UserService");
  });

  it("should return a token if the email and password are valid", async () => {
    const loginRequestDto = MockFactory(LoginRequestFixture).one();
    const user = MockFactory(UserFixture).one();
    delete loginRequestDto.username;

    const tokens = MockFactory(TokensFixture).one() as Tokens;

    jest
      .spyOn(userService, "validateUserAsync")
      .mockReturnValueOnce(Promise.resolve(user as User));

    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockReturnValueOnce(Promise.resolve(tokens));

    await expect(loginController.loginAsync(loginRequestDto)).resolves.toEqual(
      tokens
    );
  });

  it("should return a token if the username and password are valid", async () => {
    const loginRequestDto = MockFactory(LoginRequestFixture).one();
    const user = MockFactory(UserFixture).one();
    delete loginRequestDto.email;

    const tokens = MockFactory(TokensFixture).one() as Tokens;

    jest
      .spyOn(userService, "validateUserAsync")
      .mockReturnValueOnce(Promise.resolve(user as User));

    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockReturnValueOnce(Promise.resolve(tokens));

    await expect(loginController.loginAsync(loginRequestDto)).resolves.toEqual(
      tokens
    );
  });

  it("should return a token if the email and password are valid. (With null email address)", async () => {
    const loginRequestDto = MockFactory(LoginRequestFixture)
      .mutate({
        email: null,
      })
      .one();
    const user = MockFactory(UserFixture).one();

    const tokens = MockFactory(TokensFixture).one() as Tokens;

    jest
      .spyOn(userService, "validateUserAsync")
      .mockReturnValueOnce(Promise.resolve(user as User));

    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockReturnValueOnce(Promise.resolve(tokens));

    await expect(loginController.loginAsync(loginRequestDto)).resolves.toEqual(
      tokens
    );
  });

  it("should throw UnauthorizedException if the email and password are invalid", async () => {
    const loginRequestDto = MockFactory(LoginRequestFixture).one();

    const invalidCredentialsError = new InvalidCredentialsError();
    const exception = new UnauthorizedException(null, {
      cause: invalidCredentialsError,
    });
    jest
      .spyOn(userService, "validateUserAsync")
      .mockRejectedValueOnce(invalidCredentialsError);

    await expect(loginController.loginAsync(loginRequestDto)).rejects.toThrow(
      exception
    );
  });

  it("should throw error for unhandled errors", async () => {
    const loginRequestDto = MockFactory(LoginRequestFixture).one();

    jest
      .spyOn(userService, "validateUserAsync")
      .mockRejectedValueOnce(new Error("mock error"));

    await expect(loginController.loginAsync(loginRequestDto)).rejects.toThrow(
      new Error("Internal Server Error")
    );
  });
});
