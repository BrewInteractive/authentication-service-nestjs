export class Snowflake {
  static generate(
    sequence: number,
    timestamp: number = 1577836800000,
    instance: number = 1
  ): number {
    return Number(
      ((BigInt(Date.now()) - BigInt(timestamp)) << BigInt(23)) |
        (BigInt(instance) << BigInt(10)) |
        BigInt(sequence)
    );
  }
}
