import { ResetPasswordRequest } from "./reset-password-request.dto";
import { validate } from "class-validator";
import { faker } from "@faker-js/faker";

describe("ResetPasswordRequest Dto Validation", () => {
  const passwordRegex = /[A-Za-z]/;

  it("should pass validation with valid data", async () => {
    const resetPasswordRequest = new ResetPasswordRequest();
    resetPasswordRequest.userId = faker.datatype.number();
    resetPasswordRequest.newPassword = faker.internet.password(10, false, passwordRegex);
    resetPasswordRequest.key = faker.datatype.string(16);

    const errors = await validate(resetPasswordRequest);

    expect(errors.length).toBe(0);
  });

  it("should fail validation when userId is empty", async () => {
    const resetPasswordRequest = new ResetPasswordRequest();
    resetPasswordRequest.newPassword = faker.internet.password(10, false, passwordRegex);
    resetPasswordRequest.key = faker.datatype.string(16);

    const errors = await validate(resetPasswordRequest);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: "userId should not be empty",
      isNumber: "userId must be a number conforming to the specified constraints",
    });
  });

  it("should fail validation when newPassword is weak", async () => {
    const resetPasswordRequest = new ResetPasswordRequest();
    resetPasswordRequest.userId = faker.datatype.number();
    resetPasswordRequest.newPassword = faker.internet.password(6, false, /[A-Z]/);
    resetPasswordRequest.key = faker.datatype.string(16);

    const errors = await validate(resetPasswordRequest);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      matches: `newPassword must match /(?=.*[A-Z])(?=.*[a-z]).*/ regular expression`,
      minLength: "newPassword must be longer than or equal to 8 characters",
    });
  });

  it("should fail validation when key is empty", async () => {
    const resetPasswordRequest = new ResetPasswordRequest();
    resetPasswordRequest.userId = faker.datatype.number();
    resetPasswordRequest.newPassword = faker.internet.password(10, false, passwordRegex);
    
    const errors = await validate(resetPasswordRequest);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: "key should not be empty",
      isString: "key must be a string",
    });
  });
});
