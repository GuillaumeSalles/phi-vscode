export type ComponentMap = Map<string, Component>;

export type Component = {
  name: string;
  layout?: Layer;
  props: ComponentProp[];
  examples: ComponentExample[];
};

export type ComponentExample = {
  id: string;
  name: string;
  props: LayerProps;
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
  props: LayerProps;
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

export type LayerProps = { [name: string]: any };

export interface ComponentLayer extends ILayer {
  type: "component";
  componentId: string;
}

export interface ContainerLayer extends ILayer {
  type: "container";
  tag: "div";
  children: Layer[];
}

export interface ImageLayer extends ILayer {
  type: "image";
  tag: "img";
}

export interface TextLayer extends ILayer {
  type: "text";
  tag: TextLayerTag;
}

export interface LinkLayer extends ILayer {
  type: "link";
  tag: "a";
  children: Layer[];
}

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

    position?: PositionProperty;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };

export type PositionProperty = "absolute" | "relative";

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
  fontWeight?: string;
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

export type BreakpointsMap = Map<string, BreakpointDefinition>;
export type BreakpointDefinition = { name: string; value: Length };

export type ArtboardsMap = Map<string, ArtboardDefinition>;
export type ArtboardDefinition = {
  name: string;
  width: string;
  height: string;
  backgroundColor: string;
};

export type Refs = {
  isSaved: boolean;
  selectedLayerId?: string;
  fileName: string | undefined;
  artboards: ArtboardsMap;
  colors: ColorsMap;
  fontSizes: FontSizesMap;
  fontFamilies: FontFamiliesMap;
  breakpoints: BreakpointsMap;
  components: ComponentMap;
};

type InitProject = {
  type: "initProject";
  refs: Refs;
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

type RenameComponent = {
  type: "renameComponent";
  componentId: string;
  name: string;
};

type AddComponentExample = {
  type: "addComponentExample";
  name: string;
  componentId: string;
};

type DeleteComponentExample = {
  type: "deleteComponentExample";
  id: string;
  componentId: string;
};

type UpdateComponentExampleProp = {
  type: "updateComponentExampleProp";
  prop: string;
  value: string;
  exampleId: string;
  componentId: string;
};

type AddLayer = {
  type: "addLayer";
  componentId: string;
  parentLayerId?: string;
  layerType: LayerType;
  layerId: string;
  layerComponentId?: string;
};

type DeleteLayer = {
  type: "deleteLayer";
  componentId: string;
  layerId: string;
};

type SelectLayer = {
  type: "selectLayer";
  layerId?: string;
};

type RenameLayer = {
  type: "renameLayer";
  componentId: string;
  layerId: string;
  name: string;
};

type MoveLayer = {
  type: "moveLayer";
  componentId: string;
  layerId: string;
  parentId: string;
  position: number;
};

type UpdateLayerProp = {
  type: "updateLayerProp";
  componentId: string;
  layerId: string;
  name: string;
  value: any;
};

type UpdateLayerTag = {
  type: "updateLayerTag";
  componentId: string;
  layerId: string;
  tag: TextLayerTag;
};

type Action =
  | InitProject
  | AddLayer
  | DeleteLayer
  | RenameLayer
  | MoveLayer
  | SelectLayer
  | UpdateLayerProp
  | UpdateLayerTag
  | AddComponentProp
  | EditComponentProp
  | DeleteComponentProp
  | RenameComponent
  | AddComponentExample
  | DeleteComponentExample
  | UpdateComponentExampleProp;
