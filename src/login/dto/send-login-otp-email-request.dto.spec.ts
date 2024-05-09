import { SendLoginOtpEmailRequest } from "./send-login-otp-email-request.dto";
import { faker } from "@faker-js/faker";
import { validate } from "class-validator";

describe("LoginDto Validation", () => {
  it("should fail validation when LoginDto has empty username and email fields", async () => {
      const user = new SendLoginOtpEmailRequest();
      const errors = await validate(user);

      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toEqual({
        isEmail: "email must be an email",
        isNotEmpty: "email should not be empty",
      });
  });

  it("should fail validation when email address is invalid", async () => {
      const user = new SendLoginOtpEmailRequest();
      user.email = faker.random.word();
      const errors = await validate(user);

      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toEqual({
        isEmail: "email must be an email",
      });
  });
});