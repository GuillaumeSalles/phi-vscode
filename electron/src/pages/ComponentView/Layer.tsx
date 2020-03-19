/** @jsx jsx */
import { jsx, InterpolationWithTheme } from "@emotion/core";
import * as T from "../../types";
import { assertUnreachable } from "../../utils";
import { getComponentOrThrow } from "../../layerUtils";

type Props = {
  layer: T.Layer;
  refs: T.Refs;
  width: number;
  props: T.LayerProps;
  domRefs?: Map<string, HTMLBaseElement>;
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
      throw new Error(`Invalid color ${JSON.stringify(color)}`);
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
) {
  if (fontFamily == null) {
    return undefined;
  }
  const ref = fontFamilies.get(fontFamily.id);
  if (ref == null) {
    throw new Error("Invalid fontsize ref");
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

function colorToCss(color: T.Color | undefined, refs: T.Refs) {
  return color ? colorToString(color, refs.colors) : undefined;
}

function makeTextLayerStyle(style: T.LayerStyle, refs: T.Refs) {
  return {
    position: style.position || "relative",
    top: style.top,
    right: style.right,
    bottom: style.bottom,
    left: style.left,
    ...makeDisplayStyle(style),
    ...makeDimensionsStyle(style),
    ...makeMarginStyle(style),
    ...makePaddingStyle(style),
    color: colorToCss(style.color, refs),
    backgroundColor: colorToCss(style.backgroundColor, refs),
    opacity: style.opacity != null ? style.opacity : 1,
    borderTopLeftRadius: style.borderTopLeftRadius,
    borderTopRightRadius: style.borderTopRightRadius,
    borderBottomRightRadius: style.borderBottomRightRadius,
    borderBottomLeftRadius: style.borderBottomLeftRadius,
    borderTopWidth: style.borderTopWidth,
    borderRightWidth: style.borderRightWidth,
    borderBottomWidth: style.borderBottomWidth,
    borderLeftWidth: style.borderLeftWidth,
    borderTopStyle: style.borderTopStyle,
    borderRightStyle: style.borderRightStyle,
    borderBottomStyle: style.borderBottomStyle,
    borderLeftStyle: style.borderLeftStyle,
    borderTopColor: colorToCss(style.borderTopColor, refs),
    borderRightColor: colorToCss(style.borderRightColor, refs),
    borderBottomColor: colorToCss(style.borderBottomColor, refs),
    borderLeftColor: colorToCss(style.borderLeftColor, refs),
    fontSize: fontSizeToString(style.fontSize, refs.fontSizes),
    fontFamily: fontFamilyToString(style.fontFamily, refs.fontFamilies),
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: lengthToCss(style.letterSpacing, "0"),
    textAlign: style.textAlign,
    textDecoration: textDecorationToCss(style),
    ...makeStyleOverrides(style, refs)
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
  ).map(style => makeTextLayerStyle(style, refs));
  return merge(styles);
}

function contentOrBindingContent(
  layer: T.TextLayer | T.LinkLayer,
  props: T.LayerProps
) {
  return layer.bindings.content != null &&
    props[layer.bindings.content.propName] != null
    ? props[layer.bindings.content.propName]
    : layer.props.content;
}

function makeChildren(
  layer: T.Layer,
  refs: T.Refs,
  width: number,
  props: T.LayerProps,
  domRefs?: Map<string, HTMLBaseElement>
) {
  switch (layer.type) {
    case "image":
      return null;
    case "text":
      return contentOrBindingContent(layer, props);
    case "link":
      return layer.children.length > 0
        ? layer.children.map(c => (
            <Layer
              key={c.id}
              layer={c}
              refs={refs}
              width={width}
              props={props}
              domRefs={domRefs}
            />
          ))
        : contentOrBindingContent(layer, props);
    case "container":
      return layer.children.map(c => (
        <Layer
          key={c.id}
          layer={c}
          refs={refs}
          width={width}
          props={props}
          domRefs={domRefs}
        />
      ));
    case "component":
      return new Error(
        "Can't create children proprerty for a component layer. This is a bug"
      );
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
    marginTop: layer.marginTop,
    marginRight: layer.marginRight,
    marginBottom: layer.marginBottom,
    marginLeft: layer.marginLeft
  };
}

function makePaddingStyle(layer: T.Padding) {
  return {
    paddingTop: layer.paddingTop,
    paddingRight: layer.paddingRight,
    paddingBottom: layer.paddingBottom,
    paddingLeft: layer.paddingLeft
  };
}

/**
 * TODO: Make it robust
 */
function imagePropToSrc(src: string | undefined) {
  const fileDir = (window as any).__vscode__?.fileDir;

  if (src == null) {
    return undefined;
  }

  if (src.startsWith("http")) {
    return src;
  }

  if (fileDir != null && fileDir.startsWith("file:///")) {
    return `vscode-resource://file///${fileDir.slice(8)}/${src}`;
  }

  return src;
}

function makeLayerProps(layer: T.Layer, refs: T.Refs, width: number) {
  switch (layer.type) {
    case "image":
      const src = imagePropToSrc(layer.props.src);
      return {
        crossOrigin: "anonymous",
        src,
        height: layer.props.height,
        width: layer.props.width,
        alt: layer.props.alt
      };
    case "text":
    case "container":
      return {};
    case "link":
      return {
        href: layer.props.href
      };
    case "component":
      return layer.props;
  }
  assertUnreachable(layer);
}

function applyBindings(
  props: any,
  layer: T.Layer,
  componentProps: T.LayerProps
) {
  const newProps = {
    ...props
  };
  for (let prop in layer.bindings) {
    const value = componentProps[layer.bindings[prop].propName];

    if (value != null && value !== "") {
      if (prop === "src" && layer.type === "image") {
        newProps[prop] = imagePropToSrc(value);
      } else {
        newProps[prop] = value;
      }
    }
  }
  return newProps;
}

export function makeJsxLayerProps(
  layer: T.Layer,
  refs: T.Refs,
  width: number,
  props: any,
  domRefs?: Map<string, HTMLBaseElement>
) {
  const css = makeLayerStyle(layer, refs, width);

  const result = applyBindings(
    makeLayerProps(layer, refs, width),
    layer,
    props
  );
  result.css = css;
  result.ref = domRefs
    ? (inst: HTMLBaseElement) => {
        inst === null ? domRefs.delete(layer.id) : domRefs.set(layer.id, inst);
      }
    : undefined;
  result.key = layer.id;
  return result;
}

function Layer({ layer, refs, width, props, domRefs }: Props) {
  if (layer.type === "component") {
    const component = getComponentOrThrow(layer.componentId, refs);
    if (component.layout == null) {
      return null;
    }

    return (
      <Layer
        layer={component.layout}
        refs={refs}
        width={width}
        props={makeJsxLayerProps(layer, refs, width, props, undefined)}
      />
    );
  }
  return jsx(
    layer.tag,
    makeJsxLayerProps(layer, refs, width, props, domRefs),
    makeChildren(layer, refs, width, props, domRefs)
  );
}

export default Layer;
