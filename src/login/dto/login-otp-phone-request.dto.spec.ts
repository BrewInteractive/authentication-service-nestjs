import { LoginOtpPhoneRequest } from "./login-otp-phone-request.dto";
import { PhoneRequestDto } from "./phone.dto";
import { faker } from "@faker-js/faker";
import { validate } from "class-validator";

describe("LoginOtpPhoneRequest Validation", () => {
  it("should be verified", async () => {
    const loginOtpPhoneRequest = new LoginOtpPhoneRequest();
    loginOtpPhoneRequest.phone = {
      countryCode: faker.string.numeric(3),
      phoneNumber: faker.phone.number(),
    } as PhoneRequestDto;
    loginOtpPhoneRequest.otpValue = faker.string.sample(6);
    const errors = await validate(loginOtpPhoneRequest);
    expect(errors.length).toBe(0);
  });

  it("should not be verified", async () => {
    const loginOtpPhoneRequest = new LoginOtpPhoneRequest();
    loginOtpPhoneRequest.otpValue = faker.string.numeric(3);
    const errors = await validate(loginOtpPhoneRequest);
    expect(errors.length).toBe(1);
  });
});
