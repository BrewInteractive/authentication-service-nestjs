import { ResetPasswordFixture, UserFixture } from "../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AutomapperModule } from "@automapper/nestjs";
import { MockFactory } from "mockingbird";
import { ResetPasswordController } from "./reset-password.controller";
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

  it("should call resetPasswordService.resetPasswordAsync with the provided request", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    await resetPasswordController.resetPasswordAsync(resetPasswordRequestDto);

    expect(resetPasswordService.resetPasswordAsync).toHaveBeenCalledWith(
      resetPasswordRequestDto
    );
  });

  it('should return "OK" when resetPasswordAsync is called', async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    const result = await resetPasswordController.resetPasswordAsync(
      resetPasswordRequestDto
    );

    expect(result).toBe("OK");
  });
});
