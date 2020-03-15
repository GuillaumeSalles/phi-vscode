import * as T from "./types";
import { assertUnreachable, flat } from "./utils";

export function canHaveChildren(
  layer: T.Layer
): layer is T.ContainerLayer | T.LinkLayer {
  return layer.type === "container" || layer.type === "link";
}

export function layerTypeToName(type: T.LayerType): string {
  switch (type) {
    case "text":
      return "text";
    case "link":
      return "link";
    case "container":
      return "container";
    case "image":
      return "image";
    case "component":
      return "component";
  }
  assertUnreachable(type);
}

export function findLayerById(root: T.Layer, id: string): T.Layer | undefined {
  if (root.id === id) {
    return root;
  }

  if (canHaveChildren(root)) {
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

  if (canHaveChildren(rootLayer)) {
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
    return result.concat(flat(root.children.map(layerTreeToArray)));
  }
  return result;
}

export function isLayerUsingRef(
  layer: T.Layer,
  refId: string,
  isUsingRef: (style: T.LayerStyle, refId: string) => boolean
): boolean {
  return [layer.style, ...layer.mediaQueries.map(mq => mq.style)].some(style =>
    isUsingRef(style, refId)
  );
}

export function getComponentOrThrow(
  componentId: string,
  refs: T.Refs
): T.Component {
  const component = refs.components.get(componentId);
  if (component == null) {
    throw new Error(`Component with id: "${componentId}" not found`);
  }
  return component;
}

export function isComponentLayer(layer: T.Layer): layer is T.ComponentLayer {
  return layer.type === "component";
}
