export const units = ["px", "%"];
export type Unit = "px" | "%";
export type Length = {
  value: number;
  unit?: Unit;
};

export function parseLength(
  value: string | undefined,
  onlyPositive: boolean
): Length | undefined {
  if (value == null) {
    return undefined;
  }
  let result = "";
  let decimal = false;
  let i = 0;
  if (value[0] === "-") {
    result += "-";
    i++;
  }
  for (; i < value.length; i++) {
    const char = value[i];
    if (decimal === false && char === ".") {
      result += char;
      decimal = true;
    } else if (char >= "0" && char <= "9") {
      result += char;
    } else {
      break;
    }
  }
  const suffix = value.slice(i);
  if (result.length === 0) {
    return undefined;
  }
  const parsedValue = Number.parseFloat(result);
  return {
    value: onlyPositive && parsedValue < 0 ? 0 : parsedValue,
    unit: units.includes(suffix) ? (suffix as Unit) : undefined
  };
}

export function lengthToString(length: Length): string {
  return `${length.value}${length.unit ? length.unit : "px"}`;
}

export function increment(value: string | undefined): Length | undefined {
  const length = parseLength(value, false);
  if (length == null) {
    return undefined;
  }
  return {
    unit: length.unit,
    value: length.value + 1
  };
}

export function decrement(
  value: string | undefined,
  onlyPositive: boolean
): Length | undefined {
  const length = parseLength(value, onlyPositive);
  if (length == null) {
    return undefined;
  }

  if (onlyPositive && length.value < 1) {
    return {
      unit: length.unit,
      value: 0
    };
  }

  return {
    unit: length.unit,
    value: length.value - 1
  };
}
