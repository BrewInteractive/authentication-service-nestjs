import { ValidationErrorExtensions } from "./validation-error.extention";

describe("ValidationErrorExtensions", () => {
  it("should create an instance", () => {
    const validationErrorExtensions = new ValidationErrorExtensions();
    expect(validationErrorExtensions).toBeDefined();
  });

  it("should have message property", () => {
    const validationErrorExtensions = new ValidationErrorExtensions();
    expect(validationErrorExtensions.message).toBeUndefined();

    validationErrorExtensions.message = "Test message";
    expect(validationErrorExtensions.message).toBe("Test message");
  });

  it("should have fields property", () => {
    const validationErrorExtensions = new ValidationErrorExtensions();
    expect(validationErrorExtensions.fields).toBeUndefined();

    validationErrorExtensions.fields = ["field1", "field2"];
    expect(validationErrorExtensions.fields).toEqual(["field1", "field2"]);
  });
});
