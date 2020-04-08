import * as T from "./types";

export const layerTypes: T.LayerType[] = [
  "container",
  "text",
  "link",
  "image",
  "component",
];

export const positionList: T.PositionProperty[] = ["relative", "absolute"];

export const flexDirectionList: T.FlexDirection[] = [
  "column",
  "row",
  "column-reverse",
  "row-reverse",
];

export const flexWrapList: T.FlexWrap[] = ["nowrap", "wrap", "wrap-reverse"];

export const justifyContentList: T.JustifyContent[] = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
];

export const alignItemsList: T.AlignItems[] = [
  "stretch",
  "flex-start",
  "flex-end",
  "center",
  "baseline",
];

export const alignContentList: T.AlignContent[] = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "stretch",
];

export const borderStyleList: T.BorderStyle[] = [
  "none",
  "hidden",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
];

export const propertyTypes: T.ComponentPropType[] = ["text"];
