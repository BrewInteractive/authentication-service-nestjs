import { Test } from "@nestjs/testing";
import { UserService } from "./user.service";
import { User } from "../models/user.entity";
import { ConflictException } from "@nestjs/common";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

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
    const user = new User();
    const username = faker.internet.userName();
    const email = faker.internet.email();
    user.username = username;
    user.email = email;

    jest.spyOn(userService, "getUser").mockResolvedValue(user);

    expect(await userService.getUser(username, email)).toBe(
      user
    );
  });
  it("should return a user if the email exists", async () => {
    const email = faker.internet.email();
    const username = faker.internet.userName();
    const user = { id: "1", email };
    userRepository.findOne = jest.fn().mockResolvedValue(user);

    await expect(userService.getUser(username, email)).resolves.toEqual(user);
  });

  it("should return null if the email does not exist", async () => {
    const email = faker.internet.email();
    const username = faker.internet.userName();
    userRepository.findOne = jest.fn().mockResolvedValue(null);

    await expect(userService.getUser(username, email)).resolves.toBeNull();
  });

  it("should throw a ConflictException if the username or email already exists", async () => {
    const signUpDto = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    userRepository.findOne = jest.fn().mockResolvedValue(signUpDto);

    await expect(userService.createUser(signUpDto)).rejects.toThrow(
      ConflictException
    );
  });

  it("should create a new user if the username and email do not exist", async () => {
    const signUpDto = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    userRepository.findOne = jest.fn().mockResolvedValue(null);
    bcrypt.genSalt = jest.fn().mockResolvedValue("salt");
    bcrypt.hash = jest.fn().mockResolvedValue("passwordHash");
    userRepository.save = jest.fn().mockResolvedValue({ id: "1" });

    await expect(userService.createUser(signUpDto)).resolves.toEqual({
      id: "1",
    });
  });
});
