import { LoginOtpEmailRequest } from "./login-otp-email-request.dto";
import { faker } from "@faker-js/faker";
import { validate } from "class-validator";

describe("LoginOtpEmailRequest Validation", () => {
  it("should successful verification be performed", async () => {
    const loginOtpEmailRequest = new LoginOtpEmailRequest();
    loginOtpEmailRequest.email = faker.internet.email();
    loginOtpEmailRequest.otpValue = faker.datatype.string(6);
    const errors = await validate(loginOtpEmailRequest);

    expect(errors.length).toBe(0);
  });

  it("should unsuccessful verification be performed", async () => {
    const loginOtpEmailRequest = new LoginOtpEmailRequest();
    loginOtpEmailRequest.email = faker.lorem.words(1);
    loginOtpEmailRequest.otpValue = faker.datatype.string(6);
    const errors = await validate(loginOtpEmailRequest);

    expect(errors.length).toBe(1);
  });
});
