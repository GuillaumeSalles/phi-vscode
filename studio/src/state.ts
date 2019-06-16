import * as T from "./types";

export const fontWeights = new Map(
  [
    { name: "light", value: 300 },
    { name: "normal", value: 400 },
    { name: "bold", value: 700 }
  ].map(x => [x.name, x])
);

export const lineHeights = new Map(
  [{ name: "condensed", value: 1.25 }, { name: "normal", value: 1.5 }].map(
    x => [x.name, x]
  )
);
