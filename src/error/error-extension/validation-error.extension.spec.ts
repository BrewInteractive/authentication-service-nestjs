import { ValidationErrorExtensions } from "./validation-error.extension";

describe("ValidationErrorExtensions", () => {
  it("should create an instance", () => {
    const validationErrorExtensions = new ValidationErrorExtensions();
    expect(validationErrorExtensions).toBeDefined();
  });

  it("should have fields property", () => {
    const validationErrorExtensions = new ValidationErrorExtensions();
    expect(validationErrorExtensions.fields).toBeUndefined();

    validationErrorExtensions.fields = ["field1", "field2"];
    expect(validationErrorExtensions.fields).toEqual(["field1", "field2"]);
  });
});
