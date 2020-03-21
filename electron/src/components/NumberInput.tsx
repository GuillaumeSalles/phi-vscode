/** @jsx jsx */
import { jsx } from "@emotion/core";
import { styleEditorInput } from "../styles";
import { stopKeydownPropagationIfNecessary } from "../utils";

type Props = {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
};

function NumberInput({ value, onChange, min, max, step }: Props) {
  return (
    <input
      css={styleEditorInput}
      type="number"
      value={value !== null ? value : ""}
      onChange={e =>
        onChange(
          Number.isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber
        )
      }
      min={min}
      max={max}
      step={step}
    />
  );
}

export default NumberInput;
