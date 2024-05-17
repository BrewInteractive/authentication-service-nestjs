import { ResetPasswordRequest } from "./reset-password-request.dto";
import { faker } from "@faker-js/faker";
import { validate } from "class-validator";

describe("ResetPasswordRequest Dto Validation", () => {
  const passwordRegex = /[A-Za-z]/;
  process.env.PASSWORD_REGEX = passwordRegex.source;

  it("should pass validation with valid data", async () => {
    const resetPasswordRequest = new ResetPasswordRequest();
    resetPasswordRequest.email = faker.internet.email();
    resetPasswordRequest.newPassword = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: passwordRegex,
    });
    resetPasswordRequest.key = faker.string.sample(16);

    const errors = await validate(resetPasswordRequest);

    expect(errors.length).toBe(0);
  });

  it("should fail validation when userId is empty", async () => {
    const resetPasswordRequest = new ResetPasswordRequest();
    resetPasswordRequest.newPassword = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: passwordRegex,
    });
    resetPasswordRequest.key = faker.string.sample(16);

    const errors = await validate(resetPasswordRequest);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: "email should not be empty",
      isString: "email must be a string",
    });
  });

  it("should fail validation when newPassword is weak", async () => {
    const resetPasswordRequest = new ResetPasswordRequest();
    resetPasswordRequest.email = faker.internet.email();
    resetPasswordRequest.newPassword = faker.internet.password({
      length: 6,
      memorable: false,
      pattern: /[A-Z]/,
    });
    resetPasswordRequest.key = faker.string.sample(16);

    const errors = await validate(resetPasswordRequest);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      matches: `password is too weak`,
    });
  });

  it("should fail validation when key is empty", async () => {
    const resetPasswordRequest = new ResetPasswordRequest();
    resetPasswordRequest.email = faker.internet.email();
    resetPasswordRequest.newPassword = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: passwordRegex,
    });

    const errors = await validate(resetPasswordRequest);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: "key should not be empty",
      isString: "key must be a string",
    });
  });
});
