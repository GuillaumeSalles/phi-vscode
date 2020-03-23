import * as T from "./types";
import ts from "typescript";

export function flatten<T>(arrOfArr: T[][]) {
  const result = [];
  for (let arr of arrOfArr) {
    for (let item of arr) {
      result.push(item);
    }
  }
  return result;
}

export function arrayToMap(array: any[]): Map<string, any> {
  return new Map(
    array.map((item: any) => {
      const { id, ...rest } = item;
      return [id, rest];
    })
  );
}

export function kebabToPascal(kebab: string): string {
  return capitalizeFirstLetter(kebabToCamel(kebab));
}

export function layerTreeToArray(root: T.Layer | undefined): T.Layer[] {
  if (!root) {
    return [];
  }
  const result = [root];
  if (root.type === "container" || root.type === "link") {
    return result.concat(flatten(root.children.map(layerTreeToArray)));
  }
  return result;
}

export function kebabToCamel(kebab: string): string {
  let result = "";
  let isMaj = false;
  for (let i = 0; i < kebab.length; i++) {
    const charCode = kebab.charCodeAt(i);
    if (isMaj && charCode >= 97 && charCode <= 122) {
      result += String.fromCharCode(charCode - 32);
      isMaj = false;
    } else if (charCode === 45) {
      // i++;
      isMaj = true;
    } else {
      result += kebab[i];
    }
  }
  return result;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

export function tsNodesToString(nodes: ReadonlyArray<ts.Node>) {
  const resultFile = ts.createSourceFile(
    "someFileName.ts",
    "",
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS
  );

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed
  });

  return printer.printList(
    ts.ListFormat.MultiLine | ts.ListFormat.PreferNewLine,
    ts.createNodeArray(nodes),
    resultFile
  );
}

export function createSimpleJsxElement(
  name: string,
  properties: ReadonlyArray<ts.JsxAttributeLike>,
  children: ReadonlyArray<ts.JsxChild> = []
) {
  return ts.createJsxElement(
    ts.createJsxOpeningElement(
      ts.createIdentifier(name),
      undefined,
      ts.createJsxAttributes(properties)
    ),
    children,
    ts.createJsxClosingElement(ts.createIdentifier(name))
  );
}

export function createJsxOpeningFragment() {
  const node = ts.createNode(ts.SyntaxKind.JsxOpeningFragment);
  return node as ts.JsxOpeningFragment;
}

export function createJsxClosingFragment() {
  const node = ts.createNode(ts.SyntaxKind.JsxClosingFragment);
  return node as ts.JsxClosingFragment;
}

export function createStringAttributeJsx(
  attributeName: string,
  stringLiteral: string
) {
  return ts.createJsxAttribute(
    ts.createIdentifier(attributeName),
    ts.createJsxExpression(undefined, ts.createStringLiteral(stringLiteral))
  );
}

export function jsonToRefs(data: any): T.Refs {
  return {
    isSaved: true,
    fileName: undefined,
    uiState: data.uiState || { type: "typography" },
    artboards: new Map(),
    components: arrayToMap(data.components),
    fontSizes: arrayToMap(data.fontSizes),
    fontFamilies: arrayToMap(data.fontFamilies),
    breakpoints: arrayToMap(data.breakpoints),
    colors: arrayToMap(data.colors)
  };
}

function lengthToCss(length?: T.Length, defaultValue?: string) {
  if (!length) {
    return defaultValue || "0";
  }

  switch (length.type) {
    case "px":
      return `${length.value}px`;
    default:
      throw new Error("Length type is not supported");
  }
}

function cssProp(name: string, value?: string) {
  return value != null ? `${name}: ${value};` : "";
}

function getRefValue<TValue>(item: T.Ref, map: Map<string, TValue>) {
  const ref = map.get(item.id);
  if (!ref) {
    throw new Error("Ref not found");
  }
  return ref;
}

function colorToCss(color: T.Color | undefined, colors: T.ColorsMap) {
  if (!color) {
    return undefined;
  }

  switch (color.type) {
    case "ref":
      return getRefValue(color, colors).value;
    case "hex":
    default:
      throw new Error("Color type non supported");
  }
}

function fontSizeToCss(item: T.Ref | undefined, map: T.FontSizesMap) {
  if (!item) {
    return undefined;
  }
  return getRefValue(item, map).value;
}

function fontFamilyToCss(item: T.Ref | undefined, map: T.FontFamiliesMap) {
  if (!item) {
    return undefined;
  }
  return getRefValue(item, map).value;
}

