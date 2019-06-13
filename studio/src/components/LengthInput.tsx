/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../types";
import NumberInput from "./NumberInput";

type Props = {
  onChange: (event: T.Length | undefined) => void;
  length: T.Length | undefined;
  defaultValue: number | null;
};

export default function LengthInput({ length, onChange, defaultValue }: Props) {
  return (
    <NumberInput
      value={length ? length.value : defaultValue}
      onChange={value =>
        onChange(value !== null ? { type: "px", value } : undefined)
      }
    />
  );
}
