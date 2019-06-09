/** @jsx jsx */
import { jsx } from "@emotion/core";

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
      type="number"
      value={value !== null ? value : ""}
      onChange={e =>
        onChange(e.target.valueAsNumber === NaN ? null : e.target.valueAsNumber)
      }
      min={min}
      max={max}
      step={step}
    />
  );
}

export default NumberInput;
