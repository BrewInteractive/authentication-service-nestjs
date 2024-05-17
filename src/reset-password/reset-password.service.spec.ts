import {
  ResetPasswordFixture,
  UserResetPasswordRequestFixture,
} from "../../test/fixtures";
import { User, UserResetPasswordRequest } from "../entities";

import { InvalidResetPasswordRequestError } from "../error";
import { MockFactory } from "mockingbird";
import { Repository } from "typeorm";
import { ResetPasswordService } from "./reset-password.service";
import { Test } from "@nestjs/testing";
import { UserFixture } from "../../test/fixtures/user/user.fixture";
import { UserService } from "../user/user.service";
import { faker } from "@faker-js/faker";

describe("ResetPasswordService", () => {
  let resetPasswordService: ResetPasswordService;
  let userService: UserService;
  let userResetPasswordRequestRepository: Repository<UserResetPasswordRequest>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: "UserService",
          useValue: {
            updateUserPasswordAsync: jest.fn(),
          },
        },
        ResetPasswordService,
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
    resetPasswordService =
      moduleRef.get<ResetPasswordService>(ResetPasswordService);
    userService = moduleRef.get<UserService>("UserService");
    userResetPasswordRequestRepository = moduleRef.get<
      Repository<UserResetPasswordRequest>
    >("UserResetPasswordRequestRepository");
  });

  it("getResetPasswordRequestAsync should return a userResetPasswordRequest", async () => {
    const expectedResult = MockFactory(UserResetPasswordRequestFixture)
      .mutate({
        expiresAt: faker.date.future({ years: 1 }),
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

  it("resetPasswordAsync should update user password and expire the request", async () => {
    const email = faker.internet.email();
    const validKey = faker.string.sample(16);

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
        user: user,
        expiresAt: faker.date.future({ years: 1 }),
      })
      .one();

    jest
      .spyOn(resetPasswordService, "getResetPasswordRequestAsync")
      .mockResolvedValue(userResetPasswordData);

    jest
      .spyOn(userService, "updateUserPasswordAsync")
      .mockResolvedValue(Promise.resolve());

    await resetPasswordService.resetPasswordAsync(
      user,
      resetPasswordRequest.newPassword,
      resetPasswordRequest.key
    );

    expect(userService.updateUserPasswordAsync).toHaveBeenCalled();
    expect(userResetPasswordRequestRepository.save).toHaveBeenCalled();
  });
  it("resetPasswordAsync should throw InvalidResetPasswordRequestError for invalid reset key", async () => {
    const resetPasswordRequest = MockFactory(ResetPasswordFixture).one();
    jest
      .spyOn(resetPasswordService, "getResetPasswordRequestAsync")
      .mockResolvedValue(null);
    const user = MockFactory(UserFixture)
      .mutate({
        email: resetPasswordRequest.email,
      })
      .one() as User;

    try {
      await resetPasswordService.resetPasswordAsync(
        user,
        resetPasswordRequest.newPassword,
        resetPasswordRequest.key
      );
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidResetPasswordRequestError);
      expect(e.message).toBe("Invalid reset password request.");
    }
  });

  it("resetPasswordAsync should throw InvalidResetPasswordRequestError for expired reset request", async () => {
    const validKey = faker.string.sample(16);
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
        expiresAt: faker.date.past({ years: 1 }),
      })
      .one();

    jest
      .spyOn(resetPasswordService, "getResetPasswordRequestAsync")
      .mockResolvedValue(userResetPasswordData);
    try {
      await resetPasswordService.resetPasswordAsync(
        user,
        resetPasswordRequest.newPassword,
        resetPasswordRequest.key
      );
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidResetPasswordRequestError);
      expect(e.message).toBe("Invalid reset password request.");
    }
  });
});
