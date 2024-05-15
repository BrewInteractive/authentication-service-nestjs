import {
  ResetPasswordFixture,
  UserResetPasswordRequestFixture,
} from "../../test/fixtures";
import { User, UserResetPasswordRequest } from "../entities";

import { MockFactory } from "mockingbird";
import { Repository } from "typeorm";
import { ResetPasswordService } from "./reset-password.service";
import { Test } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { UserFixture } from "../../test/fixtures/user/user.fixture";
import { faker } from "@faker-js/faker";

const bcrypt = require("bcrypt");

describe("ResetPasswordService", () => {
  let resetPasswordService: ResetPasswordService;
  let userRepository: Repository<User>;
  let userResetPasswordRequestRepository: Repository<UserResetPasswordRequest>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResetPasswordService,

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
    resetPasswordService =
      moduleRef.get<ResetPasswordService>(ResetPasswordService);
    userRepository = moduleRef.get<Repository<User>>("UserRepository");
    userResetPasswordRequestRepository = moduleRef.get<
      Repository<UserResetPasswordRequest>
    >("UserResetPasswordRequestRepository");
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

    const actualResult =
      await resetPasswordService.getResetPasswordRequestAsync(
        expectedResult.key
      );

    expect(actualResult).toBe(expectedResult);
  });

  it("resetPasswordAsync should throw UnauthorizedException for invalid reset key", async () => {
    const resetPasswordRequest = MockFactory(ResetPasswordFixture).one();
    jest
      .spyOn(resetPasswordService, "getResetPasswordRequestAsync")
      .mockResolvedValue(null);
    const user = MockFactory(UserFixture)
      .mutate({
        email: resetPasswordRequest.email,
      })
      .one() as User;

    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(user));

    try {
      await resetPasswordService.resetPasswordAsync(resetPasswordRequest);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
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

    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(user));

    jest
      .spyOn(resetPasswordService, "getResetPasswordRequestAsync")
      .mockResolvedValue(userResetPasswordData);
    try {
      await resetPasswordService.resetPasswordAsync(resetPasswordRequest);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
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
      .spyOn(resetPasswordService, "getResetPasswordRequestAsync")
      .mockResolvedValue(userResetPasswordData);
    try {
      await resetPasswordService.resetPasswordAsync(resetPasswordRequest);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      expect(e.message).toBe("User not found");
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

    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(Promise.resolve(user));

    const userResetPasswordData = MockFactory(UserResetPasswordRequestFixture)
      .mutate({
        key: validKey,
        user: user,
        expiresAt: faker.date.future(1),
      })
      .one();

    jest
      .spyOn(resetPasswordService, "getResetPasswordRequestAsync")
      .mockResolvedValue(userResetPasswordData);

    await resetPasswordService.resetPasswordAsync(resetPasswordRequest);

    expect(userRepository.save).toHaveBeenCalled();
    expect(userResetPasswordRequestRepository.save).toHaveBeenCalled();
  });
});
