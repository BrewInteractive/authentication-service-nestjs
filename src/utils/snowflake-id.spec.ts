import { SnowflakeId } from "./snowflake-id";

describe("Snowflake ID Test", () => {
  it("should generate unique IDs", () => {
    const id1 = SnowflakeId.generate(BigInt(1));
    const id2 = SnowflakeId.generate(BigInt(2));
    expect(id1).not.toBe(id2);
  });

  it("The specified sample should use the ID.", () => {
    const instance = BigInt(7);
    const id = SnowflakeId.generate(BigInt(0), instance);
    expect(((id >> BigInt(10)) & BigInt("0xFFF")).toString()).toBe(
      instance.toString()
    );
  });

  it("The function should generate IDs with the specified epoch.", () => {
    const epoch = BigInt(1609459200000);
    const id = SnowflakeId.generate(BigInt(0), BigInt(0), epoch);
    const timestamp = Number((id >> BigInt(23)) + epoch);

    expect(timestamp).toBeGreaterThan(epoch - BigInt(1));
    expect(timestamp).toBeLessThanOrEqual(Date.now());
  });
});
