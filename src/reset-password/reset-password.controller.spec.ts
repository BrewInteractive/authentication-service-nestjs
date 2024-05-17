import { ResetPasswordFixture, UserFixture } from "../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AutomapperModule } from "@automapper/nestjs";
import { BadRequestException } from "@nestjs/common";
import { InvalidResetPasswordRequestError } from "../error";
import { MockFactory } from "mockingbird";
import { OkResponse } from "../dto";
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordService } from "./reset-password.service";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";

describe("ResetPasswordController", () => {
  let resetPasswordController: ResetPasswordController;
  let userService: UserService;
  let resetPasswordService: ResetPasswordService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      controllers: [ResetPasswordController],
      providers: [
        {
          provide: "UserService",
          useValue: {
            getUserAsync: jest.fn(),
            updateUserPasswordAsync: jest.fn(),
          },
        },
        {
          provide: "ResetPasswordService",
          useValue: {
            resetPasswordAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    resetPasswordController = module.get<ResetPasswordController>(
      ResetPasswordController
    );
    userService = module.get<UserService>("UserService");
    resetPasswordService = module.get<ResetPasswordService>(
      "ResetPasswordService"
    );
  });

  it("should be defined", () => {
    expect(resetPasswordController).toBeDefined();
  });

  it("should return OkResponse when resetPasswordAsync is called", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();
    const user = MockFactory(UserFixture).one();

    const expectedResult = new OkResponse();

    jest
      .spyOn(userService, "getUserAsync")
      .mockResolvedValueOnce(Promise.resolve(user));

    const actualResult = await resetPasswordController.resetPasswordAsync(
      resetPasswordRequestDto
    );

    expect(resetPasswordService.resetPasswordAsync).toHaveBeenCalledWith(
      user,
      resetPasswordRequestDto.newPassword,
      resetPasswordRequestDto.key
    );
    expect(actualResult).toStrictEqual(expectedResult);
  });

  it("should throw InvalidResetPasswordRequestError if user is not found", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);

    await expect(
      resetPasswordController.resetPasswordAsync(resetPasswordRequestDto)
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException if InvalidResetPasswordRequestError is caught", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    jest.spyOn(userService, "getUserAsync").mockImplementationOnce(() => {
      throw new InvalidResetPasswordRequestError();
    });

    await expect(
      resetPasswordController.resetPasswordAsync(resetPasswordRequestDto)
    ).rejects.toThrow(BadRequestException);
  });
});
