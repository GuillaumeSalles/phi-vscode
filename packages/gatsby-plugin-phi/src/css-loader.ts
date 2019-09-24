import * as T from "../../../studio/src/types";
import { arrayToMap, kebabToPascal, layerTreeToArray } from "./shared";

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

function dimensionToCss(layer: T.Dimensions) {
  return [
    cssProp("width", layer.width),
    cssProp("min-width", layer.minWidth),
    cssProp("max-width", layer.maxWidth),
    cssProp("height", layer.height),
    cssProp("min-height", layer.minHeight),
    cssProp("max-height", layer.maxHeight)
  ].join("\n");
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

function layerStyleToCss(style: T.LayerStyle, refs: T.Refs) {
  return `
    ${cssProp("position", style.position || "relative")}
    ${cssProp("top", style.position || "top")}
    ${cssProp("right", style.position || "right")}
    ${cssProp("bottom", style.position || "bottom")}
    ${cssProp("left", style.position || "left")}
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
      "backgroundColor",
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

function layerToCss(componentName: string, layer: T.Layer, refs: T.Refs) {
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

function componentToCss(component: T.Component, refs: T.Refs) {
  return layerTreeToArray(component.layout)
    .map(layer => layerToCss(kebabToPascal(component.name), layer, refs))
    .join("\n\n");
}

export function phiToCss(data: any) {
  const components: T.ComponentMap = arrayToMap(data.components);
  const refs: T.Refs = {
    breakpoints: arrayToMap(data.breakpoints),
    colors: arrayToMap(data.colors),
    fontSizes: arrayToMap(data.fontSizes),
    fontFamilies: arrayToMap(data.fontFamilies),
    components,
    // TODO: Refactor project state to not file name and isSaved in refs
    isSaved: true,
    fileName: "",
    artboards: new Map()
  };

  return Array.from(components.values())
    .map(component => componentToCss(component, refs))
    .join("\n\n");
}

export default function cssLoader(source: string) {
  return phiToCss(JSON.parse(source));
}
