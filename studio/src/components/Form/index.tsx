import React, { useState, useRef, useEffect, useCallback } from "react";
export { default as FormInput } from "./FormInput";
export { default as FormNumberInput } from "./FormNumberInput";
export { default as FormSelect } from "./FormSelect";

function defaultValidator<T>(value: T) {
  return undefined;
}

export type FormEntry<TValue, TElement> = {
  value: TValue;
  inputProps: {
    value: TValue;
    onChange: (e: React.ChangeEvent<TElement>) => void;
    onBlur: (e: React.ChangeEvent<TElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<TElement>) => void;
    error: string | undefined;
    ref: React.RefObject<TElement>;
  };
  isValid: () => boolean;
  displayValidation: (isVisible: boolean) => void;
  setValue: (value: TValue) => void;
  reset: () => void;
  focus: () => void;
};

function useFormEntry<TValue, TElement>(
  defaultValue: TValue,
  validate: (value: TValue) => string | undefined,
  getValueFromEvent: (e: React.ChangeEvent<TElement>) => TValue,
  focus: (element: TElement) => void
): FormEntry<TValue, TElement> {
  const [value, setValue] = useState(defaultValue);
  const [isValidating, setIsValidating] = useState(false);
  const ref = useRef<TElement>(null);
  return {
    inputProps: {
      value,
      onChange: (e: React.ChangeEvent<TElement>) => {
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
    },
    focus: () => {
      if (ref.current) {
        focus(ref.current);
      }
    }
  };
}

export function useStringFormEntry(
  defaultValue: string,
  validate: (value: string) => string | undefined = defaultValidator
) {
  return useFormEntry<string, HTMLInputElement>(
    defaultValue,
    validate,
    e => e.target.value,
    input => {
      input.focus();
      input.setSelectionRange(0, input.value.length);
    }
  );
}

export function useNumberFormEntry(
  defaultValue: number | undefined,
  validate: (value: number | undefined) => string | undefined = defaultValidator
) {
  return useFormEntry<number | undefined, HTMLInputElement>(
    defaultValue,
    validate,
    e => e.target.valueAsNumber,
    input => {
      input.focus();
      input.setSelectionRange(0, input.value.length);
    }
  );
}

export function useSelectFormEntry(
  defaultValue: string | undefined,
  validate: (value: string | undefined) => string | undefined = defaultValidator
) {
  return useFormEntry<string | undefined, HTMLSelectElement>(
    defaultValue,
    validate,
    e => e.target.value,
    input => input.focus()
  );
}

export function useDialogForm(
  entries: FormEntry<any, any>[],
  onSubmit: () => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const okButtonRef = useRef<HTMLButtonElement>(null);
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
    if (isOpen) {
      entries[0].focus();
    }
  }, [isOpen, entries[0].inputProps.ref.current]);
  return {
    open: () => {
      for (const entry of entries) {
        entry.reset();
      }
      setIsOpen(true);
    },
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
      margin: "0 8px 0 0",
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
        if (e.key === "Tab" && e.shiftKey === false && entries[0] != null) {
          entries[0].focus();
          e.preventDefault();
        }
      }
    }
  };
}
