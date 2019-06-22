import * as T from "./types";

export function findLayerById(root: T.Layer, id: string): T.Layer | undefined {
  if (root.id === id) {
    return root;
  }

  if (root.type === "container") {
    return root.children.find(child => findLayerById(child, id));
  }

  return;
}
