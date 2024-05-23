export class OtpValue {
  static generate(length: number): string {
    return String(
      Array.from({ length }, () => Math.floor(Math.random() * 10)).join("")
    );
  }
}
