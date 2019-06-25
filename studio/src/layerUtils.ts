import * as T from "./types";

export function layerTypeToName(type: T.LayerType): string {
  switch (type) {
    case "text":
      return "Text";
    case "container":
      return "Container";
    default:
      throw new Error("Unkwown layer type");
  }
}

export function findLayerById(root: T.Layer, id: string): T.Layer | undefined {
  if (root.id === id) {
    return root;
  }

  if (root.type === "container") {
    return root.children.find(child => findLayerById(child, id));
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
