import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import {
  ResetPasswordFixture,
  UserFixture,
  UserResetPasswordRequestFixture,
} from "../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";
import { User, UserResetPasswordRequest } from "../entities";

import { AutomapperModule } from "@automapper/nestjs";
import { BadRequestException } from "@nestjs/common";
import { ForgotPasswordController } from "./forgot-password.controller";
import { MockFactory } from "mockingbird";
import { OkResponse } from "../dto";
import { ResetPasswordService } from "./reset-password.service";
import { UserService } from "../user/user.service";
import { authenticationConfig } from "../config";
import { classes } from "@automapper/classes";

describe("ForgotPasswordController", () => {
  let forgotPasswordController: ForgotPasswordController;
  let userService: UserService;
  let resetPasswordService: ResetPasswordService;
  let eventEmitter: EventEmitter2;

  const emitMock = jest.fn();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        EventEmitterModule.forRoot(),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [authenticationConfig],
        }),
      ],
      controllers: [ForgotPasswordController],
      providers: [
        {
          provide: "UserService",
          useValue: {
            getUserAsync: jest.fn(),
            updateUserPasswordAsync: jest.fn(),
          },
        },
        {
          provide: "EventEmitter2",
          useValue: { emit: emitMock },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case "resetPassword.url":
                  return "reset-password-url/";
                default:
                  return undefined;
              }
            }),
          },
        },
        {
          provide: "ResetPasswordService",
          useValue: {
            resetPasswordAsync: jest.fn(),
            createResetPasswordRequest: jest.fn(),
          },
        },
      ],
    }).compile();

    forgotPasswordController = module.get<ForgotPasswordController>(
      ForgotPasswordController
    );
    userService = module.get<UserService>("UserService");
    resetPasswordService = module.get<ResetPasswordService>(
      "ResetPasswordService"
    );
    eventEmitter = module.get<EventEmitter2>("EventEmitter2");
  });

  it("should be defined", () => {
    expect(forgotPasswordController).toBeDefined();
  });

  it("should return OkResponse when forgotPasswordAsync is called", async () => {
    const user: User = MockFactory(UserFixture).one();
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture)
      .mutate({
        email: user.email,
      })
      .one();
    const userResetPasswordRequest: UserResetPasswordRequest = MockFactory(
      UserResetPasswordRequestFixture
    )
      .mutate({
        email: user.email,
        key: resetPasswordRequestDto.key,
      })
      .one();

    jest
      .spyOn(userService, "getUserAsync")
      .mockResolvedValueOnce(Promise.resolve(user));

    jest
      .spyOn(resetPasswordService, "createResetPasswordRequest")
      .mockResolvedValueOnce(Promise.resolve(userResetPasswordRequest));

    (eventEmitter.emit as jest.Mock).mockImplementation();

    const expectedResult = new OkResponse();

    const actualResult = await forgotPasswordController.forgotPasswordAsync(
      resetPasswordRequestDto
    );

    expect(actualResult).toStrictEqual(expectedResult);
  });

  it("should throw BadRequestException if InvalidResetPasswordRequestError is caught due null user", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);

    await expect(
      forgotPasswordController.forgotPasswordAsync(resetPasswordRequestDto)
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException if InvalidResetPasswordRequestError is caught due null resetPasswordRequest", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();
    const user = MockFactory(UserFixture).one();

    jest
      .spyOn(userService, "getUserAsync")
      .mockResolvedValueOnce(Promise.resolve(user));
    jest
      .spyOn(resetPasswordService, "createResetPasswordRequest")
      .mockResolvedValue(null);

    await expect(
      forgotPasswordController.forgotPasswordAsync(resetPasswordRequestDto)
    ).rejects.toThrow(BadRequestException);
  });
});
