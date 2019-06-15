import { neptuneToCss } from "./css-loader";
import basic from "./fixtures/Basic.json";

test("basic", () => {
  expect(neptuneToCss(basic)).toBe("");
});
