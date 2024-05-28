import { SignUpRequest } from "./sign-up-request.dto";
import { faker } from "@faker-js/faker";
import { validate } from "class-validator";

describe("Signup Dto Validation", () => {
  const passwordRegex = /[A-Za-z]/;
  process.env.PASSWORD_REGEX = passwordRegex.source;

  it("should get email if username is empty", async () => {
    const user = new SignUpRequest();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: passwordRegex,
    });
    const errors = await validate(user);

    expect(errors.length).toBe(0);
  });

  it("should get username if email is empty", async () => {
    const user = new SignUpRequest();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.password = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: passwordRegex,
    });
    user.username = faker.internet.userName();
    const errors = await validate(user);

    expect(errors.length).toBe(0);
    expect(errors).toEqual([]);
  });

  it("should fail validation when SignUpDto has empty password field", async () => {
    const user = new SignUpRequest();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.username = faker.internet.userName();
    const errors = await validate(user);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: "password should not be empty",
      isString: "password must be a string",
      matches: "password is too weak",
    });
  });

  it("should fail validation when SignUpDto has a weak password", async () => {
    const user = new SignUpRequest();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.username = faker.internet.userName();
    user.password = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: /[A-Z]/,
    });
    const errors = await validate(user);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      matches: "password is too weak",
    });
  });

  it("should fail validation when SignUpDto has an invalid email address", async () => {
    const user = new SignUpRequest();
    user.email = faker.word.sample();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
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

  it("should fail validation when SignUpDto has empty firstName field", async () => {
    const user = new SignUpRequest();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.username = faker.internet.userName();
    user.password = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: passwordRegex,
    });
    const errors = await validate(user);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: "firstName should not be empty",
      isString: "firstName must be a string",
    });
  });

  it("should fail validation when SignUpDto has empty lastName field", async () => {
    const user = new SignUpRequest();
    user.firstName = faker.person.firstName();
    user.email = faker.internet.email();
    user.password = faker.internet.password({
      length: 10,
      memorable: false,
      pattern: passwordRegex,
    });
    user.username = faker.internet.userName();
    const errors = await validate(user);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: "lastName should not be empty",
      isString: "lastName must be a string",
    });
  });
});
