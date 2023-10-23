import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User, UserRole } from "../entities";
import { UserService } from "./user.service";
import { MockFactory } from "mockingbird";
import { UserFixture } from "../../test/fixtures/user/user.fixture";
import { IPreRegisterUserHandler } from "./interfaces/pre-register-user-handler.interface";
import { IPostRegisterUserHandler } from "./interfaces/post-register-user-handler.interface";
import { Repository } from "typeorm";
import { faker } from "@faker-js/faker";
import { IUserValidator } from "./interfaces/user-validator.interface";
const bcrypt = require("bcrypt");

describe("UserService", () => {
  let userService: UserService;
  let userRepository: Repository<User>;
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
      ],
    }).compile();
    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<Repository<User>>("UserRepository");
    userRoleRepository =
      moduleRef.get<Repository<UserRole>>("UserRoleRepository");
  });

  it("should return a user for getUserByUsernameAndEmail", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(expectedResult));

    const actualResult = await userService.getUserByUsernameAndEmailAsync(
      expectedResult.username,
      expectedResult.email
    );

    expect(actualResult).toBe(expectedResult);
  });

  it("should return null if the email and username does not exist for getUserByUsernameAndEmail", async () => {
    const user = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(null));

    const actualResult = await userService.getUserByUsernameAndEmailAsync(
      user.username,
      user.email
    );

    expect(actualResult).toBeNull();
  });

  it("should return a user for getUserByUsernameOrEmail", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userService, "getUserByUsernameAndEmailAsync")
      .mockResolvedValue(Promise.resolve(expectedResult));

    const actualResult = await userService.getUserByUsernameOrEmailAsync(
      expectedResult.username || expectedResult.email
    );

    expect(actualResult).toBe(expectedResult);
  });

  it("should return null if the email and username does not exist for getUserByUsernameOrEmail", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userService, "getUserByUsernameAndEmailAsync")
      .mockResolvedValue(null);

    const actualResult = await userService.getUserByUsernameOrEmailAsync(
      expectedResult.username || expectedResult.email
    );

    expect(actualResult).toBeNull();
  });

  it("should throw a ConflictException if the username or email already exists", async () => {
    const user = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(user));

    await expect(userService.createUserAsync(user)).rejects.toThrow(
      ConflictException
    );
  });

  it("should create a new user if the username and email do not exist", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userService, "getUserByUsernameOrEmailAsync")
      .mockResolvedValue(null);
    jest.spyOn(userRepository, "save").mockResolvedValue(expectedResult);
    jest.spyOn(userRoleRepository, "save").mockResolvedValue(null);

    const actualResult = await userService.createUserAsync(expectedResult);

    expect(actualResult).toBe(expectedResult);
  });

  it("should create a new user if the username and email do not exist(Empty role property)", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    expectedResult.roles = [];
    jest
      .spyOn(userService, "getUserByUsernameOrEmailAsync")
      .mockResolvedValue(null);
    jest.spyOn(userRepository, "save").mockResolvedValue(expectedResult);
    jest.spyOn(userRoleRepository, "save").mockResolvedValue(null);

    const actualResult = await userService.createUserAsync(expectedResult);

    expect(actualResult).toBe(expectedResult);
  });

  it("should create a new user if the username and email do not exist(With role)", async () => {
    const expectedResult = MockFactory(UserFixture).one().withRoles() as User;
    userService.addPreRegisterUserHandler({
      handleAsync: jest.fn().mockResolvedValue(expectedResult),
    });
    userService.addPostRegisterUserHandler({ handleAsync: jest.fn() });

    jest
      .spyOn(userService, "getUserByUsernameOrEmailAsync")
      .mockResolvedValue(null);
    jest.spyOn(userRepository, "save").mockResolvedValue(expectedResult);
    jest.spyOn(userRoleRepository, "save").mockResolvedValue(null);

    const actualResult = await userService.createUserAsync(expectedResult);

    expect(actualResult).toBe(expectedResult);
  });

  it("should throw an UnauthorizedException if the email and username is does not have", async () => {
    const user = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userService, "getUserByUsernameOrEmailAsync")
      .mockResolvedValue(null);

    const password = faker.internet.password();
    await expect(
      userService.validateUserAsync(user.username || user.email, password)
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw an UnauthorizedException if the password is invalid", async () => {
    const user = MockFactory(UserFixture).one() as User;
    const validateUser = MockFactory(UserFixture).one() as User;

    jest
      .spyOn(userService, "getUserByUsernameOrEmailAsync")
      .mockResolvedValue(user);

    const password = faker.internet.password();

    await expect(
      userService.validateUserAsync(
        validateUser.username || validateUser.email,
        password
      )
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw an UnauthorizedException if the imposter is invalid", async () => {
    const user = MockFactory(UserFixture).one() as User;
    userService.addUserValidator({
      validateAsync: jest.fn().mockResolvedValue(false),
    });

    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    jest
      .spyOn(userService, "getUserByUsernameOrEmailAsync")
      .mockResolvedValue(user);

    await expect(
      userService.validateUserAsync(
        user.username || user.email,
        faker.internet.password()
      )
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should return a user if the email and password are valid", async () => {
    const user = MockFactory(UserFixture).one() as User;
    userService.addUserValidator({
      validateAsync: jest.fn().mockResolvedValue(true),
    });

    const password = faker.internet.password();
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    jest
      .spyOn(userService, "getUserByUsernameOrEmailAsync")
      .mockResolvedValue(user);
    await expect(
      userService.validateUserAsync(user.username || user.email, password)
    ).resolves.toEqual({
      ...user,
    });
  });

  it("should add preRegisterUserHandler", () => {
    const handler: IPreRegisterUserHandler = { handleAsync: jest.fn() };
    userService.addPreRegisterUserHandler(handler);
    expect(userService["preRegisterUserHandlers"]).toContain(handler);
  });

  it("should add postRegisterUserHandler", () => {
    const handler: IPostRegisterUserHandler = { handleAsync: jest.fn() };
    userService.addPostRegisterUserHandler(handler);
    expect(userService["postRegisterUserHandlers"]).toContain(handler);
  });

  it("should add userValidator", () => {
    const validate: IUserValidator = { validateAsync: jest.fn() };
    userService.addUserValidator(validate);
    expect(userService["userValidators"]).toContain(validate);
  });
});
