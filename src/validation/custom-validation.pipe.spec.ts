import { CustomValidationPipe } from "./custom-validation.pipe";
import { BadRequestException, ValidationError } from "@nestjs/common";

describe("CustomValidationPipe", () => {
  let customValidationPipe: CustomValidationPipe;

  beforeEach(() => {
    customValidationPipe = new CustomValidationPipe();
  });

  it("should create an instance", () => {
    expect(customValidationPipe).toBeDefined();
  });

  it("should create exception factory", () => {
    const exceptionFactory = customValidationPipe.createExceptionFactory();

    const validationErrors: ValidationError[] = [
      {
        property: "field1",
        constraints: { isNotEmpty: "Field1 should not be empty" },
      },
      {
        property: "field2",
        constraints: { maxLength: "Field2 should be at most 10 characters" },
      },
    ];

    const result = exceptionFactory(validationErrors);

    expect(result).toBeInstanceOf(BadRequestException);
    expect(result["cause"]).toEqual({
      extensions: {
        fields: [
          "field1 Field1 should not be empty",
          "field2 Field2 should be at most 10 characters",
        ],
      },
      message: "validation failed",
    });
  });
});
