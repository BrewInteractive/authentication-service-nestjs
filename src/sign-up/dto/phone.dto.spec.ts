import { PhoneRequestDto } from "./phone.dto";
import { faker } from "@faker-js/faker";
import { validate } from "class-validator";

describe("Phone Validation", () => {
  it("should be verified", async () => {
    const phoneDto = new PhoneRequestDto();
    phoneDto.countryCode = faker.string.numeric(3);
    phoneDto.number = faker.phone.number();
    const errors = await validate(phoneDto);
    expect(errors.length).toBe(0);
  });

  it("should not be verified", async () => {
    const phoneDto = new PhoneRequestDto();
    phoneDto.countryCode = faker.string.numeric(3);
    const errors = await validate(phoneDto);
    expect(errors.length).toBe(1);
  });
});
