export function getContrastColor(hex: string) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  // http://stackoverflow.com/a/3943023/112731
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
}

export function listToEntries<TKey extends string>(
  items: TKey[]
): Array<[TKey, string]> {
  return items.map(item => [item, item]);
}

export function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

export function flat<T>(arrOfArr: T[][]): T[] {
  const result = [];
  for (let arr of arrOfArr) {
    for (let item of arr) {
      result.push(item);
    }
  }
  return result;
}

const keysToBlock = new Set([
  "Backspace",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight"
]);

/**
 * I feel it's not the right way to handle events...
 */
export function stopKeydownPropagationIfNecessary(event: React.KeyboardEvent) {
  if (keysToBlock.has(event.key)) {
    event.stopPropagation();
  }
}
