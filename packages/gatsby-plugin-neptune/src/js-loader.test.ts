import { neptuneToJs } from "./js-loader";
import hn from "./fixtures/Hn.json";
import basic from "./fixtures/Basic.json";

test("basic", () => {
  expect(neptuneToJs(basic))
    .toBe(`className={styles["HelloWorld-root"]} children={"Hello world"}
`);
});

test("basic", () => {
  expect(neptuneToJs(hn)).toBe(``);
});
