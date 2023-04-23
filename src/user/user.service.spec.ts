import { ConflictException, UnauthorizedException } from "@nestjs/common";

import { Test } from "@nestjs/testing";
import { User } from "../models/user.entity";
import { UserService } from "./user.service";
import { MockFactory } from "mockingbird";
import { UserFixture } from "../../test/fixtures/user/user.fixture";
import { Repository } from "typeorm";
const bcrypt = require("bcrypt");

describe("UserService", () => {
  let userService: UserService;
  let userRepository: Repository<User>;
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
      ],
    }).compile();
    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<Repository<User>>("UserRepository");
  });

  it("should return a user", async () => {
    const expectedResult = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(expectedResult));

    const actualResult = await userService.getUserAsync(
      expectedResult.username,
      expectedResult.email
    );

    expect(actualResult).toBe(expectedResult);
  });

  it("should return null if the email and username does not exist", async () => {
    const user = MockFactory(UserFixture).one() as User;
    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(null));

    const actualResult = await userService.getUserAsync(
      user.username,
      user.email
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
    jest.spyOn(userService, "getUserAsync").mockResolvedValue(null);
    jest.spyOn(userRepository, "save").mockResolvedValue(expectedResult);

    const actualResult = await userService.createUserAsync(expectedResult);

    expect(actualResult).toBe(expectedResult);
  });

  it("should throw an UnauthorizedException if the email and username is does not have", async () => {
    const user = MockFactory(UserFixture).one() as User;
    jest.spyOn(userService, "getUserAsync").mockResolvedValue(null);

    await expect(userService.validateUserAsync(user)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it("should throw an UnauthorizedException if the password is invalid", async () => {
    const user = MockFactory(UserFixture).one() as User;
    const validateUser = MockFactory(UserFixture).one() as User;

    jest.spyOn(userService, "getUserAsync").mockResolvedValue(user);

    await expect(userService.validateUserAsync(validateUser)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it("should return a user if the email and password are valid", async () => {
    const user = MockFactory(UserFixture).one() as User;

    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    jest.spyOn(userService, "getUserAsync").mockResolvedValue(user);
    await expect(userService.validateUserAsync(user)).resolves.toEqual({
      ...user,
    });
  });
});
