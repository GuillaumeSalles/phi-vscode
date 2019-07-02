import { valuesAsArray } from "../helpers/immutable-map";
import * as T from "../types";
import { layerTreeToArray } from "../layerUtils";

const kebabCaseRegex = new RegExp("^([a-z][a-z0-9]*)(-[a-z0-9]+)*$");

function validateVariableName(
  value: string,
  existingRefId: string | null,
  map: Map<string, { name: string }>,
  prefix: string
) {
  if (value.length === 0) {
    return `${prefix} name is required`;
  }
  if (!kebabCaseRegex.test(value)) {
    return `${prefix} name should not start with number and should follow the "kebab case" format`;
  }
  if (existingRefId) {
    const currentRef = map.get(existingRefId);
    if (currentRef && currentRef.name === value) {
      return;
    }
  }
  if (valuesAsArray(map).some(b => b.name === value)) {
    return `${prefix} name must be unique`;
  }
}

export function validateBreakpointName(
  value: string,
  breakpoints: T.BreakpointsMap
): string | undefined {
  return validateVariableName(value, null, breakpoints, "Breakpoint");
}

export function validateBreakpointValue(value: number | undefined) {
  if (value === undefined) {
    return "Breakpoint value is required";
  }
  if (value <= 0) {
    return "Breakpoint should be greater than 0px";
  }
}

export function validateColorName(
  value: string,
  existingRefId: string | null,
  colors: T.ColorsMap
): string | undefined {
  return validateVariableName(value, existingRefId, colors, "Color");
}

function isHexRGB(str: string) {
  return /^#[0-9a-f]{6}$/i.test(str);
}

export function validateColorValue(value: string): string | undefined {
  if (value.length === 0) {
    return "Color value is required";
  }
  if (!isHexRGB(value)) {
    return "Color value should follow the pattern #AABBCC";
  }
}

export function validateFontFamilyName(
  value: string,
  fontFamilies: T.FontFamiliesMap
): string | undefined {
  return validateVariableName(value, null, fontFamilies, "Font family");
}

export function validateFontSizeName(
  value: string,
  fontSizes: T.FontSizesMap
): string | undefined {
  return validateVariableName(value, null, fontSizes, "Font size");
}

export function validateComponentName(
  value: string,
  components: T.ComponentMap
): string | undefined {
  return validateVariableName(value, null, components, "Component");
}

export function validateLayerName(
  value: string,
  root: T.Layer | undefined
): string | undefined {
  const layersArray = new Map(
    layerTreeToArray(root).map(layer => [layer.id, layer])
  );
  return validateVariableName(value, null, layersArray, "Layer");
}
