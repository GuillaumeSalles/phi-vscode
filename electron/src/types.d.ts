import { Refs } from "@phi/shared";

export type RefType = "fontFamilies" | "fontSizes" | "breakpoints" | "colors";

export type UpdateRef = {
  type: "updateRef";
  refId: string;
  refType: RefType;
  newRef: any; // TODO: Type properly
};

export type DeleteRef = {
  type: "deleteRef";
  refType: RefType;
  refId: string;
};

export type GoTo = {
  type: "goTo";
  to: UIState;
};

export type InitProject = {
  type: "initProject";
  refs: Refs;
};

export type AddComponentProp = {
  type: "addComponentProp";
  componentId: string;
  prop: string;
};

export type DeleteComponentProp = {
  type: "deleteComponentProp";
  componentId: string;
  prop: string;
};

export type EditComponentProp = {
  type: "editComponentProp";
  componentId: string;
  oldProp: string;
  newProp: string;
};

export type AddComponent = {
  type: "addComponent";
  componentId: string;
  name: string;
};

export type RenameComponent = {
  type: "renameComponent";
  componentId: string;
  name: string;
};

export type DeleteComponent = {
  type: "deleteComponent";
  componentId: string;
};

export type AddComponentExample = {
  type: "addComponentExample";
  name: string;
  componentId: string;
};

export type DeleteComponentExample = {
  type: "deleteComponentExample";
  id: string;
  componentId: string;
};

export type UpdateComponentExampleProp = {
  type: "updateComponentExampleProp";
  prop: string;
  value: string;
  exampleId: string;
  componentId: string;
};

export type AddLayer = {
  type: "addLayer";
  componentId: string;
  parentLayerId?: string;
  layerType: LayerType;
  layerId: string;
  layerComponentId?: string;
};

export type DeleteLayer = {
  type: "deleteLayer";
  componentId: string;
  layerId: string;
};

export type SelectLayer = {
  type: "selectLayer";
  layerId?: string;
};

export type RenameLayer = {
  type: "renameLayer";
  componentId: string;
  layerId: string;
  name: string;
};

export type MoveLayer = {
  type: "moveLayer";
  componentId: string;
  layerId: string;
  parentId: string;
  position: number;
};

export type UpdateLayerProp = {
  type: "updateLayerProp";
  componentId: string;
  layerId: string;
  name: string;
  value: any;
};

export type UpdateLayerTag = {
  type: "updateLayerTag";
  componentId: string;
  layerId: string;
  tag: TextLayerTag;
};

export type UpdateLayerBinding = {
  type: "updateLayerBinding";
  componentId: string;
  layerId: string;
  layerProp: string;
  componentProp: string;
};

export type DeleteLayerBinding = {
  type: "deleteLayerBinding";
  componentId: string;
  layerId: string;
  layerProp: string;
};

export type UpdateLayerStyle = {
  type: "updateLayerStyle";
  style: Partial<LayerStyle>;
};

export type AddMediaQuery = {
  type: "addMediaQuery";
  componentId: string;
  layerId: string;
  mediaQueryId: string;
  breakpointId: string;
};

export type EditComponent = {
  type: "editComponent";
};

export type StopEditComponent = {
  type: "stopEditComponent";
};

export type SetLayerEditorMode = {
  type: "setLayerEditorMode";
  mode: LayerEditorMode;
};

export type HoverLayer = {
  type: "hoverLayer";
  layerId?: string;
};

export type MoveLayerUpOrDown = {
  type: "moveLayerUpOrDown";
  direction: "up" | "down";
};

export type ResizeLayerDirection =
  | "bottom-right"
  | "right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left"
  | "top"
  | "top-right";

export type ResizeLayer = {
  type: "resizeLayer";
  canvasSize: {
    height: number;
    width: number;
  };
  offset: {
    x: number;
    y: number;
  };
  direction: ResizeLayerDirection;
};

export type GlobalShortcutAction = {
  type: "globalShortcutAction";
  key: string;
  metaKey: boolean;
};

export type ResetAction = {
  type: "reset";
  refs: Refs;
};

export type SelectMediaQuery = {
  type: "selectMediaQuery";
  mediaQuery?: string;
};

export type Action =
  | GoTo
  | GlobalShortcutAction
  | ResetAction
  | UpdateRef
  | DeleteRef
  | InitProject
  | AddLayer
  | DeleteLayer
  | RenameLayer
  | MoveLayer
  | MoveLayerUpOrDown
  | SelectMediaQuery
  | SelectLayer
  | HoverLayer
  | ResizeLayer
  | EditComponent
  | StopEditComponent
  | UpdateLayerProp
  | UpdateLayerTag
  | UpdateLayerBinding
  | DeleteLayerBinding
  | AddComponentProp
  | EditComponentProp
  | DeleteComponentProp
  | AddComponent
  | RenameComponent
  | DeleteComponent
  | AddComponentExample
  | DeleteComponentExample
  | UpdateComponentExampleProp
  | UpdateLayerStyle
  | AddMediaQuery
  | SetLayerEditorMode;

export type ActionType = Action["type"];

export type ApplyAction = (action: Action) => void;

export * from "@phi/shared";
