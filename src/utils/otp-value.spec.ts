import { OtpValue } from "./otp-value";

describe("OtpValue", () => {
  describe("generate", () => {
    it("should generate an OTP of the specified length", () => {
      const length = 6;
      const otp = OtpValue.generate(length);
      expect(otp).toBeDefined();
      expect(otp.toString().length).toBe(length);
    });

    it("should generate a numeric OTP", () => {
      const length = 6;
      const otp = OtpValue.generate(length);
      expect(typeof otp).toBe("string");
      expect(/^\d+$/.test(otp.toString())).toBe(true);
    });

    it("should generate different OTPs on subsequent calls", () => {
      const length = 6;
      const otp1 = OtpValue.generate(length);
      const otp2 = OtpValue.generate(length);
      expect(otp1).not.toBe(otp2);
    });
  });
});
