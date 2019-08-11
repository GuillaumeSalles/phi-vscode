import { neptuneToJs } from "./js-loader";
import twitter from "./fixtures/Twitter.json";
import basic from "./fixtures/Basic.json";
import prettier from "prettier";

test("basic", () => {
  expect(prettier.format(neptuneToJs(twitter))).toBe(``);
});