function displayToCss(style: T.LayerStyle) {
  return `
    ${cssProp("display", style.display)}
    ${cssProp("flex-direction", style.flexDirection)}
    ${cssProp("flex-wrap", style.flexWrap)}
    ${cssProp("align-items", style.alignItems)}
    ${cssProp("align-content", style.alignContent)}
    ${cssProp("justify-content", style.justifyContent)}
  `;
}

function textDecorationToCss(style: T.LayerStyle) {
  if (style.textDecoration == null) {
    return undefined;
  }
  const properties = [];
  if (style.textDecoration.isUnderlined) {
    properties.push("underline");
  }
  if (style.textDecoration.isStrikedThrough) {
    properties.push("line-through");
  }
  if (properties.length === 0) {
    return "none";
  }
  return properties.join(" ");
}

function layerStyleToCss(style: T.LayerStyle, refs: T.Refs) {
  return `
    ${cssProp("position", style.position || "relative")}
    ${cssProp("top", style.top)}
    ${cssProp("right", style.right)}
    ${cssProp("bottom", style.bottom)}
    ${cssProp("left", style.left)}
    ${displayToCss(style)}
    ${cssProp("margin-top", style.marginTop)}
    ${cssProp("margin-right", style.marginRight)}
    ${cssProp("margin-bottom", style.marginBottom)}
    ${cssProp("margin-left", style.marginLeft)}
    ${cssProp("padding-top", style.paddingTop)}
    ${cssProp("padding-right", style.paddingRight)}
    ${cssProp("padding-bottom", style.paddingBottom)}
    ${cssProp("padding-left", style.paddingLeft)}
    ${cssProp("width", style.width)}
    ${cssProp("min-width", style.minWidth)}
    ${cssProp("max-width", style.maxWidth)}
    ${cssProp("height", style.height)}
    ${cssProp("min-height", style.minHeight)}
    ${cssProp("max-height", style.maxHeight)}
    ${cssProp("border-top-left-radius", style.borderTopLeftRadius)}
    ${cssProp("border-top-right-radius", style.borderTopRightRadius)}
    ${cssProp("border-bottom-right-radius", style.borderBottomRightRadius)}
    ${cssProp("border-bottom-left-radius", style.borderBottomLeftRadius)}
    ${cssProp("border-top-width", style.borderTopWidth)}
    ${cssProp("border-right-width", style.borderRightWidth)}
    ${cssProp("border-bottom-width", style.borderBottomWidth)}
    ${cssProp("border-left-width", style.borderLeftWidth)}

    ${cssProp("border-top-style", style.borderTopStyle)}
    ${cssProp("border-right-style", style.borderRightStyle)}
    ${cssProp("border-bottom-style", style.borderBottomStyle)}
    ${cssProp("border-left-style", style.borderLeftStyle)}
    ${cssProp(
      "border-top-color",
      colorToCss(style.borderTopColor, refs.colors)
    )}
    ${cssProp(
      "border-right-color",
      colorToCss(style.borderRightColor, refs.colors)
    )}
    ${cssProp(
      "border-bottom-color",
      colorToCss(style.borderBottomColor, refs.colors)
    )}
    ${cssProp(
      "border-left-color",
      colorToCss(style.borderLeftColor, refs.colors)
    )}
    
    ${cssProp(
      "opacity",
      style.opacity != null ? style.opacity.toString() : undefined
    )}
    ${cssProp(
      "background-color",
      colorToCss(style.backgroundColor, refs.colors)
    )}
    ${cssProp("text-decoration", textDecorationToCss(style))}
    ${cssProp("letter-spacing", lengthToCss(style.letterSpacing, "1.2"))}
    ${cssProp(
      "line-height",
      style.lineHeight != null ? style.lineHeight.toString() : undefined
    )}
    ${cssProp("text-align", style.textAlign)}
    ${cssProp("color", colorToCss(style.color, refs.colors))}
    ${cssProp(
      "font-family",
      fontFamilyToCss(style.fontFamily, refs.fontFamilies)
    )}
    ${cssProp("font-size", fontSizeToCss(style.fontSize, refs.fontSizes))}
    ${cssProp("font-weight", style.fontWeight)}
  `;
}

function rootLayerStyleToCss(
  componentName: string,
  layerName: string,
  style: T.LayerStyle,
  refs: T.Refs
) {
  return `.${componentName}-${layerName} {
    ${layerStyleToCss(style, refs)}
} 

${layerStyleOverridesToCss(componentName, layerName, style, refs)}`;
}

