import { Test, TestingModule } from "@nestjs/testing";
import { ResetPasswordController } from "./reset-password.controller";
import { UserService } from "../user/user.service";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { ResetPasswordFixture } from "test/fixtures";
import { MockFactory } from "mockingbird";

describe("ResetPasswordController", () => {
  let resetPasswordController: ResetPasswordController;
  let userService: UserService;

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
            resetPasswordAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    resetPasswordController = module.get<ResetPasswordController>(
      ResetPasswordController
    );
    userService = module.get<UserService>("UserService");
  });

  it("should be defined", () => {
    expect(resetPasswordController).toBeDefined();
  });

  it("should call userService.resetPasswordAsync with the provided request", async () => {
    const resetPasswordRequestDto = MockFactory(ResetPasswordFixture).one();

    await resetPasswordController.resetPasswordAsync(resetPasswordRequestDto);

    expect(userService.resetPasswordAsync).toHaveBeenCalledWith(
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
