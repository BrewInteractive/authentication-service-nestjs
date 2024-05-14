import { ConflictException, UnauthorizedException } from "@nestjs/common";
import {
  ResetPasswordFixture,
  UserResetPasswordRequestFixture,
} from "../../test/fixtures";
import { User, UserResetPasswordRequest, UserRole } from "../entities";

import { IPostRegisterUserHandler } from "./interfaces/post-register-user-handler.interface";
import { IPreRegisterUserHandler } from "./interfaces/pre-register-user-handler.interface";
import { IUserValidator } from "./interfaces/user-validator.interface";
import { MockFactory } from "mockingbird";
import { Repository } from "typeorm";
import { Test } from "@nestjs/testing";
import { UserFixture } from "../../test/fixtures/user/user.fixture";
import { UserService } from "./user.service";
import { faker } from "@faker-js/faker";
import { UserExistsError } from "../exception/user-exists.error";
import { InvalidResetPasswordRequestError } from "../exception/invalid-reset-password-request.error";
import { InvalidCredentialsError } from "../exception/invalid-credentials.error";
import { InvalidUserError } from "../exception/invalid-user.error";

const bcrypt = require("bcrypt");

describe("UserService", () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let userResetPasswordRequestRepository: Repository<UserResetPasswordRequest>;
  let userRoleRepository: Repository<UserRole>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: "UserRepository",
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: "UserRoleRepository",
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: "UserResetPasswordRequestRepository",
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();
    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<Repository<User>>("UserRepository");
    userRoleRepository =
      moduleRef.get<Repository<UserRole>>("UserRoleRepository");
    userResetPasswordRequestRepository = moduleRef.get<
      Repository<UserResetPasswordRequest>
    >("UserResetPasswordRequestRepository");
  });

  it("getUserAsync should return a user", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(expectedResult));

    const actualResult = await userService.getUserAsync({
      username: expectedResult.username,
      email: expectedResult.email,
    });

    expect(actualResult).toBe(expectedResult);
  });

  it("getUserAsync should return null if the email and username does not exist", async () => {
    const user = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(null));

    const actualResult = await userService.getUserAsync({
      username: user.username,
      email: user.email,
    });

    expect(actualResult).toBeNull();
  });

  it("getUserAsync should throw exception if username or email is not provided", async () => {
    await expect(userService.getUserAsync({})).rejects.toThrow(
      new Error("At least one of username or email must be provided.")
    );
  });

  it("createUserAsync should throw a ConflictException if the username or email already exists", async () => {
    const user = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(user));

    await expect(userService.createUserAsync(user)).rejects.toThrow(
      UserExistsError
    );
  });

  it("should create a new user if the username and email do not exist", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    jest.spyOn(userService, "getUserAsync").mockResolvedValue(null);
    jest.spyOn(userRepository, "save").mockResolvedValue(expectedResult);
    jest.spyOn(userRoleRepository, "save").mockResolvedValue(null);

    const actualResult = await userService.createUserAsync(expectedResult);

    expect(actualResult).toBe(expectedResult);
  });

  it("createUserAsync should create a new user if the username and email do not exist(With role)", async () => {
    const expectedResult = MockFactory(UserFixture).one().withRoles() as User;
    userService.addPreRegisterUserHandler({
      handleAsync: jest.fn().mockResolvedValue(expectedResult),
    });
    userService.addPostRegisterUserHandler({
      handleAsync: jest.fn().mockResolvedValue(expectedResult),
    });

    jest.spyOn(userService, "getUserAsync").mockResolvedValue(null);
    jest.spyOn(userRepository, "save").mockResolvedValue(expectedResult);
    jest.spyOn(userRoleRepository, "save").mockResolvedValue(null);

    const actualResult = await userService.createUserAsync(expectedResult);

    expect(actualResult).toBe(expectedResult);
  });

  it("validateUserAsync should throw an UnauthorizedException if the email and username does not exist", async () => {
    const user = MockFactory(UserFixture).one() as User;
    jest.spyOn(userService, "getUserAsync").mockResolvedValue(null);

    const password = faker.internet.password();
    await expect(
      userService.validateUserAsync({
        password,
        username: user.username,
        email: user.email,
      })
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it("validateUserAsync should throw an UnauthorizedException if the password is invalid", async () => {
    const user = MockFactory(UserFixture).one() as User;

    jest.spyOn(userService, "getUserAsync").mockResolvedValue(user);

    const invalidPassword = faker.internet.password();

    await expect(
      userService.validateUserAsync({
        password: invalidPassword,
        username: user.username,
        email: user.email,
      })
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it("validateUserAsync should throw an UnauthorizedException if the imposter is invalid", async () => {
    const user = MockFactory(UserFixture).one() as User;
    const password = faker.internet.password();
    userService.addUserValidator({
      validateAsync: jest.fn().mockResolvedValue(false),
    });

    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    jest.spyOn(userService, "getUserAsync").mockResolvedValue(user);

    await expect(
      userService.validateUserAsync({
        password,
        username: user.username,
        email: user.email,
      })
    ).rejects.toThrow(InvalidUserError);
  });

  it("validateUserAsync should return a user if the email and password are valid", async () => {
    const user = MockFactory(UserFixture).one() as User;
    userService.addUserValidator({
      validateAsync: jest.fn().mockResolvedValue(true),
    });

    const password = faker.internet.password();
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    jest.spyOn(userService, "getUserAsync").mockResolvedValue(user);
    await expect(
      userService.validateUserAsync({
        password,
        username: user.username,
        email: user.email,
      })
    ).resolves.toEqual({
      ...user,
    });
  });

  it("addPreRegisterUserHandler should add preRegisterUserHandler", () => {
    const handler: IPreRegisterUserHandler = { handleAsync: jest.fn() };
    userService.addPreRegisterUserHandler(handler);
    expect(userService["preRegisterUserHandlers"]).toContain(handler);
  });

  it("addPostRegisterUserHandler should add postRegisterUserHandler", () => {
    const handler: IPostRegisterUserHandler = { handleAsync: jest.fn() };
    userService.addPostRegisterUserHandler(handler);
    expect(userService["postRegisterUserHandlers"]).toContain(handler);
  });

  it("addUserValidator should add userValidator", () => {
    const validate: IUserValidator = { validateAsync: jest.fn() };
    userService.addUserValidator(validate);
    expect(userService["userValidators"]).toContain(validate);
  });

  it("getResetPasswordRequestAsync should return a userResetPasswordRequest", async () => {
    const expectedResult = MockFactory(UserResetPasswordRequestFixture)
      .mutate({
        expiresAt: faker.date.future(1),
      })
      .one();

    jest
      .spyOn(userResetPasswordRequestRepository, "findOne")
      .mockResolvedValue(Promise.resolve(expectedResult));

    const actualResult = await userService.getResetPasswordRequestAsync(
      expectedResult.key
    );

    expect(actualResult).toBe(expectedResult);
  });

  it("getResetPasswordRequestByIdAsync should return a userResetPasswordRequest", async () => {
    const expectedResult = MockFactory(UserResetPasswordRequestFixture)
      .mutate({
        expiresAt: faker.date.future(1),
        user: MockFactory(UserFixture).one(),
      })
      .one();

    jest
      .spyOn(userResetPasswordRequestRepository, "findOne")
      .mockResolvedValue(Promise.resolve(expectedResult));

    const actualResult = await userService.getResetPasswordRequestByIdAsync(
      expectedResult.id
    );

    expect(actualResult).toBe(expectedResult);
  });

  it("resetPasswordAsync should throw UnauthorizedException for invalid reset key", async () => {
    const resetPasswordRequest = MockFactory(ResetPasswordFixture).one();
    jest
      .spyOn(userService, "getResetPasswordRequestAsync")
      .mockResolvedValue(null);

    try {
      await userService.resetPasswordAsync(resetPasswordRequest);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidResetPasswordRequestError);
      expect(e.message).toBe("Invalid reset password request.");
    }
  });

  it("resetPasswordAsync should throw UnauthorizedException for expired reset request", async () => {
    const validKey = faker.datatype.string(16);
    const email = faker.internet.email();

    const resetPasswordRequest = MockFactory(ResetPasswordFixture)
      .mutate({
        key: validKey,
        email: email,
      })
      .one();
    const user = MockFactory(UserFixture)
      .mutate({
        email: resetPasswordRequest.email,
      })
      .one() as User;

    const userResetPasswordData = MockFactory(UserResetPasswordRequestFixture)
      .mutate({
        key: validKey,
        expiresAt: faker.date.past(1),
      })
      .one();

    jest.spyOn(userService, "getUserAsync").mockResolvedValue(user);
    jest
      .spyOn(userService, "getResetPasswordRequestAsync")
      .mockResolvedValue(userResetPasswordData);
    try {
      await userService.resetPasswordAsync(resetPasswordRequest);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidResetPasswordRequestError);
      expect(e.message).toBe("Reset password request is expired.");
    }
  });
  it("resetPasswordAsync should throw UnauthorizedException for not found user", async () => {
    const validKey = faker.datatype.string(16);
    const resetPasswordRequest = MockFactory(ResetPasswordFixture)
      .mutate({
        key: validKey,
      })
      .one();
    const userResetPasswordData = MockFactory(UserResetPasswordRequestFixture)
      .mutate({
        key: validKey,
        expiresAt: faker.date.future(1),
      })
      .one();
    jest
      .spyOn(userService, "getResetPasswordRequestAsync")
      .mockResolvedValue(userResetPasswordData);
    try {
      await userService.resetPasswordAsync(resetPasswordRequest);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidResetPasswordRequestError);
      expect(e.message).toBe("Invalid reset password request.");
    }
  });

  it("resetPasswordAsync should update user password and reset request expiration", async () => {
    const email = faker.internet.email();
    const validKey = faker.datatype.string(16);

    const resetPasswordRequest = MockFactory(ResetPasswordFixture)
      .mutate({
        key: validKey,
        email: email,
      })
      .one();

    const user = MockFactory(UserFixture)
      .mutate({
        email: resetPasswordRequest.email,
      })
      .one() as User;

    jest.spyOn(userService, "getUserAsync").mockResolvedValue(user);

    const userResetPasswordData = MockFactory(UserResetPasswordRequestFixture)
      .mutate({
        key: validKey,
        user: user,
        expiresAt: faker.date.future(1),
      })
      .one();

    jest
      .spyOn(userService, "getResetPasswordRequestAsync")
      .mockResolvedValue(userResetPasswordData);

    await userService.resetPasswordAsync(resetPasswordRequest);

    expect(userRepository.save).toHaveBeenCalled();
    expect(userResetPasswordRequestRepository.save).toHaveBeenCalled();
  });
});
