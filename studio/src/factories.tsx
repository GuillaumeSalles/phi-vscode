import uuid from "uuid/v4";
import * as T from "./types";
import { colors } from "./styles";
import { firstKey, getKeyByIndex } from "./helpers/immutable-map";
import { layerTypeToName, layerTreeToArray } from "./layerUtils";
import { assertUnreachable } from "./utils";

export function makeRef(id: string): T.Ref {
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

  const prefix = layerTypeToName(type);

  if (!existingNames.has(prefix)) {
    return prefix;
  }

  let i = 1;
  while (existingNames.has(`${prefix} ${i}`)) {
    i++;
  }

  return `${prefix} ${i}`;
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
    case "link":
      return makeLinkLayer(refs, { name });
    case "container":
      return makeContainerLayer(refs, { name });
    case "image":
      return makeImageLayer(refs, { name });
  }
  assertUnreachable(type);
}

export function makeImageLayer(
  refs: T.Refs,
  props: Partial<T.ImageLayer> = {}
): T.ImageLayer {
  return {
    type: "image",
    id: uuid(),
    name: "Text",
    tag: "img",
    src: "",
    alt: "",
    mediaQueries: [],
    overrides: [],
    style: {},
    ...props
  };
}

export function makeLinkLayer(
  refs: T.Refs,
  props: Partial<T.LinkLayer> = {}
): T.LinkLayer {
  return {
    type: "link",
    id: uuid(),
    name: "Text",
    tag: "a",
    content: "link",
    href: "",
    children: [],
    mediaQueries: [],
    overrides: [],
    style: {
      display: "inline",
      textDecoration: {
        isStrikedThrough: false,
        isUnderlined: true
      },
      color: makeRef(firstKey(refs.colors)),
      fontFamily: makeRef(firstKey(refs.fontFamilies)),
      fontWeight: makeRef(firstKey(refs.fontWeights)),
      fontSize: makeRef(firstKey(refs.fontSizes)),
      textAlign: "left",
      lineHeight: 1.2,
      overrides: []
    },
    ...props
  };
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
    overrides: [],
    style: {
      display: "block",
      textDecoration: {
        isStrikedThrough: false,
        isUnderlined: false
      },
      color: makeRef(firstKey(refs.colors)),
      fontFamily: makeRef(firstKey(refs.fontFamilies)),
      fontWeight: makeRef(firstKey(refs.fontWeights)),
      fontSize: makeRef(firstKey(refs.fontSizes)),
      textAlign: "left",
      lineHeight: 1.2,
      overrides: []
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
    name: "container",
    tag: "div",
    mediaQueries: [],
    children: [],
    overrides: [],
    style: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "nowrap",
      justifyContent: "flex-start",
      alignItems: "stretch",
      alignContent: "stretch",
      overrides: []
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
    overrides: [],
    style: {
      display: "block",
      textDecoration: {
        isStrikedThrough: false,
        isUnderlined: false
      },
      textAlign: "left",
      fontSize: makeRef(getKeyByIndex(fontSizes, 5)),
      fontFamily: makeRef(firstKey(fontFamilies)),
      fontWeight: makeRef(getKeyByIndex(fontWeights, 1)),
      lineHeight: 1.2,
      color: makeRef(firstKey(colors)),
      overrides: []
    }
  };

  const helloWorld = entry({
    name: "hello-world",
    layout: helloWorldTextLayer,
    props: [],
    overrides: []
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
