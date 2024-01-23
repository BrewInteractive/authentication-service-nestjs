import { SignUpFixture, TokensFixture, UserFixture } from "../../test/fixtures";
import {
  RefreshToken,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "../entities";

import { AutomapperModule } from "@automapper/nestjs";
import { MockFactory } from "mockingbird";
import { SignUpController } from "./sign-up.controller";
import { SignUpProfile } from "./mapping-profiles/sign-up.profile";
import { Test } from "@nestjs/testing";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { Tokens } from "../dto";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

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

  it("should return a token if the sign-up process is successful", async () => {
    const signUpDto = MockFactory(SignUpFixture).one();
    const user = MockFactory(UserFixture).one() as User;
    const tokens = MockFactory(TokensFixture).one() as Tokens;

    jest
      .spyOn(userService, "createUserAsync")
      .mockReturnValueOnce(Promise.resolve(user));

    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockReturnValueOnce(Promise.resolve(tokens));

    await expect(signUpController.signUpAsync(signUpDto)).resolves.toEqual(
      tokens
    );
  });

  it("should return a token if the sign-up process is successful(With default role)", async () => {
    const signUpDto = MockFactory(SignUpFixture).one();
    const user = MockFactory(UserFixture).one() as User;
    const tokens = MockFactory(TokensFixture).one() as Tokens;

    process.env.USER_DEFAULT_ROLE = "user";

    jest
      .spyOn(userService, "createUserAsync")
      .mockReturnValueOnce(Promise.resolve(user));

    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockReturnValueOnce(Promise.resolve(tokens));

    await expect(signUpController.signUpAsync(signUpDto)).resolves.toEqual(
      tokens
    );
  });
});
