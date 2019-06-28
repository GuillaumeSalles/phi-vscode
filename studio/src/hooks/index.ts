import { useState } from "react";

export function useToggle(defaultValue: boolean) {
  const [isActive, setValue] = useState(defaultValue);
  return {
    isActive: isActive,
    activate: () => setValue(true),
    deactivate: () => setValue(false)
  };
}

export function useStateWithGetter<T>(
  getter: () => T
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T | undefined>(undefined);
  return [
    value === undefined ? getter() : value,
    (newValue: T) => setValue(newValue)
  ];
}
