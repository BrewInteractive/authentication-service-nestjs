import { SignUpFixture, UserFixture } from "../../test/fixtures";
import { User, UserRole } from "../entities";

import { SignUpController } from "./sign-up.controller";
import { AutomapperModule } from "@automapper/nestjs";
import { MockFactory } from "mockingbird";
import { SignUpProfile } from "./mapping-profiles/sign-up.profile";
import { Test } from "@nestjs/testing";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import { faker } from "@faker-js/faker";
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
      .compile();

    signUpController = moduleRef.get<SignUpController>(SignUpController);
    tokenService = moduleRef.get<TokenService>("TokenService");
    userService = moduleRef.get<UserService>("UserService");
  });

  it("should return a token if the sign-up process is successful", async () => {
    const signUpDto = MockFactory(SignUpFixture).one();
    const user = MockFactory(UserFixture).one() as User;
    const token = faker.random.alphaNumeric(32);

    jest
      .spyOn(userService, "createUserAsync")
      .mockReturnValueOnce(Promise.resolve(user));

    jest
      .spyOn(tokenService, "createTokenAsync")
      .mockReturnValueOnce(Promise.resolve(token));

    await expect(signUpController.signUpAsync(signUpDto)).resolves.toEqual({
      id_token: token,
    });
  });
});
