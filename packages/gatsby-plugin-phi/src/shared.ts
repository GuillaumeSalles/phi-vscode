import * as T from "../../../electron/src/types";

function flatten<T>(arrOfArr: T[][]) {
  const result = [];
  for (let arr of arrOfArr) {
    for (let item of arr) {
      result.push(item);
    }
  }
  return result;
}

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
  if (root.type === "container" || root.type === "link") {
    return result.concat(flatten(root.children.map(layerTreeToArray)));
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
