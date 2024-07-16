import { SendSignUpOtpEmailResponse } from "./send-sign-up-otp-email-response.dto";

describe("SendSignUpOtpEmailResponse", () => {
  it("should create a SendSignUpOtpEmailResponse object with optional properties", () => {
    const response = new SendSignUpOtpEmailResponse();

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(SendSignUpOtpEmailResponse);
  });
});
