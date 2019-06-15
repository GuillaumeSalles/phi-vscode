import { neptuneToJs } from "./js-loader";

test("basic", () => {
  expect(
    neptuneToJs({
      components: [{ name: "HelloWorld", layout: { text: "Hey", tag: "h1" } }]
    })
  ).toBe(`export function HelloWorld() { return <h1 children={"Hey"}></h1>; }
`);
});
