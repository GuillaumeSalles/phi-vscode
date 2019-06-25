import React, { useState } from "react";
export { default as FormInput } from "./FormInput";
export { default as FormNumberInput } from "./FormNumberInput";

type FormEntry<TValue> = {
  value: TValue;
  inputProps: {
    value: TValue;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | undefined;
  };
  isValid: () => boolean;
  displayValidation: () => void;
};

function useFormEntry<TValue>(
  defaultValue: TValue,
  validate: (value: TValue) => string | undefined,
  getValueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) => TValue
): FormEntry<TValue> {
  const [value, setValue] = useState(defaultValue);
  const [isValidating, setIsValidating] = useState(false);
  return {
    inputProps: {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(getValueFromEvent(e));
      },
      onBlur: () => {
        setIsValidating(true);
      },
      error: isValidating ? validate(value) : undefined
    },
    value: value,
    isValid: () => validate(value) === undefined,
    displayValidation: () => {
      if (!isValidating) {
        setIsValidating(true);
      }
    }
  };
}

export function useStringFormEntry(
  defaultValue: string,
  validate: (value: string) => string | undefined
) {
  return useFormEntry(defaultValue, validate, e => e.target.value);
}

export function useNumberFormEntry(
  defaultValue: number,
  validate: (value: number) => string | undefined
) {
  return useFormEntry(defaultValue, validate, e => e.target.valueAsNumber);
}

export function useForm(
  entries: FormEntry<any>[],
  onSubmit: () => void
): () => void {
  return () => {
    if (entries.every(entry => entry.isValid())) {
      onSubmit();
    } else {
      for (let entry of entries) {
        entry.displayValidation();
      }
    }
  };
}
