import * as T from "./types";
import uuid from "uuid/v4";

function px(x: number): T.Length {
  return {
    type: "px",
    value: x
  };
}

function ref(id: string): T.Ref {
  return { type: "ref", id };
}

export const components: T.ComponentMap = new Map([
  [
    uuid(),
    {
      name: "H1Heading",
      layout: {
        id: "root",
        type: "text",
        name: "root",
        tag: "h1",
        text: "The Evil Rabbit Jumped over the Fence",
        textAlign: "left",
        fontSize: ref("T6"),
        fontFamily: ref("default"),
        fontWeight: ref("normal"),
        lineHeight: 1.3125,
        color: ref("Black")
      }
    }
  ],
  [
    uuid(),
    {
      name: "H2Heading",
      layout: {
        id: "root",
        type: "text",
        name: "root",
        tag: "h2",
        text: "The Evil Rabbit Jumped over the Fence",
        textAlign: "left",
        fontSize: ref("T4"),
        fontFamily: ref("default"),
        fontWeight: ref("normal"),
        lineHeight: 1.2,
        color: ref("Black")
      }
    }
  ],
  [
    uuid(),
    {
      name: "H3Heading",
      layout: {
        id: "root",
        type: "text",
        name: "root",
        tag: "h3",
        text: "The Evil Rabbit Jumped over the Fence",
        textAlign: "left",
        fontSize: ref("T5"),
        fontFamily: ref("default"),
        fontWeight: ref("bold"),
        lineHeight: 1,
        color: ref("Black")
      }
    }
  ],
  [
    uuid(),
    {
      name: "H4Heading",
      layout: {
        id: "root",
        type: "text",
        name: "root",
        tag: "h4",
        text: "The Evil Rabbit Jumped over the Fence",
        textAlign: "left",
        fontSize: ref("T3"),
        fontFamily: ref("default"),
        fontWeight: ref("bold"),
        lineHeight: 1,
        color: ref("Black")
      }
    }
  ],
  [
    uuid(),
    {
      name: "SubHeading",
      layout: {
        id: "root",
        type: "text",
        name: "root",
        tag: "span",
        text: "The Evil Rabbit Jumped over the Fence",
        textAlign: "left",
        fontSize: ref("T1"),
        fontFamily: ref("default"),
        fontWeight: ref("normal"),
        lineHeight: 1.2,
        color: ref("Gray500")
      }
    }
  ]
]);

export const fontSizes: T.FontSizesMap = new Map(
  [14, 16, 18, 24, 26, 32].map((x, index) => [`T${index + 1}`, `${x}px`])
);

export const fontFamilies: T.FontFamiliesMap = new Map([
  [
    "default",
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
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
    { name: "bold", value: 700 }
  ].map(x => [x.name, x])
);

export const lineHeights = new Map(
  [{ name: "condensed", value: 1.25 }, { name: "normal", value: 1.5 }].map(
    x => [x.name, x]
  )
);

export const colors: T.ColorsMap = new Map(
  [
    { name: "Black", value: "#000000" },
    { name: "Gray500", value: "#999999" },
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
