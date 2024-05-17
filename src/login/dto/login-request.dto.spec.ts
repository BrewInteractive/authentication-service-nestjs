import { LoginRequest } from "./login-request.dto";
import { faker } from "@faker-js/faker";
import { validate } from "class-validator";

describe("LoginDto Validation", () => {
  const passwordRegex = /[A-Za-z]/;

  it("should success validation if username is empty but not email", async () => {
    const user = new LoginRequest();
    user.email = faker.internet.email();
    user.password = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: passwordRegex,
    });
    const errors = await validate(user);

    expect(errors.length).toBe(0);
  });

  it("should success validation if email is empty but not username", async () => {
    const user = new LoginRequest();
    user.password = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: passwordRegex,
    });
    user.username = faker.internet.userName();
    const errors = await validate(user);

    expect(errors.length).toBe(0);
  });

  it("should fail validation when LoginDto has empty username and email fields", async () => {
    const user = new LoginRequest();
    user.password = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: passwordRegex,
    });
    const errors = await validate(user);

    expect(errors.length).toBe(2);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: "username should not be empty",
      isString: "username must be a string",
    });
  });

  it("should fail validation when password is empty", async () => {
    const user = new LoginRequest();
    user.email = faker.internet.email();
    user.username = faker.internet.userName();
    const errors = await validate(user);

    expect(errors.length).toBe(1);
  });

  it("should fail validation when email address is invalid", async () => {
    const user = new LoginRequest();
    user.email = faker.word.sample();
    user.password = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: passwordRegex,
    });
    const errors = await validate(user);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isEmail: "email must be an email",
    });
  });
});
