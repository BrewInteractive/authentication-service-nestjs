export class SnowflakeId {
  static generate(
    sequence: bigint,
    instance: bigint = BigInt(1),
    epoch: bigint = BigInt(1577836800000)
  ): bigint {
    return (
      ((BigInt(Date.now()) - epoch) << BigInt(23)) |
      (instance << BigInt(10)) |
      sequence
    );
  }
}
