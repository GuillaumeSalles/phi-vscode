import uuid from "uuid/v4";
import * as T from "./types";
import { colors } from "./styles";
import { firstKey, getKeyByIndex } from "./helpers/immutable-map";

function ref(id: string): T.Ref {
  return { type: "ref", id };
}

export function entry<TValue>(value: TValue): [string, TValue] {
  return [uuid(), value];
}

export function px(value: number): T.Length {
  return { type: "px", value };
}

export function generateUniqueLayerName(
  type: T.LayerType,
  root: T.Layer | undefined
) {
  const existingNames = new Set(
    layerTreeToArray(root).map(layer => layer.name)
  );

  const prefix = layerTypeToNamePrefix(type);
  let i = 1;
  while (existingNames.has(`${prefix} ${i}`)) {
    i++;
  }

  return `${prefix} ${i}`;
}

function layerTypeToNamePrefix(type: T.LayerType): string {
  switch (type) {
    case "container":
      return "Container";
    case "text":
      return "Text";
    default:
      throw new Error(`Can't generate layer name prefix from type ${type}`);
  }
}

export function layerTreeToArray(root: T.Layer | undefined): T.Layer[] {
  if (!root) {
    return [];
  }
  const result = [root];
  if (root.type === "container") {
    return result.concat(root.children.map(layerTreeToArray).flat());
  }
  return result;
}

export function makeLayer(
  type: T.LayerType,
  root: T.Layer | undefined,
  refs: T.Refs
): T.Layer {
  const name = generateUniqueLayerName(type, root);

  switch (type) {
    case "text":
      return makeTextLayer(refs, { name });
    case "container":
      return makeContainerLayer(refs, { name });
    default:
      throw new Error("Invalid layer type");
  }
}

export function makeTextLayer(
  refs: T.Refs,
  props: Partial<T.TextLayer> = {}
): T.TextLayer {
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
    },
    ...props
  };
}

export function makeDefaultLineHeights(): T.LineHeightMap {
  return new Map(
    [{ name: "condensed", value: 1.25 }, { name: "normal", value: 1.5 }].map(
      x => [x.name, x]
    )
  );
}

export function makeContainerLayer(
  refs: T.Refs,
  props: Partial<T.ContainerLayer> = {}
): T.ContainerLayer {
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
    },
    ...props
  };
}

export function makeDefaultFontFamilies(): T.FontFamiliesMap {
  const defaultFontFamily = entry({
    name: "default",
    value: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
  });
  return new Map([defaultFontFamily]);
}

export function makeDefaultColors(): T.ColorsMap {
  const white = entry({ name: "white", value: "#FFFFFF" });
  const black = entry({ name: "black", value: "#000000" });
  const primary = entry({ name: "primary", value: colors.primary });
  return new Map([black, white, primary]);
}

export function makeDefaultBreakpoints(): T.BreakpointsMap {
  return new Map([
    entry({ name: "small", value: px(544) }),
    entry({ name: "medium", value: px(768) }),
    entry({ name: "large", value: px(1012) }),
    entry({ name: "xlarge", value: px(1280) })
  ]);
}

export function makeDefaultFontWeights(): T.FontWeightsMap {
  const light = entry({ name: "light", value: 300 });
  const normal = entry({ name: "normal", value: 400 });
  const bold = entry({ name: "bold", value: 700 });
  return new Map([light, normal, bold]);
}

export function makeDefaultFontSizes(): T.FontSizesMap {
  const fontSizes = new Map(
    [14, 16, 18, 24, 26, 32].map((x, index) =>
      entry({ name: `FS${index + 1}`, value: `${x}px` })
    )
  );
  return fontSizes;
}

export function makeDefaultProject() {
  const fontFamilies = makeDefaultFontFamilies();
  const colors = makeDefaultColors();
  const breakpoints = makeDefaultBreakpoints();
  const fontWeights = makeDefaultFontWeights();
  const fontSizes = makeDefaultFontSizes();

  const helloWorldTextLayer: T.TextLayer = {
    id: uuid(),
    type: "text",
    name: "root",
    tag: "h1",
    text: "Hello world",
    mediaQueries: [],
    style: {
      textAlign: "left",
      fontSize: ref(getKeyByIndex(fontSizes, 5)),
      fontFamily: ref(firstKey(fontFamilies)),
      fontWeight: ref(getKeyByIndex(fontWeights, 1)),
      lineHeight: 1.2,
      color: ref(getKeyByIndex(colors, 1))
    }
  };

  const helloWorld = entry({
    name: "HelloWorld",
    layout: helloWorldTextLayer
  });

  const components: T.ComponentMap = new Map([helloWorld]);

  return {
    colors,
    fontFamilies,
    fontSizes: new Map(fontSizes),
    fontWeights,
    breakpoints,
    components
  };
}
