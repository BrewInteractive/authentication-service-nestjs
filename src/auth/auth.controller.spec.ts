import { Test, TestingModule } from "@nestjs/testing";

import { AuthController } from "./auth.controller";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  it("should return user when login is successful", async () => {
    const loginDto = { username: "testuser", password: "testpass" };

    const result = controller.login(loginDto);
    expect(result).toBeDefined();
  });
  it("should return user has been registered successfully", () => {
    const result = controller.signUp();
    expect(result).toBeDefined();
  });
});
