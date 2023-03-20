import { Test, TestingModule } from "@nestjs/testing";

import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { TokenModule } from "../token/token.module";

describe("AuthController", () => {
  let controller: AuthController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TokenModule],
      providers: [{ provide: "UserService", useClass: UserService }],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>('UserService');
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  it("should return user when login is successful", async () => {
    const loginDto = { username: "testuser", password: "testpass" };
    const user = { id: 1, userName: "testuser" };

    expect(userService).toBeDefined();

    jest
      .spyOn(userService, "validateUser")
      .mockImplementation(async () => user);

    const result = controller.login(loginDto);
    expect(result).toBeDefined();
  });
  it("should return user has been registered successfully", () => {
    const result = controller.signUp();
    expect(result).toBeDefined();
  });
});
