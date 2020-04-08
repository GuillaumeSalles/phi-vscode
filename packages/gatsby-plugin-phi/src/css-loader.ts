import * as T from "@phi/shared";
import { layerTreeToArray, layerToCss, jsonToRefs } from "@phi/shared";

function componentToCss(component: T.Component, refs: T.Refs) {
  return layerTreeToArray(component.layout)
    .map((layer) => layerToCss(T.kebabToPascal(component.name), layer, refs))
    .join("\n\n");
}

export function phiToCss(data: any) {
  const refs: T.Refs = jsonToRefs(data);

  return Array.from(refs.components.values())
    .map((component) => componentToCss(component, refs))
    .join("\n\n");
}

export default function cssLoader(source: string) {
  return phiToCss(JSON.parse(source));
}
