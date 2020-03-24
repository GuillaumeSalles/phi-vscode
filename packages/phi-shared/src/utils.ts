import * as T from "./types";

export function flatten<T>(arrOfArr: T[][]) {
  const result = [];
  for (let arr of arrOfArr) {
    for (let item of arr) {
      result.push(item);
    }
  }
  return result;
}

export function arrayToMap(array: any[]): Map<string, any> {
  return new Map(
    array.map((item: any) => {
      const { id, ...rest } = item;
      return [id, rest];
    })
  );
}

export function kebabToPascal(kebab: string): string {
  return capitalizeFirstLetter(kebabToCamel(kebab));
}

export function layerTreeToArray(root: T.Layer | undefined): T.Layer[] {
  if (!root) {
    return [];
  }
  const result = [root];
  if (root.type === "container" || root.type === "link") {
    return result.concat(flatten(root.children.map(layerTreeToArray)));
  }
  return result;
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

export function getRefValue<TValue>(item: T.Ref, map: Map<string, TValue>) {
  const ref = map.get(item.id);
  if (!ref) {
    throw new Error("Ref not found");
  }
  return ref;
}

export function jsonToRefs(data: any): T.Refs {
  return {
    isSaved: true,
    fileName: undefined,
    uiState: data.uiState || { type: "typography" },
    artboards: new Map(),
    components: arrayToMap(data.components),
    fontSizes: arrayToMap(data.fontSizes),
    fontFamilies: arrayToMap(data.fontFamilies),
    breakpoints: arrayToMap(data.breakpoints),
    colors: arrayToMap(data.colors)
  };
}
