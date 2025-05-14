import { CreateResetPasswordRequest } from "./create-reset-password-request.dto";
import { faker } from "@faker-js/faker";
import { validate } from "class-validator";

describe("CreateResetPasswordRequest Dto Validation", () => {
  it("should fail validation when email is null", async () => {
    const resetPasswordRequest = new CreateResetPasswordRequest();

    const errors = await validate(resetPasswordRequest);

    expect(errors.length).toBe(1);

    expect(errors[0].constraints).toEqual({
      isEmail: "email must be an email",
      isNotEmpty: "email should not be empty",
      isString: "email must be a string",
    });
  });

  it("should fail validation when email is valid", async () => {
    const resetPasswordRequest = new CreateResetPasswordRequest();
    resetPasswordRequest.email = faker.internet.email();

    const errors = await validate(resetPasswordRequest);

    expect(errors.length).toBe(0);
  });
});
