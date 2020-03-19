import uuid from "uuid/v4";
import * as T from "./types";
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
  while (existingNames.has(`${prefix}${i}`)) {
    i++;
  }

  return `${prefix}${i}`;
}

export function makeLayer(
  id: string,
  type: T.LayerType,
  root: T.Layer | undefined,
  refs: T.Refs,
  componentId?: string
): T.Layer {
  const name = generateUniqueLayerName(type, root);
  switch (type) {
    case "text":
      return makeTextLayer(refs, { name, id });
    case "link":
      return makeLinkLayer(refs, { name, id });
    case "container":
      return makeContainerLayer(refs, { name, id });
    case "image":
      return makeImageLayer(refs, { name, id });
    case "component":
      if (componentId == null) {
        throw new Error("ComponentId is required to create a component layer");
      }
      return makeComponentLayer(refs, name, componentId);
  }
  assertUnreachable(type);
}

export function makeComponentLayer(
  refs: T.Refs,
  name: string,
  componentId: string,
  props: Partial<T.ComponentLayer> = {}
): T.ComponentLayer {
  return {
    type: "component",
    id: uuid(),
    name: name,
    componentId,
    mediaQueries: [],
    bindings: {},
    style: {},
    props: {},
    ...props
  };
}

export function makeImageLayer(
  refs: T.Refs,
  props: Partial<T.ImageLayer> = {}
): T.ImageLayer {
  return {
    type: "image",
    id: uuid(),
    name: "Image",
    tag: "img",
    props: {
      src: "",
      alt: ""
    },
    mediaQueries: [],
    style: {},
    bindings: {},
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
    children: [],
    mediaQueries: [],
    bindings: {},
    props: {
      content: "link",
      href: ""
    },
    style: {
      display: "inline",
      textDecoration: {
        isStrikedThrough: false,
        isUnderlined: true
      },
      color: makeRef(firstKey(refs.colors)),
      fontFamily: makeRef(firstKey(refs.fontFamilies)),
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
    tag: "span",
    mediaQueries: [],
    bindings: {},
    props: {
      content: ""
    },
    style: {
      display: "block",
      textDecoration: {
        isStrikedThrough: false,
        isUnderlined: false
      },
      color: makeRef(firstKey(refs.colors)),
      fontFamily: makeRef(firstKey(refs.fontFamilies)),
      fontSize: makeRef(firstKey(refs.fontSizes)),
      textAlign: "left",
      lineHeight: 1.2,
      overrides: []
    },
    ...props
  };
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
    bindings: {},
    props: {},
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
  const primary = entry({ name: "primary", value: "#0076FF" });
  return new Map([white, black, primary]);
}

export function makeDefaultBreakpoints(): T.BreakpointsMap {
  return new Map([
    entry({ name: "small", value: px(544) }),
    entry({ name: "medium", value: px(768) }),
    entry({ name: "large", value: px(1012) }),
    entry({ name: "xlarge", value: px(1280) })
  ]);
}

export function makeDefaultFontSizes(): T.FontSizesMap {
  const fontSizes = new Map(
    [14, 16, 18, 24, 26, 32].map((x, index) =>
      entry({ name: `fs-${index + 1}`, value: `${x}px` })
    )
  );
  return fontSizes;
}

const iPhoneX = "3c6c1f84-c6b2-46d7-97f9-750cfe25df73";
const iPad = "3c6c1f84-c6b2-46d7-97f9-750cfe25df74";
const iPadPro = "3c6c1f84-c6b2-46d7-97f9-750cfe25df75";

export function makeDefaultArtboards(): T.ArtboardsMap {
  return new Map([
    [
      iPhoneX,
      {
        name: "iPhone X",
        width: "375px",
        height: "auto",
        backgroundColor: "white"
      }
    ],
    [
      iPad,
      { name: "iPad", width: "768px", height: "auto", backgroundColor: "white" }
    ],
    [
      iPadPro,
      {
        name: "iPad Pro",
        width: "1024px",
        height: "auto",
        backgroundColor: "white"
      }
    ]
  ]);
}

export function makeComponent(
  overrides: Partial<T.Component> = {}
): T.Component {
  return {
    name: "componentName",
    props: [],
    examples: [],
    ...overrides
  };
}

export function makeComponentProp(
  overrides: Partial<T.ComponentProp> = {}
): T.ComponentProp {
  return {
    name: "component-prop-name",
    type: "text",
    ...overrides
  };
}

export function makeDefaultProject(): T.Refs {
  const fontFamilies = makeDefaultFontFamilies();
  const colors = makeDefaultColors();
  const breakpoints = makeDefaultBreakpoints();
  const fontSizes = makeDefaultFontSizes();
  const artboards = makeDefaultArtboards();

  const refs: T.Refs = {
    fileName: undefined,
    isSaved: false,
    uiState: {
      type: "typography"
    },
    artboards,
    colors,
    fontFamilies,
    fontSizes: new Map(fontSizes),
    breakpoints,
    components: new Map()
  };

  const components: T.ComponentMap = new Map([
    [
      uuid(),
      {
        name: "hello-world",
        props: [],
        examples: [],
        layout: makeContainerLayer(refs, {
          style: {
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            alignContent: "stretch",
            overrides: []
          },
          children: [
            makeTextLayer(refs, {
              props: {
                content: "Hello World"
              },
              style: {
                backgroundColor: makeRef(getKeyByIndex(colors, 2)),
                color: makeRef(firstKey(colors)),
                paddingBottom: "16px",
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingTop: "16px",
                borderBottomLeftRadius: "3px",
                borderBottomRightRadius: "3px",
                borderTopLeftRadius: "3px",
                borderTopRightRadius: "3px"
              }
            })
          ]
        })
      }
    ]
  ]);

  refs.components = components;
  refs.uiState = {
    type: "component",
    componentId: firstKey(components),
    isEditing: false,
    layerEditorMode: "html"
  };

  return refs;
}
