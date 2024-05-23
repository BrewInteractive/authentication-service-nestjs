import { faker } from "@faker-js/faker/locale/af_ZA";
import { validate } from "class-validator";
import { SendLoginOtpPhoneRequest } from "./send-login-otp-phone-request.dto";

describe("SendLoginOtpPhoneRequest", () => {
  it("should create a valid instance", async () => {
    const request = new SendLoginOtpPhoneRequest();
    request.countryCode = faker.address.countryCode();
    request.phoneNumber = faker.phone.number();

    const errors = await validate(request);
    expect(errors.length).toBe(0);
  });

  it("should return error if countryCode is empty", async () => {
    const request = new SendLoginOtpPhoneRequest();
    request.countryCode = "";
    request.phoneNumber = faker.phone.number();

    const errors = await validate(request);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("should return error if phoneNumber is empty", async () => {
    const request = new SendLoginOtpPhoneRequest();
    request.countryCode = faker.address.countryCode();
    request.phoneNumber = "";

    const errors = await validate(request);
    expect(errors.length).toBeGreaterThan(0);
  });
});
