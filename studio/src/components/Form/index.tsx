import React, { useState } from "react";
import { useToggle } from "../../hooks";
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
  displayValidation: (isVisible: boolean) => void;
  setValue: (value: TValue) => void;
  reset: () => void;
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
    displayValidation: (isVisible: boolean) => {
      setIsValidating(isVisible);
    },
    setValue,
    reset: () => {
      setValue(defaultValue);
      setIsValidating(false);
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
  defaultValue: number | undefined,
  validate: (value: number | undefined) => string | undefined
) {
  return useFormEntry(defaultValue, validate, e => e.target.valueAsNumber);
}

type Form = {
  submit: () => void;
  reset: () => void;
};

export function useForm(entries: FormEntry<any>[], onSubmit: () => void): Form {
  return {
    submit: () => {
      if (entries.every(entry => entry.isValid())) {
        onSubmit();
      } else {
        for (const entry of entries) {
          entry.displayValidation(true);
        }
      }
    },
    reset: () => {
      for (const entry of entries) {
        entry.reset();
      }
    }
  };
}

export function useDialogForm(entries: FormEntry<any>[], onSubmit: () => void) {
  const toggle = useToggle(false);
  const form = useForm(entries, onSubmit);
  return {
    isOpen: toggle.isActive,
    open: () => {
      form.reset();
      toggle.activate();
    },
    close: () => {
      toggle.deactivate();
    },
    submit: () => {
      form.submit();
      toggle.deactivate();
    }
  };
}
