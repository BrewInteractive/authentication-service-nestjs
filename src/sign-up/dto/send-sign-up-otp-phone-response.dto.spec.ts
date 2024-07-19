import { SendSignUpOtpPhoneResponse } from "./send-sign-up-otp-phone-response.dto";

describe("SendSignUpOtpPhoneResponse", () => {
  it("should create a valid instance", () => {
    const response = new SendSignUpOtpPhoneResponse();
    response.isSent = true;
    response.expiresAt = new Date();

    expect(response.isSent).toBeTruthy();
    expect(response.expiresAt).toBeInstanceOf(Date);
  });

  it("should have properties with correct types", () => {
    const response = new SendSignUpOtpPhoneResponse();
    response.isSent = true;
    response.expiresAt = new Date();

    expect(typeof response.isSent).toBe("boolean");
    expect(response.expiresAt).toBeInstanceOf(Date);
  });
});
