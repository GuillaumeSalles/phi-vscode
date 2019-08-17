export type ComponentMap = Map<string, Component>;

export type Component = {
  name: string;
  layout?: Layer;
  props: ComponentProp[];
};

export type ComponentProp = {
  name: string;
  type: ComponentPropType;
};

export type ComponentPropType = "text";

export interface ILayer {
  id: string;
  name: string;
  style: LayerStyle;
  mediaQueries: Array<MediaQuery>;
  bindings: Bindings;
}

export type Bindings = {
  [prop: string]: Binding;
};

export type Binding = {
  propName: string;
};

export type Layer =
  | ContainerLayer
  | TextLayer
  | LinkLayer
  | ImageLayer
  | ComponentLayer;

export type LayerType = "container" | "text" | "link" | "image" | "component";

export type ComponentPropertiesValues = { [name: string]: any };

export interface ComponentLayer extends ILayer {
  type: "component";
  componentId: string;
  props: ComponentPropertiesValues;
}

export interface ContainerLayer extends ILayer {
  type: "container";
  tag: "div";
  children: Layer[];
}

export interface ImageLayer extends ILayer {
  type: "image";
  tag: "img";
  props: ImageProps;
}

export type ImageProps = {
  src: string;
  alt: string;
  height?: string;
  width?: string;
};

export interface TextLayer extends ILayer {
  type: "text";
  tag: TextLayerTag;
  props: TextLayerProps;
}

type TextLayerProps = {
  content: string;
};

export interface LinkLayer extends ILayer {
  type: "link";
  tag: "a";
  children: Layer[];
  props: LinkLayerProps;
}

export type LinkLayerProps = {
  content: string;
  href: string;
};

type StyleOverride = {
  id: string;
  pseudoClass: string;
  // layerId?: string;
  style: LayerStyle;
};

type LayerStyle = Typography &
  Display &
  Dimensions &
  Margin &
  Padding & {
    overrides?: StyleOverride[];
    opacity?: number;
    backgroundColor?: Color;
    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderBottomRightRadius?: string;
    borderBottomLeftRadius?: string;

    borderTopWidth?: string;
    borderRightWidth?: string;
    borderBottomWidth?: string;
    borderLeftWidth?: string;
    borderTopStyle?: string;
    borderRightStyle?: string;
    borderBottomStyle?: string;
    borderLeftStyle?: string;
    borderTopColor?: Color;
    borderRightColor?: Color;
    borderBottomColor?: Color;
    borderLeftColor?: Color;
  };

export type Display = {
  display?: DisplayProperty;
  flexDirection?: FlexDirection;
  flexWrap?: FlexWrap;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  alignContent?: AlignContent;
};

export type DisplayProperty = "none" | "block" | "inline" | "flex";

export type MediaQuery = {
  id: string;
  minWidth: Ref;
  style: LayerStyle;
};

export type Typography = {
  letterSpacing?: Length;
  lineHeight?: number;
  color?: Color;
  fontSize?: Ref;
  fontFamily?: Ref;
  fontWeight?: Ref;
  textAlign?: TextAlignProperty;
  textDecoration?: TextDecoration;
};

export type TextDecoration = {
  isUnderlined: boolean;
  isStrikedThrough: boolean;
};

export type FlexDirection = "column" | "row" | "column-reverse" | "row-reverse";

export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

export type AlignItems =
  | "stretch"
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline";

export type AlignContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "stretch";

export type BorderStyle =
  | "none"
  | "hidden"
  | "dotted"
  | "dashed"
  | "solid"
  | "double"
  | "groove"
  | "ridge"
  | "inset"
  | "outset";

export type TextLayerTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span";

export type TextAlignProperty = "left" | "center" | "right" | "justify";

export type Dimensions = {
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
};

export type Margin = {
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
};

export type Padding = {
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
};

export type Length = {
  type: "px";
  value: number;
};

export type Color = Ref | HexColor;

export type Ref = {
  type: "ref";
  id: string;
};

export type HexColor = {
  type: "hex";
  value: string;
};

export type ColorsMap = Map<string, ColorDefinition>;
export type ColorDefinition = {
  name: string;
  value: string;
};

export type FontSizesMap = Map<string, FontSizeDefinition>;
export type FontSizeDefinition = { name: string; value: string };

export type FontFamiliesMap = Map<string, FontFamilyDefinition>;
export type FontFamilyDefinition = { name: string; value: string };

export type FontWeightsMap = Map<string, FontWeightDefinition>;
export type FontWeightDefinition = {
  name: string;
  value: number;
};

export type LineHeightMap = Map<string, LineHeightDefinition>;
export type LineHeightDefinition = {
  name: string;
  value: number;
};

export type BreakpointsMap = Map<string, BreakpointDefinition>;
export type BreakpointDefinition = { name: string; value: Length };

export type Refs = {
  isSaved: boolean;
  fileName: string | undefined;
  colors: ColorsMap;
  fontSizes: FontSizesMap;
  fontFamilies: FontFamiliesMap;
  fontWeights: FontWeightsMap;
  lineHeights: LineHeightMap;
  breakpoints: BreakpointsMap;
  components: ComponentMap;
};

type AddComponentProp = {
  type: "addComponentProp";
  componentId: string;
  prop: string;
};

type DeleteComponentProp = {
  type: "deleteComponentProp";
  componentId: string;
  prop: string;
};

type EditComponentProp = {
  type: "editComponentProp";
  componentId: string;
  oldProp: string;
  newProp: string;
};

type Action = AddComponentProp | EditComponentProp | DeleteComponentProp;
