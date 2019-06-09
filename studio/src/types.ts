export type Component = {
  name: string;
  layout: Layer;
};

export type Layer = ContainerLayer | TextLayer;

export type ContainerLayer = {
  type: "container";
  id: string;
  name: string;
  tag: "div";
  flexDirection: "row" | "column";
  children: Layer[];
} & Background &
  Dimensions;

export type TextLayer = {
  type: "text";
  id: string;
  name: string;
  tag: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  text?: string;
  letterSpacing?: LetterSpacing;
  color?: Color;
  fontSize: Ref;
  fontFamily: Ref;
  fontWeight: Ref;
  lineHeight: Ref;
} & Background &
  Dimensions;

export type LetterSpacing = {
  type: "px";
  value: number;
};

export type Dimensions = {
  height?: Length;
  width?: Length;
};

export type Background = {
  backgroundColor?: Color;
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
export type FontSizeDefinition = {
  name: string;
  value: string;
};

export type FontFamiliesMap = Map<string, FontFamilyDefinition>;
export type FontFamilyDefinition = {
  name: string;
  value: string;
};

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
export type BreakpointDefinition = Length;

export type Refs = {
  colors: ColorsMap;
  fontSizes: FontSizesMap;
  fontFamilies: FontFamiliesMap;
  fontWeights: FontWeightsMap;
  lineHeights: LineHeightMap;
};
