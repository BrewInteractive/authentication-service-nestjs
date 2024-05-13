import { SendLoginOtpEmailResponse } from "./send-login-otp-email-response.dto";

describe("SendLoginOtpEmailResponse", () => {
  it("should create a SendLoginOtpEmailResponse object with optional properties", () => {
    const response = new SendLoginOtpEmailResponse();

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(SendLoginOtpEmailResponse);
  });
});
