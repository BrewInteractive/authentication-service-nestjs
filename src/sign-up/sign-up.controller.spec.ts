import {
  RefreshToken,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "../entities";
import {
  SignUpRequestFixture,
  TokensFixture,
  UserFixture,
} from "../../test/fixtures";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { ConflictException } from "@nestjs/common";
import { MockFactory } from "mockingbird";
import { SignUpController } from "./sign-up.controller";
import { SignUpProfile } from "./mapping-profiles/sign-up.mapping-profile";
import { Test } from "@nestjs/testing";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { Tokens } from "../dto";
import { UserAlreadyExistsError } from "../error";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("SignUpController", () => {
  let signUpController: SignUpController;
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
      controllers: [SignUpController],
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
      .compile();

    signUpController = moduleRef.get<SignUpController>(SignUpController);
    tokenService = moduleRef.get<TokenService>("TokenService");
    userService = moduleRef.get<UserService>("UserService");
  });

  it("should return tokens if the sign-up process is successful", async () => {
    const signUpRequestDto = MockFactory(SignUpRequestFixture).one();
    const user = MockFactory(UserFixture).one() as User;
    const tokens = MockFactory(TokensFixture).one() as Tokens;

    jest
      .spyOn(userService, "createUserAsync")
      .mockReturnValueOnce(Promise.resolve(user));

    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockReturnValueOnce(Promise.resolve(tokens));

    await expect(
      signUpController.signUpAsync(signUpRequestDto)
    ).resolves.toEqual(tokens);
  });

  it("should return tokens if the sign-up process is successful(With default role)", async () => {
    const signUpRequestDto = MockFactory(SignUpRequestFixture).one();
    const user = MockFactory(UserFixture).one() as User;
    const tokens = MockFactory(TokensFixture).one() as Tokens;

    process.env.USER_DEFAULT_ROLE = "user";

    jest
      .spyOn(userService, "createUserAsync")
      .mockReturnValueOnce(Promise.resolve(user));

    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockReturnValueOnce(Promise.resolve(tokens));

    await expect(
      signUpController.signUpAsync(signUpRequestDto)
    ).resolves.toEqual(tokens);
  });

  it("should throw ConflictException if the user already exists", async () => {
    const signUpRequestDto = MockFactory(SignUpRequestFixture).one();

    jest.spyOn(userService, "createUserAsync").mockImplementationOnce(() => {
      throw new UserAlreadyExistsError();
    });

    await expect(
      signUpController.signUpAsync(signUpRequestDto)
    ).rejects.toThrow(ConflictException);
  });

  it("should throw error for unhandled errors", async () => {
    const signUpRequestDto = MockFactory(SignUpRequestFixture).one();

    jest.spyOn(userService, "createUserAsync").mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(
      signUpController.signUpAsync(signUpRequestDto)
    ).rejects.toThrow(new Error("Internal Server Error"));
  });
});
