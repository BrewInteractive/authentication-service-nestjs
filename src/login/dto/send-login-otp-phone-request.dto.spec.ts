import { PhoneRequestDto } from "./phone.dto";
import { SendLoginOtpPhoneRequest } from "./send-login-otp-phone-request.dto";
import { faker } from "@faker-js/faker";
import { validate } from "class-validator";

describe("SendLoginOtpPhoneRequest", () => {
  it("should create a valid instance", async () => {
    const request = new SendLoginOtpPhoneRequest();
    const phone = new PhoneRequestDto();
    phone.countryCode = faker.location.countryCode();
    phone.phoneNumber = faker.phone.number();
    request.phone = phone;

    const errors = await validate(request);
    expect(errors.length).toBe(0);
  });

  it("should return error if countryCode is empty", async () => {
    const request = new SendLoginOtpPhoneRequest();
    const phone = new PhoneRequestDto();
    phone.countryCode = "";
    phone.phoneNumber = faker.phone.number();
    request.phone = phone;

    const errors = await validate(request.phone);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("should return error if phoneNumber is empty", async () => {
    const request = new SendLoginOtpPhoneRequest();
    const phone = new PhoneRequestDto();
    phone.countryCode = faker.location.countryCode();
    phone.phoneNumber = "";
    request.phone = phone;

    const errors = await validate(request.phone);
    expect(errors.length).toBeGreaterThan(0);
  });
});
