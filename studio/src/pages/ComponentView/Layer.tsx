/** @jsx jsx */
import { jsx, InterpolationWithTheme } from "@emotion/core";
import * as T from "../../types";
import { assertUnreachable } from "../../utils";
import { firstEntry } from "../../helpers/immutable-map";

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
  fontFamily: T.Ref | undefined,
  fontFamilies: T.FontFamiliesMap
): string {
  if (fontFamily == null) {
    return firstEntry(fontFamilies)[1].value;
  }
  const ref = fontFamilies.get(fontFamily.id);
  if (ref == null) {
    throw new Error("Invalid fontsize ref");
  }
  return ref.value;
}

function fontWeightToNumber(
  fontWeight: T.Ref | undefined,
  fontWeights: T.FontWeightsMap
) {
  if (fontWeight == null) {
    return firstEntry(fontWeights)[1].value;
  }
  const ref = fontWeights.get(fontWeight.id);
  if (ref == null) {
    throw new Error("Invalid font weight ref");
  }
  return ref.value;
}

function getLayerStyles(
  defaultStyle: T.LayerStyle,
  mediaQueries: T.MediaQuery[],
  refs: T.Refs,
  width: number
) {
  const styles = mediaQueries
    .map(mq => {
      return {
        minWidth: refs.breakpoints.get(mq.minWidth.id)!.value.value,
        style: mq.style
      };
    })
    .filter(mq => mq.minWidth <= width)
    .sort((a, b) => a.minWidth - b.minWidth)
    .map(mq => mq.style);
  styles.unshift(defaultStyle);
  return styles;
}

function merge<TItem>(array: TItem[]): TItem {
  return array.reduce((previousItem, currentItem) => {
    return {
      ...previousItem,
      ...currentItem
    };
  });
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

function makeStyleOverrides(style: T.LayerStyle, refs: T.Refs) {
  if (style.overrides == null) {
    return {};
  }
  const result = {} as any;
  for (let override of style.overrides) {
    result[override.pseudoClass] = makeTextLayerStyle(override.style, refs);
  }
  return result;
}

function makeTextLayerStyle(style: T.LayerStyle, refs: T.Refs) {
  return {
    display: style.display,
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
    textAlign: style.textAlign,
    textDecoration: textDecorationToCss(style),
    ...makeStyleOverrides(style, refs)
  };
}

function makeDisplayStyle(style: T.Display) {
  if (style.display === "flex") {
    return {
      display: "flex",
      flexDirection: style.flexDirection,
      flexWrap: style.flexWrap,
      justifyContent: style.justifyContent,
      alignItems: style.alignItems,
      alignContent: style.alignContent
    };
  }

  return {
    display: style.display
  };
}

function makeContainerLayerStyle(
  style: T.LayerStyle,
  refs: T.Refs
): InterpolationWithTheme<any> {
  return {
    ...makeDisplayStyle(style),
    ...makeDimensionsStyle(style),
    ...makeMarginStyle(style),
    ...makePaddingStyle(style),
    ...makeBackgroundStyle(style, refs.colors)
  };
}

function makeLayerStyle(
  layer: T.Layer,
  refs: T.Refs,
  width: number
): InterpolationWithTheme<any> {
  const styles = getLayerStyles(
    layer.style,
    layer.mediaQueries,
    refs,
    width
  ).map(style => {
    switch (layer.type) {
      case "text":
      case "link":
        return makeTextLayerStyle(style, refs);
      case "container":
        return makeContainerLayerStyle(style, refs);
    }
    assertUnreachable(layer);
  });
  return merge(styles);
}

function makeChildren(layer: T.Layer, refs: T.Refs, width: number) {
  switch (layer.type) {
    case "text":
    case "link":
      return layer.text;
    case "container":
      return layer.children.map(c => (
        <Layer key={c.id} layer={c} refs={refs} width={width} />
      ));
  }
  assertUnreachable(layer);
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

function makeLayerProps(layer: T.Layer, refs: T.Refs, width: number) {
  switch (layer.type) {
    case "text":
    case "container":
      return {
        css: makeLayerStyle(layer, refs, width)
      };
    case "link":
      return {
        css: makeLayerStyle(layer, refs, width),
        href: layer.href
      };
  }
  assertUnreachable(layer);
}

function Layer({ layer, refs, width }: Props) {
  return jsx(
    layer.tag,
    makeLayerProps(layer, refs, width),
    makeChildren(layer, refs, width)
  );
}

export default Layer;
