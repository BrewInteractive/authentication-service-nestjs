import { Random } from "./random";

describe("Random Test", () => {
  it("should generate unique key", () => {
    const key1 = Random.generate(16);
    const key2 = Random.generate(16);
    expect(key1).not.toBe(key2);
  });
  it("should a key equal to the given length will be generated", () => {
    const key = Random.generate(16);

    expect(key.length).toEqual(16);
  });
});
