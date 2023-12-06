import { SignUpResponse } from "./sign-up-response.dto";

describe("SignUpResponse", () => {
  it("should create a SignUpResponse object with optional properties", () => {
    const signUpResponse = new SignUpResponse();
    expect(signUpResponse).toBeDefined();
    expect(signUpResponse).toBeInstanceOf(SignUpResponse);
  });
});
