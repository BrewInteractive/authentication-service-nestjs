import { randomInt } from "crypto";

export class OtpValue {
  static generate(length: number): string {
    return Array.from({ length }, () => randomInt(0, 10)).join("");
  }
}
