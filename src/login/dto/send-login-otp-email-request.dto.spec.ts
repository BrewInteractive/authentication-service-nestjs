import { SendLoginOtpEmailRequest } from "./send-login-otp-email-request.dto";
import { faker } from "@faker-js/faker";
import { validate } from "class-validator";

describe("SendLoginOtpEmailRequest validation", () => {
  it("should fail validation when SendLoginOtpEmailRequest has empty email field", async () => {
      const request = new SendLoginOtpEmailRequest();
      const errors = await validate(request);

      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toEqual({
        isEmail: "email must be an email",
        isNotEmpty: "email should not be empty",
      });
  });

  it("should fail validation when email address is invalid", async () => {
      const request = new SendLoginOtpEmailRequest();
      request.email = faker.random.word();
      const errors = await validate(request);

      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toEqual({
        isEmail: "email must be an email",
      });
  });
});