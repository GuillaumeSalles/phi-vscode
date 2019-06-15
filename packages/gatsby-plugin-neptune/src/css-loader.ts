import * as T from "../../../studio/src/types";
import { arrayToMap } from "./shared";

function layerToCss(componentName: string, layer: T.Layer, refs: T.Refs) {
  switch (layer.type) {
    case "text":
      return textLayerToCss(componentName, layer, refs);
    default:
      throw new Error("Unsupported layer type");
  }
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

function cssProp(name: string, value: string) {
  return `${name}: ${value};`;
}

function marginToCss(margin: T.Margin) {
  return cssProp(
    "margin",
    `${lengthToCss(margin.marginTop)} ${lengthToCss(
      margin.marginRight
    )} ${lengthToCss(margin.marginBottom)} ${lengthToCss(margin.marginLeft)}`
  );
}

function paddingToCss(padding: T.Padding) {
  return cssProp(
    "padding",
    `${lengthToCss(padding.paddingTop)} ${lengthToCss(
      padding.paddingRight
    )} ${lengthToCss(padding.paddingBottom)} ${lengthToCss(
      padding.paddingLeft
    )}`
  );
}

function dimensionToCss(layer: T.Dimensions) {
  return [
    cssProp("width", layer.width || "auto"),
    cssProp("min-width", layer.minWidth || "auto"),
    cssProp("max-width", layer.maxWidth || "auto"),
    cssProp("height", layer.height || "auto"),
    cssProp("min-height", layer.minHeight || "auto"),
    cssProp("max-height", layer.maxHeight || "auto")
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
    return "";
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
    return "";
  }
  return getRefValue(item, map).value;
}

function fontFamilyToCss(item: T.Ref | undefined, map: T.FontFamiliesMap) {
  if (!item) {
    return "";
  }
  return getRefValue(item, map).value;
}

function fontWeightToCss(item: T.Ref | undefined, map: T.FontWeightsMap) {
  if (!item) {
    return "";
  }
  return getRefValue(item, map).value.toString();
}

function textLayerToCss(
  componentName: string,
  layer: T.TextLayer,
  refs: T.Refs
) {
  return `.${componentName}-${layer.name} {
    ${marginToCss(layer)}
    ${paddingToCss(layer)}
    ${dimensionToCss(layer)}
    ${cssProp("letter-spacing", lengthToCss(layer.letterSpacing, "1.2"))}
    ${cssProp("line-height", layer.lineHeight.toString())}
    ${cssProp("text-align", layer.textAlign)}
    ${cssProp("color", colorToCss(layer.color, refs.colors))}
    ${cssProp(
      "font-family",
      fontFamilyToCss(layer.fontFamily, refs.fontFamilies)
    )}
    ${cssProp("font-size", fontSizeToCss(layer.fontSize, refs.fontSizes))}
    ${cssProp(
      "font-weight",
      fontWeightToCss(layer.fontWeight, refs.fontWeights)
    )}
}`;
}

function componentToCss(component: T.Component, refs: T.Refs) {
  return layerToCss(component.name, component.layout, refs);
}

export function neptuneToCss(data: any) {
  const components: T.ComponentMap = arrayToMap(data.components);
  const refs: T.Refs = {
    breakpoints: arrayToMap(data.breakpoints),
    colors: arrayToMap(data.colors),
    fontSizes: arrayToMap(data.fontSizes),
    fontWeights: arrayToMap(data.fontWeights),
    fontFamilies: arrayToMap(data.fontFamilies),
    lineHeights: arrayToMap(data.lineHeights),
    components,
    // TODO: Refactor project state to not file name and isSaved in refs
    isSaved: true,
    fileName: ""
  };

  return Array.from(components.values())
    .map(component => componentToCss(component, refs))
    .join("\n\n");
}

export default function cssLoader(source: string) {
  console.log("Inside neptune-css-loader");
  console.log(source);

  return neptuneToCss(JSON.parse(source));
}
