import { valuesAsArray } from "../helpers/immutable-map";
import * as T from "../types";

const kebabCaseRegex = new RegExp("^([a-z][a-z0-9]*)(-[a-z0-9]+)*$");

function validateVariableName(
  value: string,
  map: Map<string, { name: string }>,
  prefix: string
) {
  if (value.length === 0) {
    return `${prefix} name is required`;
  }
  if (!kebabCaseRegex.test(value)) {
    return `${prefix} name should not start with number and should follow the "kebab case" format`;
  }
  if (valuesAsArray(map).some(b => b.name === value)) {
    return `${prefix} name must be unique`;
  }
}

export function validateBreakpointName(
  value: string,
  breakpoints: T.BreakpointsMap
): string | undefined {
  return validateVariableName(value, breakpoints, "Breakpoint");
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
  colors: T.ColorsMap
): string | undefined {
  return validateVariableName(value, colors, "Color");
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
  return validateVariableName(value, fontFamilies, "Font family");
}

export function validateFontSizeName(
  value: string,
  fontSizes: T.FontSizesMap
): string | undefined {
  return validateVariableName(value, fontSizes, "Font size");
}

export function validateComponentName(
  value: string,
  components: T.ComponentMap
): string | undefined {
  return validateVariableName(value, components, "Component");
}
