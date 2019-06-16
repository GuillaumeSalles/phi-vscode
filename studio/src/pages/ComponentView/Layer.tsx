/** @jsx jsx */
import { jsx, InterpolationWithTheme } from "@emotion/core";
import * as T from "../../types";

type Props = {
  layer: T.Layer;
  refs: T.Refs;
  width: number;
};

function lengthToCss(
  length: T.Length | undefined,
  defaultValue?: string
): string | undefined {
  return length ? lengthToString(length) : defaultValue;
}

function lengthToString(length: T.Length) {
  switch (length.type) {
    case "px":
      return `${length.value}px`;
    default:
      throw new Error("Invalid length type");
  }
}

function colorToString(color: T.Color, colors: T.ColorsMap) {
  switch (color.type) {
    case "ref":
      const ref = colors.get(color.id);
      if (ref == null) {
        throw new Error("Invalid color ref");
      }
      return ref.value;
    case "hex":
      return color.value;
    default:
      throw new Error("Invalid color type");
  }
}

function fontSizeToString(
  fontSize: T.Ref | undefined,
  fontSizes: T.FontSizesMap
) {
  if (fontSize === undefined) {
    return undefined;
  }
  const ref = fontSizes.get(fontSize.id);
  if (ref == null) {
    throw new Error("Invalid fontsize ref");
  }
  return ref.value;
}

function fontFamilyToString(
  fontFamily: T.Ref,
  fontFamilies: T.FontFamiliesMap
): string {
  const ref = fontFamilies.get(fontFamily.id);
  if (ref == null) {
    throw new Error("Invalid fontsize ref");
  }
  return ref.value;
}

function fontWeightToNumber(fontWeight: T.Ref, fontWeights: T.FontWeightsMap) {
  const ref = fontWeights.get(fontWeight.id);
  if (ref == null) {
    throw new Error("Invalid font weight ref");
  }
  return ref.value;
}

function lineHeightToCss(lineHeight: T.Ref, lineHeights: T.LineHeightMap) {
  const ref = lineHeights.get(lineHeight.id);
  if (ref == null) {
    throw new Error("Invalid line height ref");
  }
  return ref.value;
}

function makeTextLayerStyleWithBreakpoint(
  layer: T.TextLayer,
  refs: T.Refs,
  width: number
): InterpolationWithTheme<any> {
  const defaultStyle = makeTextLayerStyle(layer.style, refs);
  return layer.mediaQueries
    .map(mq => {
      return {
        minWidth: refs.breakpoints.get(mq.minWidth.id)!.value.value,
        style: mq.style
      };
    })
    .filter(mq => mq.minWidth <= width)
    .sort((a, b) => a.minWidth - b.minWidth)
    .map(mq => makeTextLayerStyle(mq.style, refs))
    .reduce((previousStyle, currentStyle) => {
      return {
        ...previousStyle,
        ...currentStyle
      };
    }, defaultStyle);
}

function makeTextLayerStyle(style: T.TextLayerStyle, refs: T.Refs) {
  return {
    ...makeDimensionsStyle(style),
    ...makeMarginStyle(style),
    ...makePaddingStyle(style),
    ...makeBackgroundStyle(style, refs.colors),
    color: style.color ? colorToString(style.color, refs.colors) : undefined,
    fontSize: fontSizeToString(style.fontSize, refs.fontSizes),
    fontFamily: fontFamilyToString(style.fontFamily, refs.fontFamilies),
    fontWeight: fontWeightToNumber(style.fontWeight, refs.fontWeights),
    lineHeight: style.lineHeight,
    letterSpacing: lengthToCss(style.letterSpacing, "0"),
    textAlign: style.textAlign
  };
}

function makeContainerLayerStyle(
  style: T.ContainerLayerStyle,
  refs: T.Refs
): InterpolationWithTheme<any> {
  return {
    ...makeDimensionsStyle(style),
    ...makeBackgroundStyle(style, refs.colors),
    flexDirection: style.flexDirection
  };
}

function makeLayerStyle(
  layer: T.Layer,
  refs: T.Refs,
  width: number
): InterpolationWithTheme<any> {
  switch (layer.type) {
    case "text":
      return makeTextLayerStyleWithBreakpoint(layer, refs, width);
    case "container":
      return makeContainerLayerStyle(layer.style, refs);
    default:
      throw new Error("Invalid layer style");
  }
}

function makeChildren(layer: T.Layer, refs: T.Refs, width: number) {
  switch (layer.type) {
    case "text":
      return layer.text;
    case "container":
      return layer.children.map(c => (
        <Layer key={c.name} layer={c} refs={refs} width={width} />
      ));
    default:
      throw new Error("Invalid layer style");
  }
}

function makeDimensionsStyle(layer: T.Dimensions) {
  return {
    height: layer.height ? layer.height : "auto",
    minHeight: layer.minHeight ? layer.minHeight : "auto",
    maxHeight: layer.maxHeight ? layer.maxHeight : "auto",
    width: layer.width ? layer.width : "auto",
    minWidth: layer.minWidth ? layer.minWidth : "auto",
    maxWidth: layer.maxWidth ? layer.maxWidth : "auto"
  };
}

function makeMarginStyle(layer: T.Margin) {
  return {
    marginTop: lengthToCss(layer.marginTop, "0"),
    marginRight: lengthToCss(layer.marginRight, "0"),
    marginBottom: lengthToCss(layer.marginBottom, "0"),
    marginLeft: lengthToCss(layer.marginLeft, "0")
  };
}

function makePaddingStyle(layer: T.Padding) {
  return {
    paddingTop: lengthToCss(layer.paddingTop, "0"),
    paddingRight: lengthToCss(layer.paddingRight, "0"),
    paddingBottom: lengthToCss(layer.paddingBottom, "0"),
    paddingLeft: lengthToCss(layer.paddingLeft, "0")
  };
}

function makeBackgroundStyle(layer: T.Background, colors: T.ColorsMap) {
  return {
    backgroundColor: layer.backgroundColor
      ? colorToString(layer.backgroundColor, colors)
      : undefined
  };
}

function Layer({ layer, refs, width }: Props) {
  switch (layer.type) {
    case "text":
  }
  return jsx(
    layer.tag,
    {
      css: makeLayerStyle(layer, refs, width)
    },
    makeChildren(layer, refs, width)
  );
}

export default Layer;
