import { LoginResponse } from "./login-response.dto";

describe("LoginResponse", () => {
  it("should create a LoginResponse object with optional properties", () => {
    const loginResponse = new LoginResponse();

    expect(loginResponse).toBeDefined();
    expect(loginResponse).toBeInstanceOf(LoginResponse);
  });
});
