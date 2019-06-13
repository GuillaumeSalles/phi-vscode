/** @jsx jsx */
import { jsx } from "@emotion/core";
import { colors } from "../styles";

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
      css={{
        WebkitAppearance: "none",
        borderStyle: "solid",
        borderWidth: "0 0 1px 0",
        borderColor: "transparent",
        height: "24px",
        fontSize: "12px",
        lineHeight: 0,
        padding: 0,
        boxSizing: "border-box",
        outline: "none",
        width: "36px",
        transition:
          "border 0.2s ease 0s, background 0.2s ease 0s, color 0.2s ease-out 0s",
        ":focus": {
          borderColor: colors.primary
        }
      }}
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
