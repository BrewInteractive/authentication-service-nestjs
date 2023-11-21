import { SignUpResponse } from "./sign-up-response.dto";

describe("SignUpResponse", () => {
  it("should create a LoginResponse object with optional properties", () => {
    const loginResponse = new SignUpResponse();

    expect(loginResponse).toBeDefined();
    expect(loginResponse).toBeInstanceOf(SignUpResponse);
  });
});