function layerStyleOverridesToCss(
  componentName: string,
  layerName: string,
  style: T.LayerStyle,
  refs: T.Refs
) {
  if (style.overrides == null) {
    return "";
  }

  return style.overrides
    .map(override => {
      return `.${componentName}-${layerName}${override.pseudoClass} {
      ${layerStyleToCss(override.style, refs)}
    }`;
    })
    .join("\n\n");
}

export function layerToCss(
  componentName: string,
  layer: T.Layer,
  refs: T.Refs
) {
  const defaultStyle = rootLayerStyleToCss(
    componentName,
    layer.name,
    layer.style,
    refs
  );
  const mqStyles = Array.from(layer.mediaQueries.values()).map(mq => {
    const bp = refs.breakpoints.get(mq.minWidth.id);
    if (!bp) {
      throw new Error("Breakpoint not found");
    }
    return `@media (min-width: ${bp.value.value}px) {
      ${rootLayerStyleToCss(componentName, layer.name, mq.style, refs)}
    }`;
  });

  return [defaultStyle].concat(mqStyles).join("\n");
}

export function createComponentPropsDestructuration(component: T.Component) {
  if (component.props.length === 0) {
    return [];
  }

  return [
    ts.createParameter(
      undefined,
      undefined,
      undefined,
      ts.createObjectBindingPattern(
        component.props.map(prop => {
          return ts.createBindingElement(
            undefined,
            undefined,
            ts.createIdentifier(kebabToCamel(prop.name)),
            undefined
          );
        })
      ),
      undefined,
      undefined,
      undefined
    )
  ];
}

function layerPropNameToJsxAttributeName(prop: string) {
  if (prop === "content") {
    return "children";
  }
  return prop;
}

function componentLayerAttributeMap(
  layer: T.ComponentLayer,
  components: T.ComponentMap
) {
  const component = components.get(layer.componentId);
  if (component == null) {
    throw new Error(`Component with id ("${layer.componentId}") not found`);
  }
  const map = new Map();
  for (let prop in layer.props) {
    const componentProp = component.props.find(
      componentProp => componentProp.name === prop
    );
    if (componentProp == null) {
      throw new Error(`Component prop with id ("${prop}") not found`);
    }
    map.set(
      layerPropNameToJsxAttributeName(kebabToCamel(componentProp.name)),
      ts.createStringLiteral(layer.props[prop])
    );
  }
  return map;
}

function propValueToAttributeValue(
  layerType: T.LayerType,
  name: string,
  value: string
) {
  if (layerType === "image" && name === "src") {
    if (value.startsWith("http")) {
      return ts.createStringLiteral(value);
    }
    return ts.createCall(ts.createIdentifier("require"), undefined, [
      ts.createStringLiteral(value)
    ]);
  }

  return ts.createStringLiteral(value);
}

function createSimpleAttributeMap(
  layer: T.Layer,
  components: T.ComponentMap
): Map<string, ts.Expression> {
  switch (layer.type) {
    case "container":
      return new Map();
    case "component":
      return componentLayerAttributeMap(layer, components);
    case "text":
    case "link":
    case "image":
      return new Map(
        Object.entries(layer.props)
          .filter(([propName, value]) => value != null)
          .map(([propName, value]) => {
            return [
              layerPropNameToJsxAttributeName(propName),
              propValueToAttributeValue(layer.type, propName, value)
            ];
          })
      );
  }
}

export function createLayerPropertiesJsx(
  component: T.Component,
  layer: T.Layer,
  components: T.ComponentMap
): ts.JsxAttribute[] {
  const attributesMap = createSimpleAttributeMap(layer, components);

  for (let prop in layer.bindings) {
    const propName = layer.bindings[prop].propName;

    const componentProp = component.props.find(p => p.name === propName);
    if (componentProp == null) {
      throw new Error(`Prop (${propName}) not found`);
    }
    attributesMap.set(
      layerPropNameToJsxAttributeName(kebabToCamel(prop)),
      ts.createIdentifier(kebabToCamel(componentProp.name))
    );
  }

  return Array.from(attributesMap.entries()).map(([attrName, node]) => {
    return ts.createJsxAttribute(
      ts.createIdentifier(attrName),
      ts.createJsxExpression(undefined, node)
    );
  });
}

export * from "./types";
