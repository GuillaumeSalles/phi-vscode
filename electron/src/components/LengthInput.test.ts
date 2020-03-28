import { parseLength } from "./LengthInput";

describe("LengthInput", () => {
  test("parseLength", () => {
    expect(parseLength(undefined)).toBe(undefined);
    expect(parseLength("20px")).toEqual({ value: 20, unit: "px" });
    expect(parseLength("20.5px")).toEqual({ value: 20.5, unit: "px" });
    expect(parseLength("30")).toEqual({ value: 30, unit: undefined });
    expect(parseLength("99%")).toEqual({ value: 99, unit: "%" });
    expect(parseLength("x")).toEqual(undefined);
  });
});
