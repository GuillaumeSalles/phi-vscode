import * as T from "../../../studio/src/types";

export function arrayToMap(array: any[]) {
  return new Map(
    array.map((color: any) => {
      const { id, ...rest } = color;
      return [id, rest];
    })
  );
}

export function layerTreeToArray(root: T.Layer | undefined): T.Layer[] {
  if (!root) {
    return [];
  }
  const result = [root];
  if (root.type === "container") {
    return result.concat(root.children.map(layerTreeToArray).flat());
  }
  return result;
}

export function kebabToPascal(kebab: string): string {
  return capitalizeFirstLetter(kebabToCamel(kebab));
}

export function kebabToCamel(kebab: string): string {
  let result = "";
  let isMaj = false;
  for (let i = 0; i < kebab.length; i++) {
    const charCode = kebab.charCodeAt(i);
    if (isMaj && charCode >= 97 && charCode <= 122) {
      result += String.fromCharCode(charCode - 32);
      isMaj = false;
    } else if (charCode === 45) {
      // i++;
      isMaj = true;
    } else {
      result += kebab[i];
    }
  }
  return result;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}
