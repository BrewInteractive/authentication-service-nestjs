import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  describe("login", () => {
    it("should return user when login is successful", async () => {
      const loginDto = { username: "testuser", password: "testpass" };
      const user = { id: 1, username: "testuser" };

      jest
        .spyOn(authService, "validateUser")
        .mockImplementation(async () => user);

      const result = await controller.login(loginDto);

      expect(result).toBe(user);
    });
  });
  describe("signUp", () => {
    it('should return "User has been registered successfully"', () => {
      const result = controller.signUp();
      expect(result).toBeDefined();
    });
  });
});
