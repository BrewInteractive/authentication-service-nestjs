import { BadRequestException, ValidationError } from "@nestjs/common";

import { CustomValidationPipe } from "./custom-validation.pipe";

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
        constraints: {
          isNotEmpty: "Field1 should not be empty",
          maxLength: "Field1 should be at least 5 characters",
        },
      },
      {
        property: "field2",
        constraints: {
          isNotEmpty: "Field2 should not be empty",
          maxLength: "Field2 should be at most 10 characters",
        },
      },
    ];

    const result = exceptionFactory(validationErrors);

    expect(result).toBeInstanceOf(BadRequestException);
    expect(result["cause"]).toEqual({
      extensions: {
        code: "ERR009",
        fields: [
          "field1: Field1 should not be empty, Field1 should be at least 5 characters",
          "field2: Field2 should not be empty, Field2 should be at most 10 characters",
        ],
      },
      message: "Validation failed",
    });
  });
});
