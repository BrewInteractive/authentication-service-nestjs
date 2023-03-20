import { validate } from "class-validator";
import { LoginDto } from "./login.dto";
import { faker } from "@faker-js/faker";

describe("LoginDto Validation", () => {
  const passwordRegex = /[A-Za-z]/;

  it("should get email if username is empty", async () => {
    const user = new LoginDto();
    user.email = faker.internet.email();
    user.password = faker.internet.password(10, false, passwordRegex);
    const errors = await validate(user);

    expect(errors.length).toBe(0);
  });

  it("should get username if email is empty", async () => {
    const user = new LoginDto();
    user.password = faker.internet.password(10, false, passwordRegex);
    user.username = faker.internet.userName();
    const errors = await validate(user);

    expect(errors.length).toBe(0);
  });

  it("should fail validation when LoginDto has empty username and email fields", async () => {
    const user = new LoginDto();
    user.password = faker.internet.password(10, false, passwordRegex);
    const errors = await validate(user);

    expect(errors.length).toBe(2);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: "username should not be empty",
      isString: "username must be a string",
    });
  });

  it("should fail validation when LoginDto has empty password field", async () => {
    const user = new LoginDto();
    user.email = faker.internet.email();
    user.username = faker.internet.userName();
    const errors = await validate(user);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      matches: "password must match /(?=.*[A-Z])(?=.*[a-z]).*/ regular expression",
      isNotEmpty: "password should not be empty",
      isString: "password must be a string",
      maxLength: "password must be shorter than or equal to 20 characters",
      minLength: "password must be longer than or equal to 8 characters",
    });
  });

  it("should fail validation when LoginDto has a weak password", async () => {
    const user = new LoginDto();
    user.username = faker.internet.userName();
    user.password = faker.internet.password(10, false, /[A-Z]/);
    const errors = await validate(user);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      matches: "password must match /(?=.*[A-Z])(?=.*[a-z]).*/ regular expression",
    });
  });

  it("should fail validation when LoginDto has an invalid email address", async () => {
    const user = new LoginDto();
    user.email = faker.random.word();
    user.password = faker.internet.password(10, false, passwordRegex);
    const errors = await validate(user);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isEmail: "email must be an email",
    });
  });
});
