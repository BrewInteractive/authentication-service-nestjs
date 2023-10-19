import { randomBytes } from "crypto";

export class Random {
  static generateString(length: number): string {
    const key = randomBytes(length / 2);
    return key.toString('hex');
  }
}