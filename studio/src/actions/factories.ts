import * as T from "../types";

export function selectLayer(layerId?: string): T.SelectLayer {
  return {
    type: "selectLayer",
    layerId
  };
}
