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

export function refsToJson(current: T.Refs) {
  return JSON.stringify(
    {
      uiState: current.uiState,
      colors: mapToArray(current.colors),
      fontSizes: mapToArray(current.fontSizes),
      fontFamilies: mapToArray(current.fontFamilies),
      breakpoints: mapToArray(current.breakpoints),
      components: mapToArray(current.components)
    },
    null,
    2
  );
}

function mapToArray(map: Map<string, any>) {
  return Array.from(map.entries()).map(entry => ({
    id: entry[0],
    ...entry[1]
  }));
}

export function uiStateComponentOrThrow(refs: T.Refs): T.UIStateComponent {
  if (refs.uiState.type !== "component") {
    throw new Error(
      `Expected uiState.type to be "component" but got ${refs.uiState.type}`
    );
  }

  return refs.uiState;
}
