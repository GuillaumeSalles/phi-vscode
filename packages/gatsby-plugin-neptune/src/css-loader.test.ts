import { neptuneToJs } from "./js-loader";
import basic from "./fixtures/Basic.json";

test("basic", () => {
  expect(neptuneToJs(basic))
    .toBe(`export function HelloWorld() { return <h1 children={"Hey"}></h1>; }
`);
});
