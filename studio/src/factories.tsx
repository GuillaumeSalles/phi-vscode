import uuid from "uuid/v4";
import * as T from "./types";
import { colors } from "./styles";
import { firstEntry, firstKey } from "./helpers/immutable-map";

function ref(id: string): T.Ref {
  return { type: "ref", id };
}

export function entry<TValue>(value: TValue): [string, TValue] {
  return [uuid(), value];
}

export function px(value: number): T.Length {
  return { type: "px", value };
}

export function makeLayer(type: T.LayerType, refs: T.Refs): T.Layer {
  switch (type) {
    case "text":
      return makeTextLayer(refs);
    case "container":
      return makeContainerLayer(refs);
    default:
      throw new Error("Invalid layer type");
  }
}

export function makeTextLayer(refs: T.Refs): T.TextLayer {
  return {
    type: "text",
    id: uuid(),
    name: "Text",
    tag: "p",
    text: "",
    mediaQueries: [],
    style: {
      color: ref(firstKey(refs.colors)),
      fontFamily: ref(firstKey(refs.fontFamilies)),
      fontWeight: ref(firstKey(refs.fontWeights)),
      fontSize: ref(firstKey(refs.fontSizes)),
      textAlign: "left",
      lineHeight: 1.2
    }
  };
}

export function makeContainerLayer(refs: T.Refs): T.ContainerLayer {
  return {
    type: "container",
    id: uuid(),
    name: "Container",
    tag: "div",
    mediaQueries: [],
    children: [],
    style: {
      flexDirection: "column",
      flexWrap: "nowrap",
      justifyContent: "flex-start",
      alignItems: "stretch",
      alignContent: "stretch"
    }
  };
}

export function makeDefaultProject() {
  const defaultFontFamily = entry({
    name: "default",
    value: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
  });
  const fontFamilies: T.FontFamiliesMap = new Map([defaultFontFamily]);

  const white = entry({ name: "white", value: "#FFFFFF" });
  const black = entry({ name: "black", value: "#000000" });
  const primary = entry({ name: "primary", value: colors.primary });

  const breakpoints = new Map([
    entry({ name: "small", value: px(544) }),
    entry({ name: "medium", value: px(768) }),
    entry({ name: "large", value: px(1012) }),
    entry({ name: "xlarge", value: px(1280) })
  ]);

  const light = entry({ name: "light", value: 300 });
  const normal = entry({ name: "normal", value: 400 });
  const bold = entry({ name: "bold", value: 700 });

  const fontSizes: [string, T.FontSizeDefinition][] = [
    14,
    16,
    18,
    24,
    26,
    32
  ].map((x, index) => entry({ name: `FS${index + 1}`, value: `${x}px` }));

  const helloWorldTextLayer: T.TextLayer = {
    id: uuid(),
    type: "text",
    name: "root",
    tag: "h1",
    text: "Hello world",
    mediaQueries: [],
    style: {
      textAlign: "left",
      fontSize: ref(fontSizes[5][0]),
      fontFamily: ref(defaultFontFamily[0]),
      fontWeight: ref(normal[0]),
      lineHeight: 1.2,
      color: ref(black[0])
    }
  };

  const helloWorld = entry({
    name: "HelloWorld",
    layout: helloWorldTextLayer
  });

  const components: T.ComponentMap = new Map([helloWorld]);

  return {
    colors: new Map([black, white, primary]),
    fontFamilies: new Map(fontFamilies),
    fontSizes: new Map(fontSizes),
    fontWeights: new Map([light, normal, bold]),
    breakpoints: new Map(breakpoints),
    components
  };
}
