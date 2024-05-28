import { InvalidCredentialsError, UserAlreadyExistsError } from "../error";
import { PhoneModule, faker } from "@faker-js/faker";
import { User, UserRole } from "../entities";

import { IPostRegisterUserHandler } from "./interfaces/post-register-user-handler.interface";
import { IPreRegisterUserHandler } from "./interfaces/pre-register-user-handler.interface";
import { IUserValidator } from "./interfaces/user-validator.interface";
import { MockFactory } from "mockingbird";
import { Repository } from "typeorm";
import { Test } from "@nestjs/testing";
import { UserFixture } from "../../test/fixtures/user/user.fixture";
import { UserService } from "./user.service";

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

  afterEach(() => {
    jest.clearAllMocks();
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
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: [
        { username: expectedResult.username },
        { email: expectedResult.email },
      ],
      relations: ["roles", "roles.role"],
    });
  });

  it("getUserAsync should return a user with email", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(expectedResult));

    const actualResult = await userService.getUserAsync({
      email: expectedResult.email,
    });

    expect(actualResult).toBe(expectedResult);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: [{ email: expectedResult.email }],
      relations: ["roles", "roles.role"],
    });
  });

  it("getUserAsync should return a user with user name", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(expectedResult));

    const actualResult = await userService.getUserAsync({
      username: expectedResult.username,
    });

    expect(actualResult).toBe(expectedResult);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: [{ username: expectedResult.username }],
      relations: ["roles", "roles.role"],
    });
  });

  it("getUserAsync should return a user with phone", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(expectedResult));

    const actualResult = await userService.getUserAsync({
      phone: {
        phoneNumber: expectedResult.phoneNumber,
        countryCode: expectedResult.countryCode,
      },
    });

    expect(actualResult).toBe(expectedResult);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: [
        {
          phoneNumber: expectedResult.phoneNumber,
          countryCode: expectedResult.countryCode,
        },
      ],
      relations: ["roles", "roles.role"],
    });
  });

  it("getUserAsync should return a user with all arguments", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(expectedResult));

    const actualResult = await userService.getUserAsync({
      phone: {
        phoneNumber: expectedResult.phoneNumber,
        countryCode: expectedResult.countryCode,
      },
      email: expectedResult.email,
      username: expectedResult.username,
    });

    expect(actualResult).toBe(expectedResult);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: [
        { username: expectedResult.username },
        { email: expectedResult.email },
        {
          phoneNumber: expectedResult.phoneNumber,
          countryCode: expectedResult.countryCode,
        },
      ],
      relations: ["roles", "roles.role"],
    });
  });

  test.each([
    [{}, "all"],
    [{ phone: {} }, "phone"],
    [{ phone: { phoneNumber: faker.phone.number() } }, "phone.countryCode"],
    [
      { phone: { countryCode: faker.location.countryCode() } },
      "phone.phoneNumber",
    ],
    [{ username: "" }, "username"],
    [{ email: "" }, "email"],
    [{ username: "", email: "" }, "username and email"],
    [
      { phone: { phoneNumber: faker.phone.number(), countryCode: "" } },
      "phone.countryCode",
    ],
    [
      { phone: { phoneNumber: "", countryCode: faker.location.countryCode() } },
      "phone.phoneNumber",
    ],
  ])(
    "getUserAsync should throw exception if %s not provided",
    async (args, missingArg) => {
      await expect(userService.getUserAsync(args)).rejects.toThrow(
        new Error(`Provide at least one of: username, email, or phone number.`)
      );
    }
  );

  it("createUserAsync should throw UserAlreadyExistsError if the username or email already exists", async () => {
    const user = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(user));

    await expect(userService.createUserAsync(user)).rejects.toThrow(
      UserAlreadyExistsError
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

  it("validateUserAsync should throw an InvalidCredentialsError if the email and username does not exist", async () => {
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

  it("validateUserAsync should throw an InvalidCredentialsError if the password is invalid", async () => {
    const user = MockFactory(UserFixture).one() as User;

    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
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

  it("validateUserAsync should throw an InvalidCredentialsError if the imposter is invalid", async () => {
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
    ).rejects.toThrow(InvalidCredentialsError);
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

  it("updateUserPasswordAsync should update the user's password and salt", async () => {
    const user = MockFactory(UserFixture).one() as User;
    const newPassword = faker.internet.password();
    const newSalt = "newSalt";
    const newPasswordHash = "newPasswordHash";

    jest.spyOn(bcrypt, "genSaltSync").mockReturnValue(newSalt);
    jest.spyOn(bcrypt, "hashSync").mockReturnValue(newPasswordHash);
    jest.spyOn(userRepository, "save").mockResolvedValue(user);

    await userService.updateUserPasswordAsync(user, newPassword);

    expect(bcrypt.genSaltSync).toHaveBeenCalledTimes(1);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(newPassword, newSalt);
    expect(userRepository.save).toHaveBeenCalledWith({
      ...user,
      passwordHash: newPasswordHash,
      passwordSalt: newSalt,
    });
  });
});
