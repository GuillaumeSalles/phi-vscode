import * as T from "./types";
import { valuesAsArray } from "./helpers/immutable-map";
import { layerTreeToArray } from "./layerUtils";

export function filterComponentsWhenLayer(
  refs: T.Refs,
  layerPredicate: (layer: T.Layer) => boolean
) {
  return valuesAsArray(refs.components).filter(component =>
    layerTreeToArray(component.layout).some(layerPredicate)
  );
}
