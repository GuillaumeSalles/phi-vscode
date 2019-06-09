import * as T from "./types";

function px(x: number): T.Length {
  return {
    type: "px",
    value: x
  };
}

export const components: T.Component[] = [
  {
    name: "Header",
    layout: {
      id: "heading",
      type: "text",
      name: "heading",
      tag: "h1",
      text: "hey",
      backgroundColor: { type: "ref", id: "Red 200" },
      fontSize: { type: "ref", id: "T2" },
      fontFamily: { type: "ref", id: "default" },
      fontWeight: { type: "ref", id: "light" },
      lineHeight: { type: "ref", id: "normal" }
    }
  }
];

export const fontSizes: T.FontSizesMap = new Map(
  [12, 14, 16, 20, 24, 32, 40, 48].map((x, index) => [
    `T${index + 1}`,
    `${x}px`
  ])
);

export const fontFamilies: T.FontFamiliesMap = new Map([
  [
    "default",
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  ],
  [
    "mono",
    'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace'
  ]
]);

export const fontWeights = new Map(
  [
    { name: "light", value: 300 },
    { name: "normal", value: 400 },
    { name: "bold", value: 600 }
  ].map(x => [x.name, x])
);

export const lineHeights = new Map(
  [{ name: "condensed", value: 1.25 }, { name: "normal", value: 1.5 }].map(
    x => [x.name, x]
  )
);

export const colors: T.ColorsMap = new Map(
  [
    { name: "Red 50", value: "#ffebee" },
    { name: "Red 100", value: "#ffcdd2" },
    { name: "Red 200", value: "#ef9a9a" },
    { name: "Red 300", value: "#e57373" },
    { name: "Red 400", value: "#ef5350" },
    { name: "Red 500", value: "#f44336" },
    { name: "Red 600", value: "#e53935" },
    { name: "Red 700", value: "#d32f2f" },
    { name: "Red 800", value: "#c62828" },
    { name: "Red 900", value: "#b71c1c" },
    { name: "Red a100", value: "#ff8a80" },
    { name: "Red a200", value: "#ff5252" },
    { name: "Red a400", value: "#ff1744" },
    { name: "Red a700", value: "#d50000" }
  ].map(colorDef => [colorDef.name, colorDef])
);

export const breakpoints: T.BreakpointsMap = new Map([
  ["small", px(544)],
  ["medium", px(768)],
  ["large", px(1012)],
  ["xlarge", px(1280)]
]);

export const refs: T.Refs = {
  colors,
  fontSizes,
  fontFamilies,
  fontWeights,
  lineHeights
};
