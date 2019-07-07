import * as T from "./types";

export function layerTypeToName(type: T.LayerType): string {
  switch (type) {
    case "text":
      return "text";
    case "container":
      return "container";
    default:
      throw new Error("Unkwown layer type");
  }
}

export function findLayerById(root: T.Layer, id: string): T.Layer | undefined {
  if (root.id === id) {
    return root;
  }

  if (root.type === "container") {
    for (const child of root.children) {
      const layer = findLayerById(child, id);
      if (layer) {
        return layer;
      }
    }
  }

  return;
}

export function updateLayer(
  rootLayer: T.Layer | undefined,
  newLayer: T.Layer
): T.Layer {
  if (!rootLayer) {
    return newLayer;
  }

  if (rootLayer.id === newLayer.id) {
    return newLayer;
  }

  if (rootLayer.type === "container") {
    return {
      ...rootLayer,
      children: rootLayer.children.map(child => updateLayer(child, newLayer))
    };
  }

  return rootLayer;
}

export function layerTreeToArray(root: T.Layer | undefined): T.Layer[] {
  if (!root) {
    return [];
  }
  const result = [root];
  if (root.type === "container") {
    return result.concat(root.children.map(layerTreeToArray).flat());
  }
  return result;
}

export function getTextLayerStyles(layer: T.TextLayer): T.TextLayerStyle[] {
  return [layer.style, ...layer.mediaQueries.map(mq => mq.style)];
}

export function getContainerLayerStyles(
  layer: T.ContainerLayer
): T.ContainerLayerStyle[] {
  return [layer.style, ...layer.mediaQueries.map(mq => mq.style)];
}

export function isLayerUsingRef(
  layer: T.Layer,
  refId: string,
  isTextStyleUsingRef: (style: T.TextLayerStyle, refId: string) => boolean,
  isContainerStyleUsingRef: (
    style: T.ContainerLayerStyle,
    refId: string
  ) => boolean
): boolean {
  switch (layer.type) {
    case "text":
      return getTextLayerStyles(layer).some(style =>
        isTextStyleUsingRef(style, refId)
      );
    case "container":
      return getContainerLayerStyles(layer).some(style =>
        isContainerStyleUsingRef(style, refId)
      );
    default:
      throw new Error("Unkown layer type");
  }
}
