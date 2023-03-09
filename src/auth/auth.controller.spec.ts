import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";

describe("AuthController", () => {
  let controller: AuthController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [UserService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  it("should return user when login is successful", async () => {
    const userCredentials = { username: "testuser", password: "testpass" };
    const user = { id: 1, userName: "testuser" };

    expect(userService).toBeDefined();

    jest
      .spyOn(userService, "validateUser")
      .mockImplementation(async () => user);

    const result = await controller.login(userCredentials);

    expect(result).toBe(user);
  });
  it("should return user has been registered successfully", () => {
    const result = controller.signUp();
    expect(result).toBeDefined();
  });
});
