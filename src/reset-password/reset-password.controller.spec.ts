import { Test, TestingModule } from "@nestjs/testing";

import { AutomapperModule } from "@automapper/nestjs";
import { MockFactory } from "mockingbird";
import { OkResponse } from "../dto";
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordFixture } from "../../test/fixtures";
import { ResetPasswordService } from "./reset-password.service";
import { classes } from "@automapper/classes";

describe("ResetPasswordController", () => {
  let resetPasswordController: ResetPasswordController;
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
    resetPasswordService = module.get<ResetPasswordService>(
      "ResetPasswordService"
    );
  });

  it("should be defined", () => {
    expect(resetPasswordController).toBeDefined();
  });

  it("should return OkResponse when resetPasswordAsync is called", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    const expectedResult = new OkResponse();

    const actualResult = await resetPasswordController.resetPasswordAsync(
      resetPasswordRequestDto
    );

    expect(resetPasswordService.resetPasswordAsync).toHaveBeenCalledWith(
      resetPasswordRequestDto
    );
    expect(actualResult).toStrictEqual(expectedResult);
  });
});
