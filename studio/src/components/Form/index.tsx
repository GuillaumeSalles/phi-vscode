import React, { useState, useRef, useEffect, useCallback } from "react";
export { default as FormInput } from "./FormInput";
export { default as FormNumberInput } from "./FormNumberInput";

type FormEntry<TValue> = {
  value: TValue;
  inputProps: {
    value: TValue;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    error: string | undefined;
    ref: React.RefObject<HTMLInputElement>;
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
  const ref = useRef<HTMLInputElement>(null);
  return {
    inputProps: {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(getValueFromEvent(e));
      },
      onBlur: () => {
        setIsValidating(true);
      },
      error: isValidating ? validate(value) : undefined,
      ref
    },
    value: value,
    setValue,
    isValid: () => validate(value) === undefined,
    displayValidation: (isVisible: boolean) => {
      setIsValidating(isVisible);
    },
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

export function useDialogForm(entries: FormEntry<any>[], onSubmit: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  const okButtonRef = useRef<HTMLButtonElement>(null);
  const firstFormInput = entries[0].inputProps.ref;
  const submit = useCallback(() => {
    if (entries.every(entry => entry.isValid())) {
      onSubmit();
      setIsOpen(false);
    } else {
      for (const entry of entries) {
        entry.displayValidation(true);
      }
    }
  }, [entries, onSubmit]);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (entries[0]) {
    entries[0].inputProps.onKeyDown = e => {
      if (e.key === "Tab" && e.shiftKey && okButtonRef.current) {
        e.preventDefault();
        okButtonRef.current.focus();
      }
    };
  }

  useEffect(() => {
    if (isOpen && firstFormInput.current) {
      firstFormInput.current.focus();
      firstFormInput.current.setSelectionRange(
        0,
        firstFormInput.current.value.length
      );
    }
  }, [isOpen, firstFormInput]);
  return {
    isOpen: isOpen,
    open: () => {
      for (const entry of entries) {
        entry.reset();
      }
      setIsOpen(true);
    },
    close,
    submit,
    dialogProps: {
      isOpen,
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter") {
          submit();
        } else if (e.key === "Escape") {
          close();
        }
      }
    },
    cancelButtonProps: {
      onClick: close,
      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter") {
          e.stopPropagation();
        }
      }
    },
    okButtonProps: {
      onClick: submit,
      ref: okButtonRef,
      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter") {
          e.stopPropagation();
        }
        if (
          e.key === "Tab" &&
          e.shiftKey === false &&
          entries[0] != null &&
          entries[0].inputProps.ref.current
        ) {
          entries[0].inputProps.ref.current.focus();
          e.preventDefault();
        }
      }
    }
  };
}
