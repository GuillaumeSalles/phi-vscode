/** @jsx jsx */
import { jsx, InterpolationWithTheme } from "@emotion/core";
import * as T from "./types";

type Props = {
  layer: T.Layer;
  refs: T.Refs;
};

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
  return ref;
}

function fontFamilyToString(
  fontFamily: T.Ref,
  fontFamilies: T.FontFamiliesMap
) {
  const ref = fontFamilies.get(fontFamily.id);
  if (ref == null) {
    throw new Error("Invalid fontsize ref");
  }
  return ref;
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

function letterSpacingToCss(letterSpacing: T.LetterSpacing | undefined) {
  if (letterSpacing === undefined) {
    return undefined;
  }

  return `${letterSpacing.value}px`;
}

function makeTextLayerStyle(
  layer: T.TextLayer,
  refs: T.Refs
): InterpolationWithTheme<any> {
  return {
    ...makeDimensionsStyle(layer),
    ...makeBackgroundStyle(layer, refs.colors),
    color: layer.color ? colorToString(layer.color, refs.colors) : undefined,
    fontSize: fontSizeToString(layer.fontSize, refs.fontSizes),
    fontFamily: fontFamilyToString(layer.fontFamily, refs.fontFamilies),
    fontWeight: fontWeightToNumber(layer.fontWeight, refs.fontWeights),
    lineHeight: lineHeightToCss(layer.lineHeight, refs.lineHeights),
    letterSpacing: letterSpacingToCss(layer.letterSpacing)
  };
}

function makeContainerLayerStyle(
  layer: T.ContainerLayer,
  refs: T.Refs
): InterpolationWithTheme<any> {
  return {
    ...makeDimensionsStyle(layer),
    ...makeBackgroundStyle(layer, refs.colors),
    flexDirection: layer.flexDirection
  };
}

function makeLayerStyle(
  layer: T.Layer,
  refs: T.Refs
): InterpolationWithTheme<any> {
  switch (layer.type) {
    case "text":
      return makeTextLayerStyle(layer, refs);
    case "container":
      return makeContainerLayerStyle(layer, refs);
    default:
      throw new Error("Invalid layer style");
  }
}

function makeChildren(layer: T.Layer, refs: T.Refs) {
  switch (layer.type) {
    case "text":
      return layer.text;
    case "container":
      return layer.children.map(c => (
        <Layer key={c.name} layer={c} refs={refs} />
      ));
    default:
      throw new Error("Invalid layer style");
  }
}

function makeDimensionsStyle(layer: T.Dimensions) {
  return {
    height: layer.height ? lengthToString(layer.height) : undefined,
    width: layer.width ? lengthToString(layer.width) : undefined
  };
}

function makeBackgroundStyle(layer: T.Background, colors: T.ColorsMap) {
  return {
    backgroundColor: layer.backgroundColor
      ? colorToString(layer.backgroundColor, colors)
      : undefined
  };
}

function Layer({ layer, refs }: Props) {
  switch (layer.type) {
    case "text":
  }
  return jsx(
    layer.tag,
    {
      css: makeLayerStyle(layer, refs)
    },
    makeChildren(layer, refs)
  );
}

export default Layer;
