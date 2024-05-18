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
import { InvalidResetPasswordRequestError } from "../error";
import { MockFactory } from "mockingbird";
import { OkResponse } from "../dto";
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordCreatedEvent } from "../notification/dto";
import { ResetPasswordService } from "./reset-password.service";
import { UserService } from "../user/user.service";
import { authenticationConfig } from "../config";
import { classes } from "@automapper/classes";

describe("ResetPasswordController", () => {
  let resetPasswordController: ResetPasswordController;
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

    resetPasswordController = module.get<ResetPasswordController>(
      ResetPasswordController
    );
    userService = module.get<UserService>("UserService");
    resetPasswordService = module.get<ResetPasswordService>(
      "ResetPasswordService"
    );
    eventEmitter = module.get<EventEmitter2>("EventEmitter2");
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

  it("should throw BadRequestException if InvalidResetPasswordRequestError is caught due null user", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);

    await expect(
      resetPasswordController.resetPasswordAsync(resetPasswordRequestDto)
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException if InvalidResetPasswordRequestError is caught due null resetPasswordRequest", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    jest
      .spyOn(resetPasswordService, "resetPasswordAsync")
      .mockImplementationOnce(() => {
        throw new InvalidResetPasswordRequestError();
      });

    await expect(
      resetPasswordController.resetPasswordAsync(resetPasswordRequestDto)
    ).rejects.toThrow(BadRequestException);
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

    const actualResult = await resetPasswordController.forgotPasswordAsync(
      resetPasswordRequestDto
    );

    const resetPasswordCreatedEvent: ResetPasswordCreatedEvent = {
      emailAddress: user.email,
      resetLink: "reset-password-url/" + userResetPasswordRequest.key,
    };

    expect(actualResult).toStrictEqual(expectedResult);
  });

  it("should throw BadRequestException if InvalidResetPasswordRequestError is caught due null user", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);

    await expect(
      resetPasswordController.forgotPasswordAsync(resetPasswordRequestDto)
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
      resetPasswordController.forgotPasswordAsync(resetPasswordRequestDto)
    ).rejects.toThrow(BadRequestException);
  });
});
