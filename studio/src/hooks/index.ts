import { useState } from "react";

export function useToggle(defaultValue: boolean) {
  const [isActive, setValue] = useState(defaultValue);
  return {
    isActive: isActive,
    activate: () => setValue(true),
    deactivate: () => setValue(false)
  };
}
