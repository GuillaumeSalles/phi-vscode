import * as T from "@phi/shared";

function componentToCss(component: T.Component, refs: T.Refs) {
  return T.layerTreeToArray(component.layout)
    .map(layer => T.layerToCss(T.kebabToPascal(component.name), layer, refs))
    .join("\n\n");
}

export function phiToCss(data: any) {
  const components = T.arrayToMap(data.components) as T.ComponentMap;
  const refs: T.Refs = {
    breakpoints: T.arrayToMap(data.breakpoints) as T.BreakpointsMap,
    colors: T.arrayToMap(data.colors) as T.ColorsMap,
    fontSizes: T.arrayToMap(data.fontSizes) as T.FontSizesMap,
    fontFamilies: T.arrayToMap(data.fontFamilies) as T.FontFamiliesMap,
    components,
    // TODO: Refactor project state to not file name and isSaved in refs
    isSaved: true,
    fileName: "",
    artboards: new Map(),
    uiState: { type: "typography" }
  };

  return Array.from(components.values())
    .map(component => componentToCss(component, refs))
    .join("\n\n");
}

export default function cssLoader(source: string) {
  return phiToCss(JSON.parse(source));
}
